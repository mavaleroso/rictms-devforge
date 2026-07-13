<?php

namespace App\Policies;

use App\Models\CapstoneProject;
use App\Models\User;

class CapstoneProjectPolicy
{
    public function view(User $user, CapstoneProject $project): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        if ($user->isIntern()) {
            return $project->enrollment?->user_id === $user->id;
        }

        if ($user->isMentor()) {
            return $project->enrollment?->mentor_id === $user->id;
        }

        return false;
    }

    public function update(User $user, CapstoneProject $project): bool
    {
        return $user->isIntern() && $project->enrollment?->user_id === $user->id;
    }

    public function approveKickoff(User $user, CapstoneProject $project): bool
    {
        return $user->isMentor() && $project->enrollment?->mentor_id === $user->id;
    }

    public function archive(User $user, CapstoneProject $project): bool
    {
        return ($user->isIntern() && $project->enrollment?->user_id === $user->id)
            || $user->isAdmin();
    }
}
