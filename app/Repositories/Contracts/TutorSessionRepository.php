<?php

namespace App\Repositories\Contracts;

use App\Models\TutorSession;
use App\Models\User;

interface TutorSessionRepository
{
    public function findById(int $id): ?TutorSession;

    public function findForContext(User $user, string $contextType, ?int $contextId): ?TutorSession;

    public function create(array $attributes): TutorSession;
}
