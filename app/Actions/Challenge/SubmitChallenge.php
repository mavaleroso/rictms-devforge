<?php

namespace App\Actions\Challenge;

use App\Models\ChallengeSubmission;
use App\Models\CodingChallenge;
use App\Models\User;
use App\Services\Challenge\ChallengeSubmissionService;

final class SubmitChallenge
{
    public function __construct(
        private readonly ChallengeSubmissionService $submissions,
    ) {}

    public function execute(User $user, CodingChallenge $challenge, string $code, array $meta = []): ChallengeSubmission
    {
        return $this->submissions->submit($user, $challenge, $code, $meta);
    }
}
