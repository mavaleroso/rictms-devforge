<?php

namespace App\Actions\Auth;

use App\Models\User;
use App\Repositories\Contracts\RoleRepository;
use App\Repositories\Contracts\UserRepository;
use Illuminate\Auth\Events\Registered;

final class RegisterUser
{
    public function __construct(
        private readonly UserRepository $users,
        private readonly RoleRepository $roles,
    ) {}

    public function execute(string $name, string $email, string $password): User
    {
        $this->roles->ensureExists('intern');

        $user = $this->users->create([
            'name' => $name,
            'email' => $email,
            'password' => $password,
        ]);

        $this->users->assignRole($user, 'intern');

        event(new Registered($user));

        return $user;
    }
}
