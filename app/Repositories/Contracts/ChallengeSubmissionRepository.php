<?php

namespace App\Repositories\Contracts;

use App\Models\ChallengeSubmission;
use App\Models\CodingChallenge;
use App\Models\User;
use Illuminate\Support\Collection;

interface ChallengeSubmissionRepository
{
    public function countForUserAndChallenge(int $userId, int $challengeId): int;

    public function hasPassed(int $userId, int $challengeId): bool;

    /** @return array{attempts_used: int, tests_passed: int, tests_total: int, passed: bool, status: string|null} */
    public function statsForUserAndChallenge(int $userId, int $challengeId): array;

    /** @return Collection<int, ChallengeSubmission> */
    public function historyForUserAndChallenge(int $userId, int $challengeId, int $limit = 10): Collection;

    public function create(array $attributes): ChallengeSubmission;

    public function storeResults(ChallengeSubmission $submission, array $results): ChallengeSubmission;

    public function updateReview(
        ChallengeSubmission $submission,
        User $reviewer,
        string $status,
        ?string $feedback,
        ?int $score,
    ): ChallengeSubmission;

    public function countPendingReviewsForMentor(int $mentorId): int;

    /** @return Collection<int, ChallengeSubmission> */
    public function pendingReviewsForMentor(int $mentorId, int $limit = 20): Collection;

    public function findForMentorReview(int $mentorId, ChallengeSubmission $submission): ?ChallengeSubmission;

    public function passedCountForUser(int $userId): int;

    public function findById(int $id): ?ChallengeSubmission;

    public function updateEvaluation(ChallengeSubmission $submission, array $attributes): ChallengeSubmission;
}
