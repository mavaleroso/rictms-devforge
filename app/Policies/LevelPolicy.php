<?php

namespace App\Policies;

use App\Enums\ProgressStatus;
use App\Models\Level;
use App\Models\User;
use App\Repositories\Contracts\EnrollmentRepository;
use App\Repositories\Contracts\LevelProgressRepository;

class LevelPolicy
{
    public function __construct(
        private readonly EnrollmentRepository $enrollments,
        private readonly LevelProgressRepository $levelProgress,
    ) {}

    public function view(User $user, Level $level): bool
    {
        if ($user->isAdmin() || $user->isMentor()) {
            return true;
        }

        if (! $user->isIntern()) {
            return false;
        }

        $enrollment = $this->enrollments->findActiveForUserAndPath($user, $level->learning_path_id);

        if (! $enrollment) {
            return false;
        }

        $progress = $this->levelProgress->findForEnrollmentAndLevel($enrollment, $level);

        return $progress && $progress->status !== ProgressStatus::Locked;
    }

    public function update(User $user, Level $level): bool
    {
        return $user->isAdmin();
    }
}
