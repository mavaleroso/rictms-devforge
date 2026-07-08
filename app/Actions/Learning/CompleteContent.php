<?php

namespace App\Actions\Learning;

use App\Enums\XpSourceType;
use App\Library\Gamification\XpRules;
use App\Models\ContentCompletion;
use App\Models\LearningMaterial;
use App\Models\User;
use App\Models\Video;
use App\Repositories\Contracts\ContentCompletionRepository;
use App\Repositories\Contracts\EnrollmentRepository;
use App\Repositories\Contracts\LevelProgressRepository;
use App\Services\Gamification\GamificationService;
use App\Services\Learning\ProgressEngine;
use Illuminate\Database\Eloquent\Model;

final class CompleteContent
{
    public function __construct(
        private readonly ContentCompletionRepository $completions,
        private readonly EnrollmentRepository $enrollments,
        private readonly LevelProgressRepository $levelProgress,
        private readonly ProgressEngine $progressEngine,
        private readonly GamificationService $gamification,
    ) {}

    public function execute(User $user, Model $content): ContentCompletion
    {
        $completion = $this->completions->markComplete($user, $content);

        $level = $content instanceof LearningMaterial || $content instanceof Video
            ? $content->level
            : null;

        if ($level) {
            $enrollment = $this->enrollments->findActiveForUserAndPath($user, $level->learning_path_id);

            if ($enrollment) {
                $progress = $this->levelProgress->findForEnrollmentAndLevel($enrollment, $level);

                if ($progress) {
                    $this->levelProgress->markInProgress($progress);
                }

                $this->progressEngine->evaluate($enrollment, $level);
            }
        }

        if ($completion->wasRecentlyCreated) {
            $this->awardCompletionXp($user, $content);
        }

        return $completion;
    }

    private function awardCompletionXp(User $user, Model $content): void
    {
        if ($content instanceof LearningMaterial) {
            $this->gamification->awardXp(
                $user,
                XpSourceType::MaterialComplete,
                $content->id,
                XpRules::material(),
                'Lesson completed',
            );

            return;
        }

        if ($content instanceof Video) {
            $this->gamification->awardXp(
                $user,
                XpSourceType::VideoComplete,
                $content->id,
                XpRules::video(),
                'Video completed',
            );
        }
    }
}
