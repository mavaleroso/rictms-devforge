<?php

namespace App\Actions\Auth;

use App\Models\User;
use App\Repositories\Contracts\UserRepository;
use Illuminate\Auth\Events\PasswordReset;

final class ResetUserPassword
{
    public function __construct(
        private readonly UserRepository $users,
    ) {}

    public function execute(User $user, string $password): void
    {
        $this->users->resetPassword($user, $password);

        event(new PasswordReset($user));
    }
}
