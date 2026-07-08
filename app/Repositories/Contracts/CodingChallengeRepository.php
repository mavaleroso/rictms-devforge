<?php

namespace App\Repositories\Contracts;

use App\Models\ChallengeTestCase;
use App\Models\CodingChallenge;
use App\Models\Level;
use Illuminate\Support\Collection;

interface CodingChallengeRepository
{
    public function loadForPlayer(CodingChallenge $challenge): CodingChallenge;

    public function loadForAdmin(CodingChallenge $challenge): CodingChallenge;

    public function updateOrCreateForLevel(Level $level, array $attributes): CodingChallenge;

    /** @return Collection<int, ChallengeTestCase> */
    public function testCasesForChallenge(CodingChallenge $challenge, bool $sampleOnly = false): Collection;
}
