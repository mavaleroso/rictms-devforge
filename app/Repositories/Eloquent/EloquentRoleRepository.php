<?php

namespace App\Repositories\Eloquent;

use App\Repositories\Contracts\RoleRepository;
use Spatie\Permission\Models\Role;

final class EloquentRoleRepository implements RoleRepository
{
    public function ensureExists(string $name, string $guard = 'web'): void
    {
        Role::firstOrCreate(['name' => $name, 'guard_name' => $guard]);
    }
}
