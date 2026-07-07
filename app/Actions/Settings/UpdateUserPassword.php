<?php

namespace App\Actions\Settings;

use App\Models\User;

final class UpdateUserPassword
{
    public function execute(User $user, string $password): void
    {
        $user->update([
            'password' => $password,
        ]);
    }
}
