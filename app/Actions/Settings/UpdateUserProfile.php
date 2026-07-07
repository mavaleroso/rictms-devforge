<?php

namespace App\Actions\Settings;

use App\Models\User;
use App\Repositories\Contracts\UserRepository;

final class UpdateUserProfile
{
    public function __construct(
        private readonly UserRepository $users,
    ) {}

    /**
     * @param  array{name: string, email: string}  $attributes
     */
    public function execute(User $user, array $attributes): void
    {
        $this->users->updateProfile($user, $attributes);
    }
}
