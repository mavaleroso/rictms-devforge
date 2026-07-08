<?php

namespace App\Services\Gamification;

use App\Enums\EnrollmentStatus;
use App\Models\Enrollment;
use App\Models\User;
use App\Models\UserGamificationProfile;
use App\Repositories\Contracts\GamificationProfileRepository;
use App\Repositories\Contracts\XpTransactionRepository;
use Illuminate\Support\Collection;

final class LeaderboardService
{
    public function __construct(
        private readonly GamificationProfileRepository $profiles,
        private readonly XpTransactionRepository $transactions,
    ) {}

    /** @return array<string, mixed> */
    public function forIntern(User $viewer, ?int $pathId = null): array
    {
        $scopeUserIds = $this->scopedUserIds($viewer, $pathId);
        $limit = (int) config('gamification.leaderboard.default_limit', 10);
        $weeklyDays = (int) config('gamification.leaderboard.weekly_days', 7);

        $allTime = $this->allTimeEntries($scopeUserIds, $limit);
        $weeklyXp = $this->transactions->weeklyXpForUsers($scopeUserIds->all(), $weeklyDays);
        $weekly = $this->weeklyEntries($scopeUserIds, $weeklyXp, $limit);

        $viewerProfile = $this->profiles->findForUser($viewer);

        return [
            'scope' => $pathId ? 'path' : 'global',
            'path_id' => $pathId,
            'all_time' => $allTime,
            'weekly' => $weekly,
            'viewer' => [
                'all_time_rank' => $this->rankForUser($viewer->id, $scopeUserIds, 'all_time'),
                'weekly_rank' => $this->rankForUser($viewer->id, $scopeUserIds, 'weekly', $weeklyXp),
                'total_xp' => $viewerProfile?->total_xp ?? 0,
                'weekly_xp' => (int) ($weeklyXp[$viewer->id] ?? 0),
            ],
        ];
    }

    /** @return Collection<int, int> */
    private function scopedUserIds(User $viewer, ?int $pathId): Collection
    {
        if ($pathId) {
            return Enrollment::query()
                ->where('learning_path_id', $pathId)
                ->whereIn('status', [EnrollmentStatus::Active, EnrollmentStatus::Completed])
                ->pluck('user_id');
        }

        return UserGamificationProfile::query()
            ->pluck('user_id')
            ->push($viewer->id)
            ->unique()
            ->values();
    }

    /** @return list<array<string, mixed>> */
    private function allTimeEntries(Collection $userIds, int $limit): array
    {
        if ($userIds->isEmpty()) {
            return [];
        }

        return UserGamificationProfile::query()
            ->with('user:id,name,first_name,middle_name,last_name,avatar')
            ->whereIn('user_id', $userIds)
            ->orderByDesc('total_xp')
            ->orderBy('user_id')
            ->limit($limit)
            ->get()
            ->values()
            ->map(fn (UserGamificationProfile $profile, int $index) => $this->entryFromProfile($profile, $index + 1))
            ->all();
    }

    /** @return list<array<string, mixed>> */
    private function weeklyEntries(Collection $userIds, Collection $weeklyXp, int $limit): array
    {
        if ($userIds->isEmpty()) {
            return [];
        }

        $sorted = $weeklyXp
            ->sortByDesc(fn ($xp) => $xp)
            ->take($limit);

        $profiles = UserGamificationProfile::query()
            ->with('user:id,name,first_name,middle_name,last_name,avatar')
            ->whereIn('user_id', $sorted->keys())
            ->get()
            ->keyBy('user_id');

        $rank = 1;

        return $sorted->map(function (int $xp, int $userId) use ($profiles, &$rank) {
            $profile = $profiles->get($userId);

            return [
                'rank' => $rank++,
                'user_id' => $userId,
                'name' => $profile?->user?->name ?? 'Learner',
                'avatar_url' => $profile?->user?->avatar_url,
                'xp' => $xp,
                'total_xp' => $profile?->total_xp ?? 0,
                'current_streak' => $profile?->current_streak ?? 0,
            ];
        })->values()->all();
    }

    private function entryFromProfile(UserGamificationProfile $profile, int $rank): array
    {
        return [
            'rank' => $rank,
            'user_id' => $profile->user_id,
            'name' => $profile->user?->name ?? 'Learner',
            'avatar_url' => $profile->user?->avatar_url,
            'xp' => $profile->total_xp,
            'total_xp' => $profile->total_xp,
            'current_streak' => $profile->current_streak,
        ];
    }

    private function rankForUser(int $userId, Collection $scopeUserIds, string $mode, ?Collection $weeklyXp = null): ?int
    {
        if (! $scopeUserIds->contains($userId)) {
            return null;
        }

        if ($mode === 'weekly') {
            $weeklyXp ??= collect();
            $userWeekly = (int) ($weeklyXp[$userId] ?? 0);

            if ($userWeekly === 0) {
                return null;
            }

            $index = $weeklyXp
                ->filter(fn ($xp, $id) => $scopeUserIds->contains($id))
                ->sortByDesc(fn ($xp) => $xp)
                ->keys()
                ->search($userId);

            return $index === false ? null : $index + 1;
        }

        $profiles = UserGamificationProfile::query()
            ->whereIn('user_id', $scopeUserIds)
            ->orderByDesc('total_xp')
            ->orderBy('user_id')
            ->pluck('user_id');

        $index = $profiles->search($userId);

        return $index === false ? null : $index + 1;
    }
}
