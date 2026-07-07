<?php

namespace App\Repositories\Contracts;

interface RoleRepository
{
    public function ensureExists(string $name, string $guard = 'web'): void;
}
