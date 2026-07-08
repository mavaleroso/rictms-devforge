<?php

namespace App\Library\CodingChallenge;

final readonly class TestCaseResult
{
    public function __construct(
        public int $testCaseId,
        public ?string $label,
        public bool $passed,
        public ?string $expectedOutput,
        public ?string $actualOutput,
        public ?string $errorMessage,
        public int $runtimeMs,
        public bool $isSample,
    ) {}

    /** @return array<string, mixed> */
    public function toArray(): array
    {
        return [
            'test_case_id' => $this->testCaseId,
            'label' => $this->label,
            'passed' => $this->passed,
            'expected_output' => $this->expectedOutput,
            'actual_output' => $this->actualOutput,
            'error_message' => $this->errorMessage,
            'runtime_ms' => $this->runtimeMs,
            'is_sample' => $this->isSample,
        ];
    }
}
