<?php

namespace App\Repositories\Eloquent;

use App\Enums\EnrollmentStatus;
use App\Enums\ProgressStatus;
use App\Models\Enrollment;
use App\Models\LearningPath;
use App\Models\Level;
use App\Models\User;
use App\Repositories\Contracts\EnrollmentRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

final class EloquentEnrollmentRepository implements EnrollmentRepository
{
    public function findActiveForUser(User $user): ?Enrollment
    {
        return $user->enrollments()
            ->where('status', EnrollmentStatus::Active)
            ->with('learningPath')
            ->latest()
            ->first();
    }

    public function findActiveForUserAndPath(User $user, LearningPath|int $path): ?Enrollment
    {
        $pathId = $path instanceof LearningPath ? $path->id : $path;

        return $user->enrollments()
            ->where('learning_path_id', $pathId)
            ->where('status', EnrollmentStatus::Active)
            ->first();
    }

    public function findForUserAndPath(User $user, LearningPath|int $path): ?Enrollment
    {
        $pathId = $path instanceof LearningPath ? $path->id : $path;

        return $user->enrollments()
            ->where('learning_path_id', $pathId)
            ->with(['levelProgress.level'])
            ->first();
    }

    public function createWithLevelProgress(User $user, LearningPath $path, ?User $mentor, Collection $levels): Enrollment
    {
        $enrollment = Enrollment::create([
            'user_id' => $user->id,
            'learning_path_id' => $path->id,
            'mentor_id' => $mentor?->id,
            'status' => EnrollmentStatus::Active,
            'started_at' => now(),
        ]);

        foreach ($levels as $level) {
            /** @var Level $level */
            $enrollment->levelProgress()->create([
                'level_id' => $level->id,
                'status' => $level->number === 1 ? ProgressStatus::Available : ProgressStatus::Locked,
            ]);
        }

        return $enrollment;
    }

    public function listWithRelations(): Collection
    {
        return Enrollment::with(['user', 'learningPath', 'mentor'])->latest()->get();
    }

    public function paginateWithRelations(
        int $perPage = 15,
        ?string $search = null,
        ?string $sort = null,
        string $direction = 'asc',
    ): LengthAwarePaginator {
        $query = Enrollment::query()
            ->with(['user', 'learningPath', 'mentor', 'levelProgress.level']);

        if ($search !== null && $search !== '') {
            $term = '%'.addcslashes($search, '%_\\').'%';

            $query->where(function ($builder) use ($term) {
                $builder->whereHas('user', function ($userQuery) use ($term) {
                    $userQuery->where('name', 'like', $term)
                        ->orWhere('email', 'like', $term)
                        ->orWhere('first_name', 'like', $term)
                        ->orWhere('last_name', 'like', $term);
                })->orWhereHas('learningPath', function ($pathQuery) use ($term) {
                    $pathQuery->where('name', 'like', $term);
                })->orWhereHas('mentor', function ($mentorQuery) use ($term) {
                    $mentorQuery->where('name', 'like', $term)
                        ->orWhere('email', 'like', $term);
                });
            });
        }

        $direction = strtolower($direction) === 'desc' ? 'desc' : 'asc';

        match ($sort) {
            'status' => $query->orderBy('status', $direction),
            'started_at' => $query->orderBy('started_at', $direction),
            default => $query->latest('started_at'),
        };

        return $query->paginate($perPage);
    }

    public function countWithMentor(): int
    {
        return Enrollment::whereNotNull('mentor_id')->count();
    }

    public function forMentor(int $mentorId): Collection
    {
        return Enrollment::query()
            ->where('mentor_id', $mentorId)
            ->with(['user', 'learningPath', 'levelProgress.level'])
            ->latest()
            ->get();
    }

    public function forMentorAndIntern(int $mentorId, int $internId): Enrollment
    {
        return Enrollment::query()
            ->where('mentor_id', $mentorId)
            ->where('user_id', $internId)
            ->with(['user', 'learningPath.levels', 'levelProgress.level'])
            ->firstOrFail();
    }

    public function markCompleted(Enrollment $enrollment): void
    {
        $enrollment->update([
            'status' => EnrollmentStatus::Completed,
            'completed_at' => now(),
        ]);
    }

    public function countByStatus(EnrollmentStatus $status): int
    {
        return Enrollment::where('status', $status)->count();
    }
}
