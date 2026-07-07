<?php

namespace App\Services\Learning;

use App\Models\Enrollment;
use App\Models\LearningPath;
use App\Models\User;
use App\Repositories\Contracts\EnrollmentRepository;
use App\Repositories\Contracts\LevelRepository;
use Illuminate\Support\Facades\DB;

final class EnrollmentService
{
    public function __construct(
        private readonly EnrollmentRepository $enrollments,
        private readonly LevelRepository $levels,
    ) {}

    public function enroll(User $user, LearningPath $path, ?User $mentor = null): Enrollment
    {
        $existing = $this->enrollments->findActiveForUserAndPath($user, $path);

        if ($existing) {
            return $existing;
        }

        return DB::transaction(function () use ($user, $path, $mentor) {
            $levelCollection = $this->levels->orderedForPath($path);

            return $this->enrollments->createWithLevelProgress($user, $path, $mentor, $levelCollection);
        });
    }
}
