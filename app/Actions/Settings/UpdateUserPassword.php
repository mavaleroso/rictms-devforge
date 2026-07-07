<?php

namespace App\Actions\Settings;

use App\Models\User;
use App\Repositories\Contracts\UserRepository;

final class UpdateUserPassword
{
    public function __construct(
        private readonly UserRepository $users,
    ) {}

    public function execute(User $user, string $password): void
    {
        $this->users->updatePassword($user, $password);
    }
}
