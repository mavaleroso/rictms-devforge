<?php

namespace App\Actions\Learning;

use App\Models\ContentCompletion;
use App\Models\LearningMaterial;
use App\Models\User;
use App\Models\Video;
use App\Repositories\Contracts\ContentCompletionRepository;
use App\Repositories\Contracts\EnrollmentRepository;
use App\Repositories\Contracts\LevelProgressRepository;
use App\Services\Learning\ProgressEngine;
use Illuminate\Database\Eloquent\Model;

final class CompleteContent
{
    public function __construct(
        private readonly ContentCompletionRepository $completions,
        private readonly EnrollmentRepository $enrollments,
        private readonly LevelProgressRepository $levelProgress,
        private readonly ProgressEngine $progressEngine,
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

        return $completion;
    }
}
