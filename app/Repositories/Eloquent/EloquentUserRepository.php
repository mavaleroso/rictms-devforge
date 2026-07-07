<?php

namespace App\Repositories\Eloquent;

use App\Models\User;
use App\Repositories\Contracts\UserRepository;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

final class EloquentUserRepository implements UserRepository
{
    public function create(array $attributes): User
    {
        return User::create($attributes);
    }

    public function findById(int $id): User
    {
        return User::findOrFail($id);
    }

    public function updateProfile(User $user, array $attributes): void
    {
        $user->fill($attributes);

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();
    }

    public function updatePassword(User $user, string $password): void
    {
        $user->update(['password' => $password]);
    }

    public function resetPassword(User $user, string $password): void
    {
        $user->forceFill([
            'password' => $password,
            'remember_token' => Str::random(60),
        ])->save();
    }

    public function delete(User $user): void
    {
        $user->delete();
    }

    public function assignRole(User $user, string $role): void
    {
        $user->assignRole($role);
    }

    public function listWithRoles(): Collection
    {
        return User::with('roles')->orderBy('name')->get();
    }

    public function byRole(string $role, array $columns = ['*']): Collection
    {
        return User::role($role)->get($columns);
    }

    public function countByRole(array|string $roles): int
    {
        return User::role($roles)->count();
    }
}
