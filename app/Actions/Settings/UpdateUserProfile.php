<?php

namespace App\Actions\Settings;

use App\Models\User;

final class UpdateUserProfile
{
    /**
     * @param  array{name: string, email: string}  $attributes
     */
    public function execute(User $user, array $attributes): void
    {
        $user->fill($attributes);

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();
    }
}
