<?php

namespace App\Repositories\Eloquent;

use App\Enums\SubmissionStatus;
use App\Models\ChallengeSubmission;
use App\Models\ChallengeSubmissionResult;
use App\Models\User;
use App\Repositories\Contracts\ChallengeSubmissionRepository;
use Illuminate\Support\Collection;

final class EloquentChallengeSubmissionRepository implements ChallengeSubmissionRepository
{
    public function countForUserAndChallenge(int $userId, int $challengeId): int
    {
        return ChallengeSubmission::query()
            ->where('user_id', $userId)
            ->where('coding_challenge_id', $challengeId)
            ->count();
    }

    public function hasPassed(int $userId, int $challengeId): bool
    {
        return ChallengeSubmission::query()
            ->where('user_id', $userId)
            ->where('coding_challenge_id', $challengeId)
            ->whereIn('status', [SubmissionStatus::Passed, SubmissionStatus::Approved])
            ->exists();
    }

    public function statsForUserAndChallenge(int $userId, int $challengeId): array
    {
        $latest = ChallengeSubmission::query()
            ->where('user_id', $userId)
            ->where('coding_challenge_id', $challengeId)
            ->latest()
            ->first();

        return [
            'attempts_used' => $this->countForUserAndChallenge($userId, $challengeId),
            'tests_passed' => $latest?->tests_passed ?? 0,
            'tests_total' => $latest?->tests_total ?? 0,
            'passed' => $this->hasPassed($userId, $challengeId),
            'status' => $latest?->status?->value,
        ];
    }

    public function historyForUserAndChallenge(int $userId, int $challengeId, int $limit = 10): Collection
    {
        return ChallengeSubmission::query()
            ->where('user_id', $userId)
            ->where('coding_challenge_id', $challengeId)
            ->with(['results.testCase'])
            ->latest()
            ->limit($limit)
            ->get();
    }

    public function create(array $attributes): ChallengeSubmission
    {
        return ChallengeSubmission::create($attributes);
    }

    public function storeResults(ChallengeSubmission $submission, array $results): ChallengeSubmission
    {
        foreach ($results as $index => $result) {
            ChallengeSubmissionResult::create([
                'challenge_submission_id' => $submission->id,
                'challenge_test_case_id' => $result['test_case_id'],
                'passed' => $result['passed'],
                'actual_output' => $result['actual_output'] ?? null,
                'error_message' => $result['error_message'] ?? null,
                'runtime_ms' => $result['runtime_ms'] ?? null,
                'sort_order' => $index + 1,
            ]);
        }

        return $submission->fresh(['results.testCase']);
    }

    public function updateReview(
        ChallengeSubmission $submission,
        User $reviewer,
        string $status,
        ?string $feedback,
        ?int $score,
    ): ChallengeSubmission {
        $submission->update([
            'status' => SubmissionStatus::from($status),
            'reviewer_id' => $reviewer->id,
            'mentor_feedback' => $feedback,
            'mentor_score' => $score,
            'reviewed_at' => now(),
        ]);

        return $submission->fresh(['user', 'challenge.level', 'results.testCase']);
    }

    public function countPendingReviewsForMentor(int $mentorId): int
    {
        return ChallengeSubmission::query()
            ->where('status', SubmissionStatus::NeedsReview)
            ->whereHas('user.enrollments', fn ($q) => $q->where('mentor_id', $mentorId))
            ->count();
    }

    public function pendingReviewsForMentor(int $mentorId, int $limit = 20): Collection
    {
        return ChallengeSubmission::query()
            ->where('status', SubmissionStatus::NeedsReview)
            ->whereHas('user.enrollments', fn ($q) => $q->where('mentor_id', $mentorId))
            ->with(['user', 'challenge.level.learningPath'])
            ->latest()
            ->limit($limit)
            ->get();
    }

    public function findForMentorReview(int $mentorId, ChallengeSubmission $submission): ?ChallengeSubmission
    {
        return ChallengeSubmission::query()
            ->whereKey($submission->id)
            ->whereHas('user.enrollments', fn ($q) => $q->where('mentor_id', $mentorId))
            ->with(['user', 'challenge.level.learningPath', 'results.testCase'])
            ->first();
    }

    public function passedCountForUser(int $userId): int
    {
        return ChallengeSubmission::query()
            ->where('user_id', $userId)
            ->whereIn('status', [SubmissionStatus::Passed, SubmissionStatus::Approved])
            ->distinct('coding_challenge_id')
            ->count('coding_challenge_id');
    }

    public function findById(int $id): ?ChallengeSubmission
    {
        return ChallengeSubmission::query()
            ->with(['results.testCase', 'challenge'])
            ->find($id);
    }

    public function updateEvaluation(ChallengeSubmission $submission, array $attributes): ChallengeSubmission
    {
        $submission->update($attributes);

        return $submission->fresh(['results.testCase', 'challenge']);
    }
}
