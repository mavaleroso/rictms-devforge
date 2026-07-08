<?php

namespace App\Actions\Admin;

use App\Models\ChallengeTestCase;
use App\Models\CodingChallenge;
use App\Models\Level;
use App\Services\Admin\ChallengeContentService;

final class ManageChallengeContent
{
    public function __construct(
        private readonly ChallengeContentService $content,
    ) {}

    public function updateChallenge(Level $level, array $attributes): CodingChallenge
    {
        return $this->content->updateChallenge($level, $attributes);
    }

    public function storeTestCase(CodingChallenge $challenge, array $attributes): ChallengeTestCase
    {
        return $this->content->storeTestCase($challenge, $attributes);
    }

    public function updateTestCase(ChallengeTestCase $testCase, array $attributes): void
    {
        $this->content->updateTestCase($testCase, $attributes);
    }

    public function deleteTestCase(ChallengeTestCase $testCase): void
    {
        $this->content->deleteTestCase($testCase);
    }
}
