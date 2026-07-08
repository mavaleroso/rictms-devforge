<?php

namespace App\Repositories\Eloquent;

use App\Models\Badge;
use App\Models\User;
use App\Models\UserBadge;
use App\Repositories\Contracts\BadgeRepository;
use Illuminate\Support\Collection;

final class EloquentBadgeRepository implements BadgeRepository
{
    public function activeOrdered(): Collection
    {
        return Badge::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();
    }

    public function findBySlug(string $slug): ?Badge
    {
        return Badge::query()->where('slug', $slug)->first();
    }

    public function awardIfNew(User $user, Badge $badge, ?array $metadata = null): ?UserBadge
    {
        $existing = UserBadge::query()
            ->where('user_id', $user->id)
            ->where('badge_id', $badge->id)
            ->first();

        if ($existing) {
            return null;
        }

        return UserBadge::create([
            'user_id' => $user->id,
            'badge_id' => $badge->id,
            'earned_at' => now(),
            'metadata' => $metadata,
        ]);
    }

    public function forUser(User $user): Collection
    {
        return UserBadge::query()
            ->where('user_id', $user->id)
            ->with('badge')
            ->orderByDesc('earned_at')
            ->get();
    }

    public function userHasBadge(User $user, string $slug): bool
    {
        return UserBadge::query()
            ->where('user_id', $user->id)
            ->whereHas('badge', fn ($query) => $query->where('slug', $slug))
            ->exists();
    }

    public function countForUser(User $user): int
    {
        return UserBadge::query()->where('user_id', $user->id)->count();
    }
}
