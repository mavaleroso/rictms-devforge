<?php

namespace App\Library\CodingChallenge;

use App\Enums\ChallengeLanguage;
use App\Models\ChallengeTestCase;
use Symfony\Component\Process\Process;

final class CodeRunner
{
    public function run(
        ChallengeLanguage $language,
        string $entryPoint,
        string $code,
        ChallengeTestCase $testCase,
        int $timeLimitMs,
    ): TestCaseResult {
        $definition = LanguageRegistry::get($language);
        $binary = RuntimeBinaryResolver::resolve($language);
        $inputJson = json_encode($testCase->input, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);

        $tempDir = $this->createTempDirectory();
        $solutionPath = $tempDir.'/solution.'.$definition->fileExtension;
        $harnessPath = $tempDir.'/harness.'.$definition->fileExtension;

        try {
            file_put_contents($solutionPath, $code);
            file_put_contents($harnessPath, $this->buildHarness($language, $entryPoint, $solutionPath));

            $command = match ($language) {
                ChallengeLanguage::Php => [$binary, $harnessPath],
                ChallengeLanguage::Javascript => [$binary, $harnessPath],
                ChallengeLanguage::Python => [$binary, $harnessPath],
            };

            $process = new Process($command, $tempDir, null, $inputJson);
            $process->setTimeout(max(1, (int) ceil($timeLimitMs / 1000)));
            $start = hrtime(true);

            try {
                $process->run();
            } catch (\Throwable $e) {
                return new TestCaseResult(
                    testCaseId: $testCase->id,
                    label: $testCase->label,
                    passed: false,
                    expectedOutput: $testCase->expected_output,
                    actualOutput: null,
                    errorMessage: 'Execution timed out or failed: '.$e->getMessage(),
                    runtimeMs: (int) ((hrtime(true) - $start) / 1_000_000),
                    isSample: $testCase->is_sample,
                );
            }

            $runtimeMs = (int) ((hrtime(true) - $start) / 1_000_000);

            if (! $process->isSuccessful()) {
                return new TestCaseResult(
                    testCaseId: $testCase->id,
                    label: $testCase->label,
                    passed: false,
                    expectedOutput: $testCase->expected_output,
                    actualOutput: trim($process->getOutput()),
                    errorMessage: trim($process->getErrorOutput()) ?: 'Runtime error',
                    runtimeMs: $runtimeMs,
                    isSample: $testCase->is_sample,
                );
            }

            $actual = trim($process->getOutput());
            $passed = OutputComparator::equals($testCase->expected_output, $actual);

            return new TestCaseResult(
                testCaseId: $testCase->id,
                label: $testCase->label,
                passed: $passed,
                expectedOutput: $testCase->expected_output,
                actualOutput: $actual,
                errorMessage: $passed ? null : 'Output does not match expected result.',
                runtimeMs: $runtimeMs,
                isSample: $testCase->is_sample,
            );
        } finally {
            $this->cleanup($tempDir);
        }
    }

    private function buildHarness(ChallengeLanguage $language, string $entryPoint, string $solutionPath): string
    {
        $solutionFile = basename($solutionPath);

        return match ($language) {
            ChallengeLanguage::Php => <<<PHP
<?php
require '{$solutionFile}';

\$input = json_decode(stream_get_contents(STDIN), true, 512, JSON_THROW_ON_ERROR);
\$args = \$input['args'] ?? [];
\$result = {$entryPoint}(...\$args);
echo json_encode(\$result, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
PHP,
            ChallengeLanguage::Javascript => <<<JS
const fs = require('fs');
const { {$entryPoint} } = require('./{$solutionFile}');
const input = JSON.parse(fs.readFileSync(0, 'utf8'));
const args = input.args || [];
const result = {$entryPoint}(...args);
console.log(JSON.stringify(result));
JS,
            ChallengeLanguage::Python => <<<PY
import json
import sys
import importlib.util

spec = importlib.util.spec_from_file_location('solution', '{$solutionFile}')
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)

input_data = json.loads(sys.stdin.read())
args = input_data.get('args', [])
result = getattr(module, '{$entryPoint}')(*args)
print(json.dumps(result, separators=(',', ':')))
PY,
        };
    }

    private function createTempDirectory(): string
    {
        $dir = sys_get_temp_dir().'/devforge-challenge-'.bin2hex(random_bytes(8));

        if (! mkdir($dir, 0700, true) && ! is_dir($dir)) {
            throw new \RuntimeException('Unable to create temp directory.');
        }

        return $dir;
    }

    private function cleanup(string $dir): void
    {
        if (! is_dir($dir)) {
            return;
        }

        foreach (glob($dir.'/*') ?: [] as $file) {
            if (is_file($file)) {
                @unlink($file);
            }
        }

        @rmdir($dir);
    }
}
