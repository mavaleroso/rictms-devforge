<?php

namespace App\Actions\Admin;

use App\Models\User;
use App\Services\Admin\UserService;

final class DeleteUser
{
    public function __construct(
        private readonly UserService $users,
    ) {}

    public function execute(User $user, User $actor): void
    {
        $this->users->delete($user, $actor);
    }
}
