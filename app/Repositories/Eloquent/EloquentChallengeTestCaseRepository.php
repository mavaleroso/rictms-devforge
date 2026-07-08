<?php

namespace App\Repositories\Eloquent;

use App\Models\ChallengeTestCase;
use App\Models\CodingChallenge;
use App\Repositories\Contracts\ChallengeTestCaseRepository;

final class EloquentChallengeTestCaseRepository implements ChallengeTestCaseRepository
{
    public function createForChallenge(CodingChallenge $challenge, array $attributes): ChallengeTestCase
    {
        if (! isset($attributes['sort_order'])) {
            $attributes['sort_order'] = ($challenge->testCases()->max('sort_order') ?? 0) + 1;
        }

        return $challenge->testCases()->create($attributes);
    }

    public function update(ChallengeTestCase $testCase, array $attributes): void
    {
        $testCase->update($attributes);
    }

    public function delete(ChallengeTestCase $testCase): void
    {
        $testCase->delete();
    }
}
