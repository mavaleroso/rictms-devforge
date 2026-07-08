<?php

namespace App\Services\Challenge;

use App\Enums\EvaluationDriver;
use App\Enums\SubmissionSource;
use App\Enums\SubmissionStatus;
use App\Enums\XpSourceType;
use App\Jobs\EvaluateChallengeSubmission;
use App\Library\CodingChallenge\EvaluationResult;
use App\Library\CodingChallenge\EvaluationRunnerFactory;
use App\Library\CodingChallenge\ResubmissionPolicy;
use App\Library\CodingChallenge\SubmissionEvaluator;
use App\Library\Gamification\XpRules;
use App\Models\ChallengeSubmission;
use App\Models\CodingChallenge;
use App\Models\User;
use App\Repositories\Contracts\ChallengeSubmissionRepository;
use App\Repositories\Contracts\CodingChallengeRepository;
use App\Repositories\Contracts\EnrollmentRepository;
use App\Repositories\Contracts\LevelProgressRepository;
use App\Services\Gamification\GamificationService;
use App\Services\Integrations\GitHub\GitHubContentFetcher;
use App\Services\Learning\ProgressEngine;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

final class ChallengeSubmissionService
{
    public function __construct(
        private readonly ChallengeSubmissionRepository $submissions,
        private readonly CodingChallengeRepository $challenges,
        private readonly SubmissionEvaluator $evaluator,
        private readonly ResubmissionPolicy $resubmissionPolicy,
        private readonly EnrollmentRepository $enrollments,
        private readonly LevelProgressRepository $levelProgress,
        private readonly ProgressEngine $progressEngine,
        private readonly GamificationService $gamification,
        private readonly EvaluationRunnerFactory $runnerFactory,
        private readonly GitHubContentFetcher $github,
    ) {}

    public function runSampleTests(User $user, CodingChallenge $challenge, string $code): EvaluationResult
    {
        $testCases = $this->challenges->testCasesForChallenge($challenge, sampleOnly: true);
        $driver = $this->resolveDriver();

        return $this->evaluator->evaluate($challenge, $code, $testCases, sampleOnly: true, driver: $driver);
    }

    /**
     * @param  array{
     *     source?: string,
     *     github_owner?: string,
     *     github_repo?: string,
     *     github_ref?: string,
     *     github_path?: string,
     * }  $meta
     */
    public function submit(User $user, CodingChallenge $challenge, string $code, array $meta = []): ChallengeSubmission
    {
        $source = SubmissionSource::tryFrom($meta['source'] ?? 'editor') ?? SubmissionSource::Editor;

        if ($source === SubmissionSource::GitHub) {
            $fetched = $this->github->fetchFile(
                $user,
                $meta['github_owner'] ?? '',
                $meta['github_repo'] ?? '',
                $meta['github_path'] ?? '',
                $meta['github_ref'] ?? 'main',
            );
            $code = $fetched['code'];
            $meta['github_commit_sha'] = $fetched['commit_sha'];
        }

        $attemptsUsed = $this->submissions->countForUserAndChallenge($user->id, $challenge->id);
        $hasPassed = $this->submissions->hasPassed($user->id, $challenge->id);

        if (! $this->resubmissionPolicy->canSubmit($challenge, $attemptsUsed, $hasPassed)) {
            throw ValidationException::withMessages([
                'code' => 'You have used all allowed attempts or already passed this challenge.',
            ]);
        }

        $testCases = $this->challenges->testCasesForChallenge($challenge, sampleOnly: false);

        if ($testCases->isEmpty()) {
            throw ValidationException::withMessages([
                'code' => 'This challenge has no test cases configured yet.',
            ]);
        }

        $driver = $this->resolveDriver();

        if ($this->runnerFactory->shouldQueue()) {
            return $this->queueSubmission($user, $challenge, $code, $attemptsUsed, $source, $driver, $meta);
        }

        return $this->evaluateSync($user, $challenge, $code, $attemptsUsed, $source, $driver, $meta, $testCases);
    }

    public function evaluateQueuedSubmission(ChallengeSubmission $submission): ChallengeSubmission
    {
        $challenge = $submission->challenge;
        $testCases = $this->challenges->testCasesForChallenge($challenge, sampleOnly: false);
        $driver = EvaluationDriver::tryFrom($submission->evaluation_driver ?? 'local');

        $evaluation = $this->evaluator->evaluate($challenge, $submission->code, $testCases, driver: $driver);

        return DB::transaction(function () use ($submission, $evaluation) {
            $this->submissions->updateEvaluation($submission, [
                'status' => $evaluation->status,
                'tests_passed' => $evaluation->testsPassed,
                'tests_total' => $evaluation->testsTotal,
                'runtime_ms' => $evaluation->runtimeMs,
            ]);

            $this->submissions->storeResults($submission->fresh(), array_map(
                fn ($result) => $result->toArray(),
                $evaluation->results,
            ));

            $submission = $submission->fresh(['results.testCase', 'challenge']);
            $this->applyPostEvaluation($submission->user, $challenge = $submission->challenge, $submission, $evaluation);

            return $submission;
        });
    }

    /**
     * @param  array<string, mixed>  $meta
     */
    private function queueSubmission(
        User $user,
        CodingChallenge $challenge,
        string $code,
        int $attemptsUsed,
        SubmissionSource $source,
        EvaluationDriver $driver,
        array $meta,
    ): ChallengeSubmission {
        $submission = $this->submissions->create([
            'user_id' => $user->id,
            'coding_challenge_id' => $challenge->id,
            'code' => $code,
            'language' => $challenge->language,
            'submission_source' => $source,
            'evaluation_driver' => $driver,
            'github_owner' => $meta['github_owner'] ?? null,
            'github_repo' => $meta['github_repo'] ?? null,
            'github_ref' => $meta['github_ref'] ?? null,
            'github_path' => $meta['github_path'] ?? null,
            'github_commit_sha' => $meta['github_commit_sha'] ?? null,
            'status' => SubmissionStatus::Running,
            'attempt_number' => $attemptsUsed + 1,
            'tests_passed' => 0,
            'tests_total' => 0,
        ]);

        EvaluateChallengeSubmission::dispatch($submission->id);

        return $submission->fresh(['results.testCase']);
    }

    /**
     * @param  array<string, mixed>  $meta
     * @param  \Illuminate\Support\Collection  $testCases
     */
    private function evaluateSync(
        User $user,
        CodingChallenge $challenge,
        string $code,
        int $attemptsUsed,
        SubmissionSource $source,
        EvaluationDriver $driver,
        array $meta,
        $testCases,
    ): ChallengeSubmission {
        return DB::transaction(function () use ($user, $challenge, $code, $attemptsUsed, $source, $driver, $meta, $testCases) {
            $evaluation = $this->evaluator->evaluate($challenge, $code, $testCases, driver: $driver);

            $submission = $this->submissions->create([
                'user_id' => $user->id,
                'coding_challenge_id' => $challenge->id,
                'code' => $code,
                'language' => $challenge->language,
                'submission_source' => $source,
                'evaluation_driver' => $driver,
                'github_owner' => $meta['github_owner'] ?? null,
                'github_repo' => $meta['github_repo'] ?? null,
                'github_ref' => $meta['github_ref'] ?? null,
                'github_path' => $meta['github_path'] ?? null,
                'github_commit_sha' => $meta['github_commit_sha'] ?? null,
                'status' => $evaluation->status,
                'attempt_number' => $attemptsUsed + 1,
                'tests_passed' => $evaluation->testsPassed,
                'tests_total' => $evaluation->testsTotal,
                'runtime_ms' => $evaluation->runtimeMs,
            ]);

            $this->submissions->storeResults($submission, array_map(
                fn ($result) => $result->toArray(),
                $evaluation->results,
            ));

            $submission = $submission->fresh(['results.testCase']);
            $this->applyPostEvaluation($user, $challenge, $submission, $evaluation);

            return $submission;
        });
    }

    private function applyPostEvaluation(
        User $user,
        CodingChallenge $challenge,
        ChallengeSubmission $submission,
        EvaluationResult $evaluation,
    ): void {
        if ($evaluation->status->countsAsPassed()) {
            $this->triggerProgressEvaluation($user, $challenge);
            $this->gamification->awardXp(
                $user,
                XpSourceType::ChallengePass,
                $challenge->id,
                XpRules::challenge(),
                'Coding challenge passed',
                ['submission_id' => $submission->id],
            );
        } elseif ($evaluation->status === SubmissionStatus::NeedsReview) {
            $level = $challenge->level;
            $enrollment = $this->enrollments->findActiveForUserAndPath($user, $level->learning_path_id);

            if ($enrollment) {
                $progress = $this->levelProgress->findForEnrollmentAndLevel($enrollment, $level);

                if ($progress) {
                    $this->levelProgress->markInProgress($progress);
                }
            }
        }
    }

    public function review(
        User $mentor,
        ChallengeSubmission $submission,
        SubmissionStatus $status,
        ?string $feedback,
        ?int $score,
    ): ChallengeSubmission {
        if (! in_array($status, [SubmissionStatus::Approved, SubmissionStatus::Rejected], true)) {
            throw ValidationException::withMessages([
                'status' => 'Review must approve or reject the submission.',
            ]);
        }

        return DB::transaction(function () use ($mentor, $submission, $status, $feedback, $score) {
            $updated = $this->submissions->updateReview(
                $submission,
                $mentor,
                $status->value,
                $feedback,
                $score,
            );

            if ($status === SubmissionStatus::Approved) {
                $this->triggerProgressEvaluation($submission->user, $submission->challenge);
                $this->gamification->awardXp(
                    $submission->user,
                    XpSourceType::ChallengeApproved,
                    $submission->id,
                    XpRules::challenge(mentorApproved: true),
                    'Challenge approved by mentor',
                    ['challenge_id' => $submission->coding_challenge_id],
                );
            }

            return $updated;
        });
    }

    private function resolveDriver(): EvaluationDriver
    {
        return EvaluationDriver::tryFrom(config('evaluation.driver', 'local')) ?? EvaluationDriver::Local;
    }

    private function triggerProgressEvaluation(User $user, CodingChallenge $challenge): void
    {
        $level = $challenge->level;
        $enrollment = $this->enrollments->findActiveForUserAndPath($user, $level->learning_path_id);

        if (! $enrollment) {
            return;
        }

        $progress = $this->levelProgress->findForEnrollmentAndLevel($enrollment, $level);

        if ($progress) {
            $this->levelProgress->markInProgress($progress);
        }

        $this->progressEngine->evaluate($enrollment, $level);
    }
}
