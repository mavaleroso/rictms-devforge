<?php

namespace App\Repositories\Eloquent;

use App\Enums\XpSourceType;
use App\Models\User;
use App\Models\XpTransaction;
use App\Repositories\Contracts\XpTransactionRepository;
use Illuminate\Database\QueryException;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

final class EloquentXpTransactionRepository implements XpTransactionRepository
{
    public function createIfNew(
        User $user,
        XpSourceType $sourceType,
        int $sourceId,
        int $amount,
        string $reason,
        ?array $metadata = null,
    ): ?XpTransaction {
        try {
            return XpTransaction::create([
                'user_id' => $user->id,
                'source_type' => $sourceType,
                'source_id' => $sourceId,
                'amount' => $amount,
                'reason' => $reason,
                'metadata' => $metadata,
            ]);
        } catch (QueryException $exception) {
            if ($this->isDuplicateKey($exception)) {
                return null;
            }

            throw $exception;
        }
    }

    public function weeklyXpForUsers(array $userIds, int $days = 7): Collection
    {
        if ($userIds === []) {
            return collect();
        }

        return XpTransaction::query()
            ->select('user_id', DB::raw('SUM(amount) as weekly_xp'))
            ->whereIn('user_id', $userIds)
            ->where('created_at', '>=', now()->subDays($days)->startOfDay())
            ->groupBy('user_id')
            ->pluck('weekly_xp', 'user_id');
    }

    public function exists(User $user, XpSourceType $sourceType, int $sourceId): bool
    {
        return XpTransaction::query()
            ->where('user_id', $user->id)
            ->where('source_type', $sourceType)
            ->where('source_id', $sourceId)
            ->exists();
    }

    private function isDuplicateKey(QueryException $exception): bool
    {
        return str_contains($exception->getMessage(), 'Duplicate')
            || str_contains($exception->getMessage(), 'UNIQUE constraint');
    }
}
