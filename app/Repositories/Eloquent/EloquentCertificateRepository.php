<?php

namespace App\Repositories\Eloquent;

use App\Models\Certificate;
use App\Models\Enrollment;
use App\Models\User;
use App\Repositories\Contracts\CertificateRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

final class EloquentCertificateRepository implements CertificateRepository
{
    public function findById(int $id): ?Certificate
    {
        return Certificate::query()->find($id);
    }

    public function findByVerificationCode(string $code): ?Certificate
    {
        return Certificate::query()
            ->where('verification_code', $code)
            ->with(['user', 'learningPath', 'enrollment.mentor'])
            ->first();
    }

    public function findForEnrollment(Enrollment $enrollment): ?Certificate
    {
        return Certificate::query()
            ->where('enrollment_id', $enrollment->id)
            ->first();
    }

    public function create(array $attributes): Certificate
    {
        return Certificate::create($attributes);
    }

    public function forUser(User $user): Collection
    {
        return Certificate::query()
            ->where('user_id', $user->id)
            ->with('learningPath')
            ->orderByDesc('issued_at')
            ->get();
    }

    public function paginateWithRelations(
        int $perPage = 15,
        ?string $search = null,
        ?string $sort = null,
        string $direction = 'desc',
    ): LengthAwarePaginator {
        $query = Certificate::query()
            ->with(['user', 'learningPath', 'enrollment.mentor']);

        if ($search !== null && $search !== '') {
            $term = '%'.addcslashes($search, '%_\\').'%';

            $query->where(function ($builder) use ($term) {
                $builder->where('certificate_number', 'like', $term)
                    ->orWhere('verification_code', 'like', $term)
                    ->orWhereHas('user', function ($userQuery) use ($term) {
                        $userQuery->where('name', 'like', $term)
                            ->orWhere('email', 'like', $term);
                    })
                    ->orWhereHas('learningPath', function ($pathQuery) use ($term) {
                        $pathQuery->where('name', 'like', $term);
                    });
            });
        }

        $direction = strtolower($direction) === 'asc' ? 'asc' : 'desc';

        match ($sort) {
            'issued_at' => $query->orderBy('issued_at', $direction),
            'certificate_number' => $query->orderBy('certificate_number', $direction),
            default => $query->orderByDesc('issued_at'),
        };

        return $query->paginate($perPage);
    }

    public function countIssued(): int
    {
        return Certificate::count();
    }

    public function countIssuedSince(\DateTimeInterface $since): int
    {
        return Certificate::query()
            ->where('issued_at', '>=', $since)
            ->count();
    }
}
