<?php

namespace App\Library\CodingChallenge;

use App\Enums\ChallengeLanguage;
use App\Models\ChallengeTestCase;
use Symfony\Component\Process\Process;

final class DockerCodeRunner
{
    public function __construct(
        private readonly CodeRunner $localRunner,
    ) {}

    public function isAvailable(): bool
    {
        $process = new Process(['docker', 'version']);
        $process->setTimeout(5);

        try {
            $process->run();

            return $process->isSuccessful();
        } catch (\Throwable) {
            return false;
        }
    }

    public function run(
        ChallengeLanguage $language,
        string $entryPoint,
        string $code,
        ChallengeTestCase $testCase,
        int $timeLimitMs,
    ): TestCaseResult {
        if (! $this->isAvailable()) {
            return $this->localRunner->run($language, $entryPoint, $code, $testCase, $timeLimitMs);
        }

        $definition = LanguageRegistry::get($language);
        $image = config("evaluation.docker.images.{$language->value}");

        if (! $image) {
            return $this->localRunner->run($language, $entryPoint, $code, $testCase, $timeLimitMs);
        }

        $code = SolutionNormalizer::normalize($language, $code);
        $tempDir = sys_get_temp_dir().'/devforge-docker-'.bin2hex(random_bytes(8));
        mkdir($tempDir, 0700, true);

        $solutionFile = 'solution.'.$definition->fileExtension;
        $harnessFile = 'harness.'.$definition->fileExtension;

        try {
            file_put_contents($tempDir.'/'.$solutionFile, $code);
            file_put_contents($tempDir.'/'.$harnessFile, $this->buildHarness($language, $entryPoint, $solutionFile));

            $inputJson = json_encode($testCase->input, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
            $command = match ($language) {
                ChallengeLanguage::Php => ['php', '/workspace/'.$harnessFile],
                ChallengeLanguage::Javascript => ['node', '/workspace/'.$harnessFile],
                ChallengeLanguage::Python => ['python', '/workspace/'.$harnessFile],
            };

            $process = new Process([
                'docker', 'run', '--rm', '--network=none',
                '-v', $tempDir.':/workspace:ro',
                '-i',
                $image,
                ...$command,
            ]);
            $process->setInput($inputJson);
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
                    errorMessage: 'Docker execution failed: '.$e->getMessage(),
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
                    errorMessage: trim($process->getErrorOutput()) ?: 'Docker runtime error',
                    runtimeMs: $runtimeMs,
                    isSample: $testCase->is_sample,
                );
            }

            $actual = trim($process->getOutput());
            $passed = OutputComparator::equals($testCase->expected_output, $actual);
            $errorMessage = null;

            if (! $passed) {
                $errorMessage = $actual === 'null'
                    ? 'Function returned null — make sure your solution includes a return statement.'
                    : 'Output does not match expected result.';
            }

            return new TestCaseResult(
                testCaseId: $testCase->id,
                label: $testCase->label,
                passed: $passed,
                expectedOutput: $testCase->expected_output,
                actualOutput: $actual,
                errorMessage: $errorMessage,
                runtimeMs: $runtimeMs,
                isSample: $testCase->is_sample,
            );
        } finally {
            foreach (glob($tempDir.'/*') ?: [] as $file) {
                @unlink($file);
            }
            @rmdir($tempDir);
        }
    }

    private function buildHarness(ChallengeLanguage $language, string $entryPoint, string $solutionFile): string
    {
        return match ($language) {
            ChallengeLanguage::Php => <<<PHP
<?php
require '/workspace/{$solutionFile}';
\$input = json_decode(stream_get_contents(STDIN), true, 512, JSON_THROW_ON_ERROR);
\$args = \$input['args'] ?? [];
\$result = {$entryPoint}(...\$args);
echo json_encode(\$result, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
PHP,
            ChallengeLanguage::Javascript => <<<JS
const { {$entryPoint} } = require('/workspace/{$solutionFile}');
const fs = require('fs');
const input = JSON.parse(fs.readFileSync(0, 'utf8'));
const args = input.args || [];
const result = {$entryPoint}(...args);
console.log(JSON.stringify(result));
JS,
            ChallengeLanguage::Python => <<<PY
import json
import sys
import importlib.util
spec = importlib.util.spec_from_file_location('solution', '/workspace/{$solutionFile}')
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
input_data = json.loads(sys.stdin.read())
args = input_data.get('args', [])
result = getattr(module, '{$entryPoint}')(*args)
print(json.dumps(result, separators=(',', ':')))
PY,
        };
    }
}
