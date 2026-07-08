<?php

namespace App\Repositories\Contracts;

use App\Models\User;
use App\Models\UserGamificationProfile;

interface GamificationProfileRepository
{
    public function findOrCreateForUser(User $user): UserGamificationProfile;

    public function findForUser(User $user): ?UserGamificationProfile;

    public function addXp(UserGamificationProfile $profile, int $amount): UserGamificationProfile;

    public function updateStreak(UserGamificationProfile $profile, int $current, int $longest, \DateTimeInterface $activityDate): UserGamificationProfile;
}
