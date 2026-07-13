<?php

namespace App\Policies;

use App\Models\CapstoneTemplate;
use App\Models\User;

class CapstoneTemplatePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isAdmin();
    }

    public function view(User $user, CapstoneTemplate $template): bool
    {
        return $user->isAdmin();
    }

    public function create(User $user): bool
    {
        return $user->isAdmin();
    }

    public function update(User $user, CapstoneTemplate $template): bool
    {
        return $user->isAdmin();
    }

    public function delete(User $user, CapstoneTemplate $template): bool
    {
        return $user->isAdmin();
    }
}
