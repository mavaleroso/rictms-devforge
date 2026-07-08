<?php

namespace App\Actions\Settings;

use App\Models\User;
use App\Repositories\Contracts\UserRepository;
use App\Services\Admin\UserService;
use Illuminate\Http\UploadedFile;

final class UpdateUserProfile
{
    public function __construct(
        private readonly UserRepository $users,
        private readonly UserService $userService,
    ) {}

    /**
     * @param  array<string, mixed>  $attributes
     */
    public function execute(
        User $user,
        array $attributes,
        ?UploadedFile $avatar = null,
        bool $removeAvatar = false,
    ): void {
        unset($attributes['avatar'], $attributes['remove_avatar']);

        $this->users->updateProfile($user, $attributes);
        $this->userService->syncAvatar($user, $avatar, $removeAvatar);
    }
}
