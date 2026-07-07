<?php

namespace App\Repositories\Eloquent;

use App\Models\ContentCompletion;
use App\Models\User;
use App\Repositories\Contracts\ContentCompletionRepository;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;

final class EloquentContentCompletionRepository implements ContentCompletionRepository
{
    public function markComplete(User $user, Model $content): ContentCompletion
    {
        return ContentCompletion::firstOrCreate(
            [
                'user_id' => $user->id,
                'completable_type' => $content->getMorphClass(),
                'completable_id' => $content->id,
            ],
            ['completed_at' => now()],
        );
    }

    public function countCompletedForUser(int $userId, string $morphClass, Collection $ids): int
    {
        if ($ids->isEmpty()) {
            return 0;
        }

        return ContentCompletion::query()
            ->where('user_id', $userId)
            ->where('completable_type', $morphClass)
            ->whereIn('completable_id', $ids)
            ->count();
    }

    public function completedIdsGroupedByType(int $userId): Collection
    {
        return ContentCompletion::query()
            ->where('user_id', $userId)
            ->get()
            ->groupBy('completable_type')
            ->map(fn (Collection $items) => $items->pluck('completable_id'));
    }
}
