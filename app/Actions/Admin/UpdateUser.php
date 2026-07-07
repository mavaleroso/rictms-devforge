<?php

namespace App\Actions\Admin;

use App\Models\User;
use App\Services\Admin\UserService;
use Illuminate\Http\UploadedFile;

final class UpdateUser
{
    public function __construct(
        private readonly UserService $users,
    ) {}

    /**
     * @param  array<string, mixed>  $attributes
     */
    public function execute(User $user, array $attributes, ?UploadedFile $avatar = null, bool $removeAvatar = false): User
    {
        return $this->users->update($user, $attributes, $avatar, $removeAvatar);
    }
}
