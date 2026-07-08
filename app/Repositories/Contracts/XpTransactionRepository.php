<?php

namespace App\Repositories\Contracts;

use App\Enums\XpSourceType;
use App\Models\User;
use App\Models\XpTransaction;
use Illuminate\Support\Collection;

interface XpTransactionRepository
{
    public function createIfNew(
        User $user,
        XpSourceType $sourceType,
        int $sourceId,
        int $amount,
        string $reason,
        ?array $metadata = null,
    ): ?XpTransaction;

    public function weeklyXpForUsers(array $userIds, int $days = 7): Collection;

    public function exists(User $user, XpSourceType $sourceType, int $sourceId): bool;
}
