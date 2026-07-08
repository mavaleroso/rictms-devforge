<?php

namespace App\Repositories\Contracts;

use App\Models\Certificate;
use App\Models\Enrollment;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface CertificateRepository
{
    public function findById(int $id): ?Certificate;

    public function findByVerificationCode(string $code): ?Certificate;

    public function findForEnrollment(Enrollment $enrollment): ?Certificate;

    public function create(array $attributes): Certificate;

    public function forUser(User $user): Collection;

    public function paginateWithRelations(
        int $perPage = 15,
        ?string $search = null,
        ?string $sort = null,
        string $direction = 'desc',
    ): LengthAwarePaginator;

    public function countIssued(): int;

    public function countIssuedSince(\DateTimeInterface $since): int;
}
