<?php

namespace App\Services\Learning;

use App\Enums\ProgressStatus;
use App\Models\Enrollment;
use App\Models\LearningMaterial;
use App\Models\Level;
use App\Models\Video;
use App\Repositories\Contracts\ContentCompletionRepository;
use App\Repositories\Contracts\EnrollmentRepository;
use App\Repositories\Contracts\LevelProgressRepository;
use App\Repositories\Contracts\LevelRepository;
use App\Repositories\Contracts\ChallengeSubmissionRepository;
use App\Repositories\Contracts\QuizAttemptRepository;
use App\Enums\XpSourceType;
use App\Library\Gamification\XpRules;
use App\Services\Certificate\CertificateService;
use App\Services\Gamification\GamificationService;
use Illuminate\Support\Facades\DB;

final class ProgressEngine
{
    public function __construct(
        private readonly ContentCompletionRepository $completions,
        private readonly QuizAttemptRepository $quizAttempts,
        private readonly ChallengeSubmissionRepository $challengeSubmissions,
        private readonly LevelRepository $levels,
        private readonly LevelProgressRepository $levelProgress,
        private readonly EnrollmentRepository $enrollments,
        private readonly GamificationService $gamification,
        private readonly CertificateService $certificates,
    ) {}

    public function evaluate(Enrollment $enrollment, Level $level): bool
    {
        $userId = $enrollment->user_id;

        $materialIds = $this->levels->materialIds($level);
        $videoIds = $this->levels->videoIds($level);

        $completedMaterials = $this->completions->countCompletedForUser(
            $userId,
            (new LearningMaterial)->getMorphClass(),
            $materialIds,
        );

        $completedVideos = $this->completions->countCompletedForUser(
            $userId,
            (new Video)->getMorphClass(),
            $videoIds,
        );

        $materialsComplete = $materialIds->isEmpty() || $completedMaterials >= $materialIds->count();
        $videosComplete = $videoIds->isEmpty() || $completedVideos >= $videoIds->count();

        $quizPassed = true;
        $quiz = $level->quiz;

        if ($quiz) {
            $quizPassed = $this->quizAttempts->hasPassed($userId, $quiz->id);
        }

        $challengePassed = true;
        $level->loadMissing('codingChallenge');
        $challenge = $level->codingChallenge;

        if ($challenge && $challenge->is_active) {
            $challengePassed = $this->challengeSubmissions->hasPassed($userId, $challenge->id);
        }

        if (! ($materialsComplete && $videosComplete && $quizPassed && $challengePassed)) {
            return false;
        }

        $progress = $this->levelProgress->findForEnrollmentAndLevel($enrollment, $level);

        if (! $progress || $progress->status === ProgressStatus::Completed) {
            return $progress?->status === ProgressStatus::Completed;
        }

        return DB::transaction(function () use ($enrollment, $level, $progress) {
            $this->levelProgress->markCompleted($progress);

            $this->gamification->awardXp(
                $enrollment->user,
                XpSourceType::LevelComplete,
                $level->id,
                XpRules::level($level->difficulty->value),
                'Level completed: '.$level->title,
                ['level_number' => $level->number],
            );

            $nextLevel = $this->levels->findNext($level);

            if ($nextLevel) {
                $nextProgress = $this->levelProgress->findForEnrollmentAndLevel($enrollment, $nextLevel);

                if ($nextProgress) {
                    $this->levelProgress->unlock($nextProgress);
                }
            } elseif ($level->number >= 20) {
                $this->enrollments->markCompleted($enrollment->fresh());

                $this->gamification->awardXp(
                    $enrollment->user,
                    XpSourceType::PathComplete,
                    $enrollment->learning_path_id,
                    XpRules::pathComplete(),
                    'Learning path completed',
                );

                $this->certificates->issueForEnrollment($enrollment->fresh());
            }

            return true;
        });
    }
}
