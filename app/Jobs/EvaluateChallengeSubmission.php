<?php

namespace App\Jobs;

use App\Models\ChallengeSubmission;
use App\Services\Challenge\ChallengeSubmissionService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class EvaluateChallengeSubmission implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public readonly int $submissionId,
    ) {}

    public function handle(ChallengeSubmissionService $submissions): void
    {
        $submission = ChallengeSubmission::query()->find($this->submissionId);

        if (! $submission || $submission->status->isTerminal()) {
            return;
        }

        $submissions->evaluateQueuedSubmission($submission);
    }
}
