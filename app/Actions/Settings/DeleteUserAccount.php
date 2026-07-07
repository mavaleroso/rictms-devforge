<?php

namespace App\Actions\Settings;

use App\Models\User;

final class DeleteUserAccount
{
    public function execute(User $user): void
    {
        $user->delete();
    }
}
