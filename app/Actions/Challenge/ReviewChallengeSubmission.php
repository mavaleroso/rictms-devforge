<?php

namespace App\Actions\Challenge;

use App\Enums\SubmissionStatus;
use App\Models\ChallengeSubmission;
use App\Models\User;
use App\Services\Challenge\ChallengeSubmissionService;

final class ReviewChallengeSubmission
{
    public function __construct(
        private readonly ChallengeSubmissionService $submissions,
    ) {}

    public function execute(
        User $mentor,
        ChallengeSubmission $submission,
        SubmissionStatus $status,
        ?string $feedback,
        ?int $score,
    ): ChallengeSubmission {
        return $this->submissions->review($mentor, $submission, $status, $feedback, $score);
    }
}
