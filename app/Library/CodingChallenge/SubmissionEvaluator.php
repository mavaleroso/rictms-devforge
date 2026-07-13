<?php

namespace App\Library\CodingChallenge;

use App\Enums\EvaluationDriver;
use App\Enums\SubmissionStatus;
use App\Models\ChallengeTestCase;
use App\Models\CodingChallenge;
use Illuminate\Support\Collection;

final class SubmissionEvaluator
{
    public function __construct(
        private readonly EvaluationRunnerFactory $runnerFactory,
        private readonly ProjectEvaluator $projectEvaluator,
    ) {}

    /**
     * @param  Collection<int, ChallengeTestCase>  $testCases
     * @param  array<string, string>|null  $files
     */
    public function evaluate(
        CodingChallenge $challenge,
        string $code,
        Collection $testCases,
        bool $sampleOnly = false,
        ?EvaluationDriver $driver = null,
        ?array $files = null,
    ): EvaluationResult {
        if ($challenge->isProjectWorkspace()) {
            return $this->projectEvaluator->evaluate(
                $challenge,
                $files ?? [],
                $testCases,
                $sampleOnly,
            );
        }

        $runner = $this->runnerFactory->forDriver($driver);
        $cases = $sampleOnly
            ? $testCases->where('is_sample', true)->values()
            : $testCases->values();

        if ($cases->isEmpty()) {
            return new EvaluationResult(
                status: SubmissionStatus::Failed,
                testsPassed: 0,
                testsTotal: 0,
                runtimeMs: 0,
                results: [],
            );
        }

        $results = [];
        $passed = 0;
        $totalRuntime = 0;

        foreach ($cases as $testCase) {
            $result = $runner->run(
                $challenge->language,
                $challenge->entry_point,
                $code,
                $testCase,
                $challenge->time_limit_ms ?? 2000,
            );

            $results[] = $result;
            $totalRuntime += $result->runtimeMs;

            if ($result->passed) {
                $passed++;
            }
        }

        $allPassed = $passed === $cases->count();

        $status = match (true) {
            ! $allPassed => SubmissionStatus::Failed,
            $challenge->requires_mentor_review => SubmissionStatus::NeedsReview,
            default => SubmissionStatus::Passed,
        };

        return new EvaluationResult(
            status: $status,
            testsPassed: $passed,
            testsTotal: $cases->count(),
            runtimeMs: $totalRuntime,
            results: $results,
        );
    }
}
