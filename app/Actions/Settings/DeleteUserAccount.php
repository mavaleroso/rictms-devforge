<?php

namespace App\Actions\Settings;

use App\Models\User;
use App\Repositories\Contracts\UserRepository;

final class DeleteUserAccount
{
    public function __construct(
        private readonly UserRepository $users,
    ) {}

    public function execute(User $user): void
    {
        $this->users->delete($user);
    }
}
