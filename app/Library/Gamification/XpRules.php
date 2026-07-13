<?php

namespace App\Library\Gamification;

final class XpRules
{
    public static function material(): int
    {
        return (int) config('gamification.xp.material', 15);
    }

    public static function video(): int
    {
        return (int) config('gamification.xp.video', 20);
    }

    public static function quiz(int $score, int $attemptNumber): int
    {
        $amount = (int) config('gamification.xp.quiz_base', 75);

        if ($score >= 100) {
            $amount += (int) config('gamification.xp.quiz_perfect_bonus', 25);
        }

        if ($attemptNumber === 1) {
            $amount += (int) config('gamification.xp.quiz_first_attempt_bonus', 15);
        }

        return $amount;
    }

    public static function challenge(bool $mentorApproved = false): int
    {
        return $mentorApproved
            ? (int) config('gamification.xp.challenge_approved', 175)
            : (int) config('gamification.xp.challenge_pass', 150);
    }

    public static function level(string $difficulty): int
    {
        $base = (int) config('gamification.xp.level_base', 200);
        $multiplier = (float) (config('gamification.difficulty_multipliers')[$difficulty] ?? 1.0);

        return (int) round($base * $multiplier);
    }

    public static function pathComplete(): int
    {
        return (int) config('gamification.xp.path_complete', 1000);
    }

    public static function dailyStreak(): int
    {
        return (int) config('gamification.xp.daily_streak', 10);
    }

    public static function capstoneMilestone(): int
    {
        return (int) config('gamification.xp.capstone_milestone', 100);
    }

    public static function capstoneComplete(): int
    {
        return (int) config('gamification.xp.capstone_complete', 500);
    }
}
