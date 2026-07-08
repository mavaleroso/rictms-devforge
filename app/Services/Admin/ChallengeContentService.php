<?php

namespace App\Services\Admin;

use App\Library\CodingChallenge\LanguageRegistry;
use App\Models\ChallengeTestCase;
use App\Models\CodingChallenge;
use App\Models\Level;
use App\Repositories\Contracts\ChallengeTestCaseRepository;
use App\Repositories\Contracts\CodingChallengeRepository;

final class ChallengeContentService
{
    public function __construct(
        private readonly CodingChallengeRepository $challenges,
        private readonly ChallengeTestCaseRepository $testCases,
    ) {}

    public function updateChallenge(Level $level, array $attributes): CodingChallenge
    {
        if (! isset($attributes['starter_code']) && isset($attributes['entry_point'], $attributes['language'])) {
            $language = is_string($attributes['language'])
                ? \App\Enums\ChallengeLanguage::from($attributes['language'])
                : $attributes['language'];

            $attributes['starter_code'] = LanguageRegistry::defaultStarter(
                $language,
                $attributes['entry_point'],
            );
        }

        return $this->challenges->updateOrCreateForLevel($level, $attributes);
    }

    public function storeTestCase(CodingChallenge $challenge, array $attributes): ChallengeTestCase
    {
        return $this->testCases->createForChallenge($challenge, $attributes);
    }

    public function updateTestCase(ChallengeTestCase $testCase, array $attributes): void
    {
        $this->testCases->update($testCase, $attributes);
    }

    public function deleteTestCase(ChallengeTestCase $testCase): void
    {
        $this->testCases->delete($testCase);
    }
}
