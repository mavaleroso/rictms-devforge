<?php

namespace App\Services\Admin;

use App\Models\User;
use App\Repositories\Contracts\RoleRepository;
use App\Repositories\Contracts\UserRepository;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

final class UserService
{
    public function __construct(
        private readonly UserRepository $users,
        private readonly RoleRepository $roles,
    ) {}

    /**
     * @param  array<string, mixed>  $attributes
     */
    public function create(array $attributes, ?UploadedFile $avatar = null): User
    {
        $role = $attributes['role'] ?? 'intern';
        unset($attributes['role'], $attributes['avatar'], $attributes['remove_avatar'], $attributes['password_confirmation']);

        $this->roles->ensureExists($role);

        $user = $this->users->create($attributes);
        $this->users->syncRole($user, $role);

        if ($avatar) {
            $this->storeAvatar($user, $avatar);
        }

        return $user->fresh(['roles']);
    }

    /**
     * @param  array<string, mixed>  $attributes
     */
    public function update(User $user, array $attributes, ?UploadedFile $avatar = null, bool $removeAvatar = false): User
    {
        $role = $attributes['role'] ?? null;
        unset($attributes['role'], $attributes['avatar'], $attributes['remove_avatar'], $attributes['password_confirmation']);

        if (array_key_exists('password', $attributes) && blank($attributes['password'])) {
            unset($attributes['password']);
        }

        $this->users->update($user, $attributes);

        if ($role) {
            $this->roles->ensureExists($role);
            $this->users->syncRole($user, $role);
        }

        $this->syncAvatar($user, $avatar, $removeAvatar);

        return $user->fresh(['roles']);
    }

    public function setActiveStatus(User $user, User $actor, bool $isActive): User
    {
        if (! $isActive && $actor->id === $user->id) {
            throw ValidationException::withMessages([
                'is_active' => 'You cannot deactivate your own account.',
            ]);
        }

        if (! $isActive && $user->isAdmin() && User::role('admin')->where('is_active', true)->count() <= 1) {
            throw ValidationException::withMessages([
                'is_active' => 'At least one active admin account must remain in the system.',
            ]);
        }

        $this->users->update($user, ['is_active' => $isActive]);

        return $user->fresh(['roles']);
    }

    public function delete(User $user, User $actor): void
    {
        if ($actor->id === $user->id) {
            throw ValidationException::withMessages([
                'user' => 'You cannot delete your own account from the admin panel.',
            ]);
        }

        if ($user->isAdmin() && $this->users->countByRole('admin') <= 1) {
            throw ValidationException::withMessages([
                'user' => 'At least one admin account must remain in the system.',
            ]);
        }

        $this->deleteAvatar($user);
        $this->users->delete($user);
    }

    public function syncAvatar(User $user, ?UploadedFile $avatar = null, bool $remove = false): void
    {
        if ($remove) {
            $this->deleteAvatar($user);
        }

        if ($avatar) {
            $this->deleteAvatar($user);
            $this->storeAvatar($user, $avatar);
        }
    }

    private function storeAvatar(User $user, UploadedFile $avatar): void
    {
        $user->update([
            'avatar' => $avatar->store("users/avatars/{$user->id}", 'public'),
        ]);
    }

    private function deleteAvatar(User $user): void
    {
        if (! $user->avatar) {
            return;
        }

        Storage::disk('public')->delete($user->avatar);
        $user->update(['avatar' => null]);
    }
}
