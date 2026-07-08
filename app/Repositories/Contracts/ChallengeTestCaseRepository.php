<?php

namespace App\Repositories\Contracts;

use App\Models\ChallengeTestCase;
use App\Models\CodingChallenge;

interface ChallengeTestCaseRepository
{
    public function createForChallenge(CodingChallenge $challenge, array $attributes): ChallengeTestCase;

    public function update(ChallengeTestCase $testCase, array $attributes): void;

    public function delete(ChallengeTestCase $testCase): void;
}
