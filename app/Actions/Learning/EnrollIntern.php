<?php

namespace App\Actions\Learning;

use App\Models\Enrollment;
use App\Models\LearningPath;
use App\Models\User;
use App\Services\Learning\EnrollmentService;

final class EnrollIntern
{
    public function __construct(
        private readonly EnrollmentService $enrollmentService,
    ) {}

    public function execute(User $user, LearningPath $path, ?User $mentor = null): Enrollment
    {
        return $this->enrollmentService->enroll($user, $path, $mentor);
    }
}
