<?php

namespace App\Repositories\Eloquent;

use App\Enums\SubmissionStatus;
use App\Models\ChallengeTestCase;
use App\Models\CodingChallenge;
use App\Models\Level;
use App\Repositories\Contracts\CodingChallengeRepository;
use Illuminate\Support\Collection;

final class EloquentCodingChallengeRepository implements CodingChallengeRepository
{
    public function loadForPlayer(CodingChallenge $challenge): CodingChallenge
    {
        return $challenge->load([
            'level.learningPath',
            'testCases' => fn ($q) => $q->where('is_sample', true),
        ]);
    }

    public function loadForAdmin(CodingChallenge $challenge): CodingChallenge
    {
        return $challenge->load(['testCases', 'level.learningPath']);
    }

    public function createForLevel(Level $level, array $attributes): CodingChallenge
    {
        return $level->codingChallenges()->create($attributes);
    }

    public function update(CodingChallenge $challenge, array $attributes): void
    {
        $challenge->update($attributes);
    }

    public function delete(CodingChallenge $challenge): void
    {
        $challenge->delete();
    }

    public function testCasesForChallenge(CodingChallenge $challenge, bool $sampleOnly = false): Collection
    {
        $query = $challenge->testCases()->orderBy('sort_order');

        if ($sampleOnly) {
            $query->where('is_sample', true);
        }

        return $query->get();
    }
}
