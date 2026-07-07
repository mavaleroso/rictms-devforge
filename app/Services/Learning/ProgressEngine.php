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
use App\Repositories\Contracts\QuizAttemptRepository;
use Illuminate\Support\Facades\DB;

final class ProgressEngine
{
    public function __construct(
        private readonly ContentCompletionRepository $completions,
        private readonly QuizAttemptRepository $quizAttempts,
        private readonly LevelRepository $levels,
        private readonly LevelProgressRepository $levelProgress,
        private readonly EnrollmentRepository $enrollments,
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

        if (! ($materialsComplete && $videosComplete && $quizPassed)) {
            return false;
        }

        $progress = $this->levelProgress->findForEnrollmentAndLevel($enrollment, $level);

        if (! $progress || $progress->status === ProgressStatus::Completed) {
            return $progress?->status === ProgressStatus::Completed;
        }

        return DB::transaction(function () use ($enrollment, $level, $progress) {
            $this->levelProgress->markCompleted($progress);

            $nextLevel = $this->levels->findNext($level);

            if ($nextLevel) {
                $nextProgress = $this->levelProgress->findForEnrollmentAndLevel($enrollment, $nextLevel);

                if ($nextProgress) {
                    $this->levelProgress->unlock($nextProgress);
                }
            } elseif ($level->number >= 20) {
                $this->enrollments->markCompleted($enrollment);
            }

            return true;
        });
    }
}
