<?php

namespace App\Actions\Auth;

use App\Models\User;
use Illuminate\Auth\Events\Registered;

final class RegisterUser
{
    public function execute(string $name, string $email, string $password): User
    {
        $user = User::create([
            'name' => $name,
            'email' => $email,
            'password' => $password,
        ]);

        event(new Registered($user));

        return $user;
    }
}
