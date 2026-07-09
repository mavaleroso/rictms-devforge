<?php

namespace App\Services\Admin;

use App\Enums\ChallengeLanguage;
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

    public function storeChallenge(Level $level, array $attributes): CodingChallenge
    {
        $attributes = $this->applyStarterCodeDefaults($attributes);

        return $this->challenges->createForLevel($level, $attributes);
    }

    public function updateChallenge(CodingChallenge $challenge, array $attributes): void
    {
        $attributes = $this->applyStarterCodeDefaults($attributes);

        $this->challenges->update($challenge, $attributes);
    }

    public function deleteChallenge(CodingChallenge $challenge): void
    {
        $this->challenges->delete($challenge);
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

    /** @param  array<string, mixed>  $attributes */
    private function applyStarterCodeDefaults(array $attributes): array
    {
        if (! isset($attributes['starter_code']) && isset($attributes['entry_point'], $attributes['language'])) {
            $language = is_string($attributes['language'])
                ? ChallengeLanguage::from($attributes['language'])
                : $attributes['language'];

            $attributes['starter_code'] = LanguageRegistry::defaultStarter(
                $language,
                $attributes['entry_point'],
            );
        }

        return $attributes;
    }
}
