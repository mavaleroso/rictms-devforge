<?php

namespace App\Actions\Challenge;

use App\Library\CodingChallenge\EvaluationResult;
use App\Models\ChallengeSubmission;
use App\Models\CodingChallenge;
use App\Models\User;
use App\Services\Challenge\ChallengeSubmissionService;

final class RunChallengeTests
{
    public function __construct(
        private readonly ChallengeSubmissionService $submissions,
    ) {}

    public function execute(User $user, CodingChallenge $challenge, string $code, ?array $files = null): EvaluationResult
    {
        return $this->submissions->runSampleTests($user, $challenge, $code, $files);
    }
}
