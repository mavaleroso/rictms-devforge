<?php

namespace App\Actions\Auth;

use App\Models\User;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Str;

final class ResetUserPassword
{
    public function execute(User $user, string $password): void
    {
        $user->forceFill([
            'password' => $password,
            'remember_token' => Str::random(60),
        ])->save();

        event(new PasswordReset($user));
    }
}
