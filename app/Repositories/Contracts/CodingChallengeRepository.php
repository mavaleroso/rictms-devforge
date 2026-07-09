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

    public function createForLevel(Level $level, array $attributes): CodingChallenge;

    public function update(CodingChallenge $challenge, array $attributes): void;

    public function delete(CodingChallenge $challenge): void;

    /** @return Collection<int, ChallengeTestCase> */
    public function testCasesForChallenge(CodingChallenge $challenge, bool $sampleOnly = false): Collection;
}
