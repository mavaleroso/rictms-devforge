<?php

namespace App\Repositories\Contracts;

use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface UserRepository
{
    public function create(array $attributes): User;

    public function findById(int $id): User;

    public function updateProfile(User $user, array $attributes): void;

    public function update(User $user, array $attributes): void;

    public function updatePassword(User $user, string $password): void;

    public function resetPassword(User $user, string $password): void;

    public function delete(User $user): void;

    public function assignRole(User $user, string $role): void;

    public function syncRole(User $user, string $role): void;

    /** @return Collection<int, User> */
    public function listWithRoles(): Collection;

    public function paginateWithRoles(
        int $perPage = 15,
        ?string $search = null,
        ?string $sort = null,
        string $direction = 'asc',
    ): LengthAwarePaginator;

    /** @return Collection<int, User> */
    public function byRole(string $role, array $columns = ['*']): Collection;

    public function countByRole(array|string $roles): int;
}
