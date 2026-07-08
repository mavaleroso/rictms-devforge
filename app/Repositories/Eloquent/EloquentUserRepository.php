<?php

namespace App\Repositories\Eloquent;

use App\Models\User;
use App\Repositories\Contracts\UserRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

final class EloquentUserRepository implements UserRepository
{
    public function create(array $attributes): User
    {
        $attributes = $this->prepareProfileAttributes($attributes);

        return User::create($attributes);
    }

    public function findById(int $id): User
    {
        return User::findOrFail($id);
    }

    public function updateProfile(User $user, array $attributes): void
    {
        $this->update($user, $attributes);
    }

    public function update(User $user, array $attributes): void
    {
        $attributes = $this->prepareProfileAttributes($attributes);

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

    public function syncRole(User $user, string $role): void
    {
        $user->syncRoles([$role]);
    }

    public function listWithRoles(): Collection
    {
        return User::with('roles')
            ->withCount(['enrollments', 'mentoredEnrollments'])
            ->orderBy('last_name')
            ->orderBy('first_name')
            ->get();
    }

    public function paginateWithRoles(
        int $perPage = 15,
        ?string $search = null,
        ?string $sort = null,
        string $direction = 'asc',
    ): LengthAwarePaginator {
        $query = User::query()
            ->with('roles')
            ->withCount(['enrollments', 'mentoredEnrollments']);

        if ($search !== null && $search !== '') {
            $term = '%'.addcslashes($search, '%_\\').'%';

            $query->where(function ($builder) use ($term) {
                $builder->where('name', 'like', $term)
                    ->orWhere('email', 'like', $term)
                    ->orWhere('first_name', 'like', $term)
                    ->orWhere('last_name', 'like', $term)
                    ->orWhere('phone', 'like', $term)
                    ->orWhere('occupation', 'like', $term);
            });
        }

        $direction = strtolower($direction) === 'desc' ? 'desc' : 'asc';

        match ($sort) {
            'email' => $query->orderBy('email', $direction),
            'created_at' => $query->orderBy('created_at', $direction),
            default => $query->orderBy('last_name', $direction)->orderBy('first_name', $direction),
        };

        return $query->paginate($perPage);
    }

    public function byRole(string $role, array $columns = ['*']): Collection
    {
        return User::role($role)->get($columns);
    }

    public function countByRole(array|string $roles): int
    {
        return User::role($roles)->count();
    }

    /**
     * @param  array<string, mixed>  $attributes
     * @return array<string, mixed>
     */
    private function prepareProfileAttributes(array $attributes): array
    {
        foreach (['middle_name', 'phone', 'sex', 'birthdate', 'address', 'occupation', 'bio'] as $field) {
            if (array_key_exists($field, $attributes) && blank($attributes[$field])) {
                $attributes[$field] = null;
            }
        }

        if (isset($attributes['first_name']) || isset($attributes['middle_name']) || isset($attributes['last_name'])) {
            $attributes['name'] = User::composeFullName(
                $attributes['first_name'] ?? null,
                $attributes['middle_name'] ?? null,
                $attributes['last_name'] ?? null,
            );
        }

        return $attributes;
    }
}
