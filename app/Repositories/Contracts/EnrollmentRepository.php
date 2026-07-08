<?php

namespace App\Repositories\Contracts;

use App\Enums\EnrollmentStatus;
use App\Models\Enrollment;
use App\Models\LearningPath;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface EnrollmentRepository
{
    public function findActiveForUser(User $user): ?Enrollment;

    public function findActiveForUserAndPath(User $user, LearningPath|int $path): ?Enrollment;

    public function findForUserAndPath(User $user, LearningPath|int $path): ?Enrollment;

    public function createWithLevelProgress(User $user, LearningPath $path, ?User $mentor, Collection $levels): Enrollment;

    /** @return Collection<int, Enrollment> */
    public function listWithRelations(): Collection;

    public function paginateWithRelations(
        int $perPage = 15,
        ?string $search = null,
        ?string $sort = null,
        string $direction = 'asc',
    ): LengthAwarePaginator;

    public function countWithMentor(): int;

    /** @return Collection<int, Enrollment> */
    public function forMentor(int $mentorId): Collection;

    public function forMentorAndIntern(int $mentorId, int $internId): Enrollment;

    public function markCompleted(Enrollment $enrollment): void;

    public function countByStatus(EnrollmentStatus $status): int;
}
