<?php

namespace App\Repositories\Eloquent;

use App\Models\User;
use App\Models\UserGamificationProfile;
use App\Repositories\Contracts\GamificationProfileRepository;

final class EloquentGamificationProfileRepository implements GamificationProfileRepository
{
    public function findOrCreateForUser(User $user): UserGamificationProfile
    {
        return UserGamificationProfile::firstOrCreate(
            ['user_id' => $user->id],
            ['total_xp' => 0, 'current_streak' => 0, 'longest_streak' => 0],
        );
    }

    public function findForUser(User $user): ?UserGamificationProfile
    {
        return UserGamificationProfile::query()->where('user_id', $user->id)->first();
    }

    public function addXp(UserGamificationProfile $profile, int $amount): UserGamificationProfile
    {
        $profile->increment('total_xp', $amount);

        return $profile->fresh();
    }

    public function updateStreak(
        UserGamificationProfile $profile,
        int $current,
        int $longest,
        \DateTimeInterface $activityDate,
    ): UserGamificationProfile {
        $profile->update([
            'current_streak' => $current,
            'longest_streak' => max($profile->longest_streak, $longest),
            'last_activity_date' => $activityDate->format('Y-m-d'),
        ]);

        return $profile->fresh();
    }
}
