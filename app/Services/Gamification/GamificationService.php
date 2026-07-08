<?php

namespace App\Services\Gamification;

use App\Enums\XpSourceType;
use App\Library\Gamification\StreakCalculator;
use App\Library\Gamification\TierRegistry;
use App\Library\Gamification\XpRules;
use App\Models\Badge;
use App\Models\User;
use App\Repositories\Contracts\BadgeRepository;
use App\Repositories\Contracts\GamificationProfileRepository;
use App\Repositories\Contracts\XpTransactionRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Collection;

final class GamificationService
{
    public function __construct(
        private readonly GamificationProfileRepository $profiles,
        private readonly XpTransactionRepository $transactions,
        private readonly BadgeRepository $badges,
        private readonly AchievementEvaluator $achievements,
    ) {}

    public function awardXp(
        User $user,
        XpSourceType $sourceType,
        int $sourceId,
        int $amount,
        string $reason,
        ?array $metadata = null,
        bool $recordActivity = true,
    ): ?GamificationAward {
        if ($amount <= 0) {
            return null;
        }

        return DB::transaction(function () use ($user, $sourceType, $sourceId, $amount, $reason, $metadata, $recordActivity) {
            $transaction = $this->transactions->createIfNew(
                $user,
                $sourceType,
                $sourceId,
                $amount,
                $reason,
                $metadata,
            );

            if (! $transaction) {
                return null;
            }

            $profile = $this->profiles->findOrCreateForUser($user);
            $this->profiles->addXp($profile, $amount);

            $streak = null;

            if ($recordActivity) {
                $streak = $this->recordActivity($user);
            }

            $newBadges = $this->achievements->evaluate($user);
            $badgeBonus = 0;
            $badgePayload = [];

            foreach ($newBadges as $badge) {
                $bonus = $this->applyBadgeBonus($user, $badge);
                $badgeBonus += $bonus;

                $badgePayload[] = [
                    'slug' => $badge->slug,
                    'name' => $badge->name,
                    'icon' => $badge->icon,
                    'xp_bonus' => $badge->xp_bonus,
                ];
            }

            $award = new GamificationAward(
                xp: $amount + $badgeBonus,
                reason: $reason,
                badges: $badgePayload,
                streak: $streak,
            );

            $this->flashAward($award);

            return $award;
        });
    }

    public function recordActivity(User $user): int
    {
        $profile = $this->profiles->findOrCreateForUser($user);
        $today = now();
        $result = StreakCalculator::nextStreak(
            $profile->last_activity_date,
            $profile->current_streak,
            $today,
        );

        $this->profiles->updateStreak(
            $profile,
            $result['current'],
            max($profile->longest_streak, $result['current']),
            $today,
        );

        if ($result['award_daily']) {
            $this->awardXp(
                $user,
                XpSourceType::DailyStreak,
                (int) $today->format('Ymd'),
                XpRules::dailyStreak(),
                'Daily learning streak',
                recordActivity: false,
            );
        }

        return $result['current'];
    }

    /** @return array<string, mixed> */
    public function summaryFor(User $user): array
    {
        $profile = $this->profiles->findOrCreateForUser($user);
        $tierProgress = TierRegistry::progressToNext($profile->total_xp);
        $earnedBadges = $this->badges->forUser($user);
        $allBadges = $this->badges->activeOrdered();

        return [
            'total_xp' => $profile->total_xp,
            'current_streak' => $profile->current_streak,
            'longest_streak' => $profile->longest_streak,
            'tier' => [
                'slug' => $tierProgress['current']->slug,
                'label' => $tierProgress['current']->label,
                'color' => $tierProgress['current']->color,
            ],
            'next_tier' => $tierProgress['next'] ? [
                'slug' => $tierProgress['next']->slug,
                'label' => $tierProgress['next']->label,
                'min_xp' => $tierProgress['next']->minXp,
            ] : null,
            'tier_progress' => $tierProgress['progress'],
            'xp_to_next_tier' => $tierProgress['xp_to_next'],
            'badges_earned' => $earnedBadges->count(),
            'badges_total' => $allBadges->count(),
            'recent_badges' => $earnedBadges->take(4)->map(fn ($userBadge) => [
                'slug' => $userBadge->badge->slug,
                'name' => $userBadge->badge->name,
                'icon' => $userBadge->badge->icon,
                'earned_at' => $userBadge->earned_at?->toIso8601String(),
            ])->values()->all(),
        ];
    }

    /** @return array<string, mixed> */
    public function profilePayloadFor(User $user): array
    {
        $summary = $this->summaryFor($user);
        $earnedSlugs = $this->badges->forUser($user)->pluck('badge.slug')->all();

        return [
            ...$summary,
            'badges' => $this->badges->activeOrdered()->map(fn (Badge $badge) => [
                'slug' => $badge->slug,
                'name' => $badge->name,
                'description' => $badge->description,
                'icon' => $badge->icon,
                'category' => $badge->category->value,
                'xp_bonus' => $badge->xp_bonus,
                'earned' => in_array($badge->slug, $earnedSlugs, true),
            ])->values()->all(),
        ];
    }

    private function applyBadgeBonus(User $user, Badge $badge): int
    {
        if ($badge->xp_bonus <= 0) {
            return 0;
        }

        $transaction = $this->transactions->createIfNew(
            $user,
            XpSourceType::BadgeBonus,
            $badge->id,
            $badge->xp_bonus,
            'Badge earned: '.$badge->name,
            ['badge_slug' => $badge->slug],
        );

        if (! $transaction) {
            return 0;
        }

        $profile = $this->profiles->findOrCreateForUser($user);
        $this->profiles->addXp($profile, $badge->xp_bonus);

        return $badge->xp_bonus;
    }

    private function flashAward(GamificationAward $award): void
    {
        if (! app()->runningInConsole()) {
            $existing = session('gamification_awards', []);
            session()->flash('gamification_awards', [...$existing, $award->toArray()]);
        }
    }
}
