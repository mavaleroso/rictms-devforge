<?php

namespace App\Policies;

use App\Models\LearningPath;
use App\Models\User;

class LearningPathPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, LearningPath $learningPath): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return $user->isAdmin();
    }

    public function update(User $user, LearningPath $learningPath): bool
    {
        return $user->isAdmin();
    }

    public function delete(User $user, LearningPath $learningPath): bool
    {
        return $user->isAdmin();
    }
}
