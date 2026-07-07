<?php

namespace App\Repositories\Contracts;

use App\Models\ContentCompletion;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;

interface ContentCompletionRepository
{
    public function markComplete(User $user, Model $content): ContentCompletion;

    public function countCompletedForUser(int $userId, string $morphClass, Collection $ids): int;

    /** @return Collection<string, Collection<int, int>> */
    public function completedIdsGroupedByType(int $userId): Collection;
}
