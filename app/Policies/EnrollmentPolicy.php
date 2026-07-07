<?php

namespace App\Policies;

use App\Models\Enrollment;
use App\Models\User;

class EnrollmentPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isAdmin() || $user->isMentor();
    }

    public function view(User $user, Enrollment $enrollment): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        if ($user->isMentor()) {
            return $enrollment->mentor_id === $user->id;
        }

        return $user->isIntern() && $enrollment->user_id === $user->id;
    }

    public function create(User $user): bool
    {
        return $user->isIntern() || $user->isAdmin();
    }

    public function update(User $user, Enrollment $enrollment): bool
    {
        return $user->isAdmin();
    }
}
