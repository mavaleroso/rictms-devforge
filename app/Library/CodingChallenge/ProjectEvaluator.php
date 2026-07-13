<?php

namespace App\Library\CodingChallenge;

use App\Enums\ChallengeAssertionType;
use App\Enums\SubmissionStatus;
use App\Models\ChallengeTestCase;
use App\Models\CodingChallenge;
use Illuminate\Support\Collection;

final class ProjectEvaluator
{
    public function __construct(
        private readonly ChallengeTemplateRepository $templates,
    ) {}

    /**
     * @param  array<string, string>  $files
     * @param  Collection<int, ChallengeTestCase>  $testCases
     */
    public function evaluate(
        CodingChallenge $challenge,
        array $files,
        Collection $testCases,
        bool $sampleOnly = false,
    ): EvaluationResult {
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

        $workspace = $this->mergeWorkspace($challenge, $files);
        $results = [];
        $passed = 0;
        $totalRuntime = 0;

        foreach ($cases as $testCase) {
            $started = hrtime(true);
            $result = $this->assertCase($testCase, $workspace);
            $runtime = (int) max(1, (hrtime(true) - $started) / 1_000_000);

            $results[] = new TestCaseResult(
                testCaseId: $testCase->id,
                label: $testCase->label,
                passed: $result['passed'],
                expectedOutput: $result['expected'],
                actualOutput: $result['actual'],
                errorMessage: $result['error'],
                runtimeMs: $runtime,
                isSample: (bool) $testCase->is_sample,
            );

            $totalRuntime += $runtime;

            if ($result['passed']) {
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

    /**
     * @param  array<string, string>  $files
     * @return array<string, string>
     */
    private function mergeWorkspace(CodingChallenge $challenge, array $files): array
    {
        $templateKey = $challenge->template_key ?? config('coding-challenges.default_project_template', 'laravel-inertia-react-template');
        $workspace = $this->templates->files($templateKey);

        foreach ($files as $path => $content) {
            if (! is_string($path) || ! is_string($content)) {
                continue;
            }

            if (! array_key_exists($path, $workspace)) {
                // Allow creating new files when assertions ask for file_exists.
                $workspace[$path] = $content;

                continue;
            }

            $workspace[$path] = $content;
        }

        return $workspace;
    }

    /**
     * @param  array<string, string>  $workspace
     * @return array{passed: bool, expected: ?string, actual: ?string, error: ?string}
     */
    private function assertCase(ChallengeTestCase $testCase, array $workspace): array
    {
        $type = $testCase->assertion_type instanceof ChallengeAssertionType
            ? $testCase->assertion_type
            : ChallengeAssertionType::tryFrom((string) $testCase->assertion_type) ?? ChallengeAssertionType::FileContains;

        $path = $testCase->target_path;
        $expected = $testCase->expected_output;

        return match ($type) {
            ChallengeAssertionType::FileExists => $this->assertFileExists($path, $workspace),
            ChallengeAssertionType::FileContains => $this->assertFileContains($path, $expected, $workspace),
            ChallengeAssertionType::FileRegex => $this->assertFileRegex($path, $expected, $workspace),
            ChallengeAssertionType::FileEquals => $this->assertFileEquals($path, $expected, $workspace),
            ChallengeAssertionType::FunctionOutput => [
                'passed' => false,
                'expected' => $expected,
                'actual' => null,
                'error' => 'Function assertions are not valid in project workspace mode.',
            ],
        };
    }

    /** @param  array<string, string>  $workspace */
    private function assertFileExists(?string $path, array $workspace): array
    {
        if (! $path) {
            return ['passed' => false, 'expected' => 'path', 'actual' => null, 'error' => 'Missing target_path.'];
        }

        $exists = array_key_exists($path, $workspace);

        return [
            'passed' => $exists,
            'expected' => "File exists: {$path}",
            'actual' => $exists ? 'present' : 'missing',
            'error' => $exists ? null : "Expected file {$path} to exist.",
        ];
    }

    /** @param  array<string, string>  $workspace */
    private function assertFileContains(?string $path, ?string $needle, array $workspace): array
    {
        if (! $path || $needle === null || $needle === '') {
            return ['passed' => false, 'expected' => $needle, 'actual' => null, 'error' => 'Missing target_path or expected content.'];
        }

        if (! array_key_exists($path, $workspace)) {
            return ['passed' => false, 'expected' => $needle, 'actual' => null, 'error' => "File {$path} is missing."];
        }

        $content = $workspace[$path];
        $passed = str_contains($content, $needle);

        return [
            'passed' => $passed,
            'expected' => $needle,
            'actual' => $passed ? $needle : $this->snippet($content),
            'error' => $passed ? null : "Expected {$path} to contain the required snippet.",
        ];
    }

    /** @param  array<string, string>  $workspace */
    private function assertFileRegex(?string $path, ?string $pattern, array $workspace): array
    {
        if (! $path || ! $pattern) {
            return ['passed' => false, 'expected' => $pattern, 'actual' => null, 'error' => 'Missing target_path or regex.'];
        }

        if (! array_key_exists($path, $workspace)) {
            return ['passed' => false, 'expected' => $pattern, 'actual' => null, 'error' => "File {$path} is missing."];
        }

        $content = $workspace[$path];
        $delimited = str_starts_with($pattern, '/') ? $pattern : '/'.$pattern.'/s';

        $passed = @preg_match($delimited, $content) === 1;

        return [
            'passed' => $passed,
            'expected' => $pattern,
            'actual' => $passed ? 'matched' : $this->snippet($content),
            'error' => $passed ? null : "Expected {$path} to match {$pattern}.",
        ];
    }

    /** @param  array<string, string>  $workspace */
    private function assertFileEquals(?string $path, ?string $expected, array $workspace): array
    {
        if (! $path || $expected === null) {
            return ['passed' => false, 'expected' => $expected, 'actual' => null, 'error' => 'Missing target_path or expected content.'];
        }

        if (! array_key_exists($path, $workspace)) {
            return ['passed' => false, 'expected' => $expected, 'actual' => null, 'error' => "File {$path} is missing."];
        }

        $actual = $workspace[$path];
        $passed = rtrim($actual) === rtrim($expected);

        return [
            'passed' => $passed,
            'expected' => $expected,
            'actual' => $actual,
            'error' => $passed ? null : "File {$path} does not match expected contents.",
        ];
    }

    private function snippet(string $content): string
    {
        $trimmed = trim($content);

        return mb_strlen($trimmed) > 180 ? mb_substr($trimmed, 0, 180).'…' : $trimmed;
    }
}
