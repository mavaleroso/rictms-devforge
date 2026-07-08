<?php

namespace App\Library\Gamification;

final class TierRegistry
{
    /** @return list<XpTier> */
    public static function all(): array
    {
        return array_map(
            fn (array $tier) => new XpTier(
                slug: $tier['slug'],
                label: $tier['label'],
                minXp: $tier['min_xp'],
                color: $tier['color'],
            ),
            config('gamification.tiers', []),
        );
    }

    public static function forXp(int $totalXp): XpTier
    {
        $tiers = self::all();
        $current = $tiers[0];

        foreach ($tiers as $tier) {
            if ($totalXp >= $tier->minXp) {
                $current = $tier;
            }
        }

        return $current;
    }

    public static function nextTier(int $totalXp): ?XpTier
    {
        foreach (self::all() as $tier) {
            if ($totalXp < $tier->minXp) {
                return $tier;
            }
        }

        return null;
    }

    public static function progressToNext(int $totalXp): array
    {
        $current = self::forXp($totalXp);
        $next = self::nextTier($totalXp);

        if (! $next) {
            return [
                'current' => $current,
                'next' => null,
                'progress' => 100,
                'xp_to_next' => 0,
            ];
        }

        $range = $next->minXp - $current->minXp;
        $earned = $totalXp - $current->minXp;
        $progress = $range > 0 ? (int) min(100, round(($earned / $range) * 100)) : 0;

        return [
            'current' => $current,
            'next' => $next,
            'progress' => $progress,
            'xp_to_next' => max(0, $next->minXp - $totalXp),
        ];
    }
}
