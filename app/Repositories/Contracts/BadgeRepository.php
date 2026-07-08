<?php

namespace App\Repositories\Contracts;

use App\Models\Badge;
use App\Models\User;
use App\Models\UserBadge;
use Illuminate\Support\Collection;

interface BadgeRepository
{
    /** @return Collection<int, Badge> */
    public function activeOrdered(): Collection;

    public function findBySlug(string $slug): ?Badge;

    public function awardIfNew(User $user, Badge $badge, ?array $metadata = null): ?UserBadge;

    /** @return Collection<int, UserBadge> */
    public function forUser(User $user): Collection;

    public function userHasBadge(User $user, string $slug): bool;

    public function countForUser(User $user): int;
}
