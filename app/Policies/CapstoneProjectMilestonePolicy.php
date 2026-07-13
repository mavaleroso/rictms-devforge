<?php

namespace App\Policies;

use App\Models\CapstoneProjectMilestone;
use App\Models\User;

class CapstoneProjectMilestonePolicy
{
    public function submit(User $user, CapstoneProjectMilestone $milestone): bool
    {
        return $user->isIntern()
            && $milestone->project?->enrollment?->user_id === $user->id;
    }

    public function review(User $user, CapstoneProjectMilestone $milestone): bool
    {
        return $user->isMentor()
            && $milestone->project?->enrollment?->mentor_id === $user->id;
    }
}
