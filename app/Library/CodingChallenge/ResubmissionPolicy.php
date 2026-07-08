<?php

namespace App\Library\CodingChallenge;

use App\Models\CodingChallenge;

final class ResubmissionPolicy
{
    public function canSubmit(CodingChallenge $challenge, int $attemptsUsed, bool $hasPassed): bool
    {
        if ($hasPassed) {
            return false;
        }

        return $attemptsUsed < $challenge->max_attempts;
    }

    public function attemptsRemaining(CodingChallenge $challenge, int $attemptsUsed, bool $hasPassed): int
    {
        if ($hasPassed) {
            return 0;
        }

        return max(0, $challenge->max_attempts - $attemptsUsed);
    }
}
