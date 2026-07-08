<?php

namespace App\Library\CodingChallenge;

use App\Enums\SubmissionStatus;

final readonly class EvaluationResult
{
    /** @param  list<TestCaseResult>  $results */
    public function __construct(
        public SubmissionStatus $status,
        public int $testsPassed,
        public int $testsTotal,
        public int $runtimeMs,
        public array $results,
    ) {}

    public function allPassed(): bool
    {
        return $this->testsPassed === $this->testsTotal && $this->testsTotal > 0;
    }

    /** @return array<string, mixed> */
    public function toArray(): array
    {
        return [
            'status' => $this->status->value,
            'tests_passed' => $this->testsPassed,
            'tests_total' => $this->testsTotal,
            'runtime_ms' => $this->runtimeMs,
            'results' => array_map(fn (TestCaseResult $r) => $r->toArray(), $this->results),
        ];
    }
}
