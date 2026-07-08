<?php

namespace App\Library\Gamification;

final class StreakCalculator
{
    public static function nextStreak(?\DateTimeInterface $lastActivity, int $currentStreak, \DateTimeInterface $today): array
    {
        $todayDate = $today->format('Y-m-d');

        if ($lastActivity === null) {
            return ['current' => 1, 'longest_delta' => 1, 'award_daily' => true];
        }

        $lastDate = $lastActivity->format('Y-m-d');

        if ($lastDate === $todayDate) {
            return ['current' => $currentStreak, 'longest_delta' => 0, 'award_daily' => false];
        }

        $yesterday = (new \DateTimeImmutable($todayDate))->modify('-1 day')->format('Y-m-d');

        if ($lastDate === $yesterday) {
            return ['current' => $currentStreak + 1, 'longest_delta' => 1, 'award_daily' => true];
        }

        return ['current' => 1, 'longest_delta' => 0, 'award_daily' => true];
    }
}
