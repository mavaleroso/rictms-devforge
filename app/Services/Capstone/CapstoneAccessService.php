<?php

namespace App\Services\Capstone;

use App\Enums\CapstoneMilestoneStatus;
use App\Enums\CapstoneProjectStatus;
use App\Enums\CapstoneTaskStatus;
use App\Enums\ProgressStatus;
use App\Models\CapstoneProject;
use App\Models\CapstoneTemplate;
use App\Models\Enrollment;
use App\Models\User;
use App\Repositories\Contracts\CapstoneProjectRepository;
use App\Repositories\Contracts\CapstoneTemplateRepository;
use App\Repositories\Contracts\EnrollmentRepository;
use App\Repositories\Contracts\LevelRepository;
use App\Services\Learning\ProgressEngine;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

final class CapstoneAccessService
{
    public function __construct(
        private readonly EnrollmentRepository $enrollments,
        private readonly CapstoneProjectRepository $projects,
    ) {}

    public function canAccess(User $intern): bool
    {
        $enrollment = $this->enrollments->findActiveForUser($intern);

        if (! $enrollment) {
            return false;
        }

        if ($this->projects->findForEnrollment($enrollment)) {
            return true;
        }

        return $this->isCapstoneLevelUnlocked($enrollment);
    }

    public function isCapstoneLevelUnlocked(Enrollment $enrollment): bool
    {
        $enrollment->loadMissing('levelProgress.level');

        return $enrollment->levelProgress
            ->first(fn ($progress) => $progress->level?->number === 20)
            ?->status !== ProgressStatus::Locked;
    }

    public function requireAccess(User $intern): Enrollment
    {
        $enrollment = $this->enrollments->findActiveForUser($intern);

        if (! $enrollment) {
            throw ValidationException::withMessages([
                'capstone' => 'You need an active enrollment to access the capstone project.',
            ]);
        }

        if (! $this->canAccess($intern)) {
            throw ValidationException::withMessages([
                'capstone' => 'Complete earlier levels to unlock the capstone project.',
            ]);
        }

        return $enrollment;
    }
}
