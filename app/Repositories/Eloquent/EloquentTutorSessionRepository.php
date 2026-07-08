<?php

namespace App\Repositories\Eloquent;

use App\Models\TutorSession;
use App\Models\User;
use App\Repositories\Contracts\TutorSessionRepository;

final class EloquentTutorSessionRepository implements TutorSessionRepository
{
    public function findById(int $id): ?TutorSession
    {
        return TutorSession::query()->find($id);
    }

    public function findForContext(User $user, string $contextType, ?int $contextId): ?TutorSession
    {
        return TutorSession::query()
            ->where('user_id', $user->id)
            ->where('context_type', $contextType)
            ->where('context_id', $contextId)
            ->latest('updated_at')
            ->first();
    }

    public function create(array $attributes): TutorSession
    {
        return TutorSession::create($attributes);
    }
}
