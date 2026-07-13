<?php

namespace App\Services\Admin;

use App\Enums\ChallengeEnvironment;
use App\Enums\ChallengeLanguage;
use App\Enums\ChallengeWorkspaceMode;
use App\Library\CodingChallenge\EnvironmentRegistry;
use App\Models\ChallengeTestCase;
use App\Models\CodingChallenge;
use App\Models\Level;
use App\Repositories\Contracts\ChallengeTestCaseRepository;
use App\Repositories\Contracts\CodingChallengeRepository;

final class ChallengeContentService
{
    public function __construct(
        private readonly CodingChallengeRepository $challenges,
        private readonly ChallengeTestCaseRepository $testCases,
    ) {}

    public function storeChallenge(Level $level, array $attributes): CodingChallenge
    {
        $attributes = $this->normalizeAttributes($attributes);

        return $this->challenges->createForLevel($level, $attributes);
    }

    public function updateChallenge(CodingChallenge $challenge, array $attributes): void
    {
        $attributes = $this->normalizeAttributes($attributes, $challenge);

        $this->challenges->update($challenge, $attributes);
    }

    public function deleteChallenge(CodingChallenge $challenge): void
    {
        $this->challenges->delete($challenge);
    }

    public function storeTestCase(CodingChallenge $challenge, array $attributes): ChallengeTestCase
    {
        return $this->testCases->createForChallenge($challenge, $attributes);
    }

    public function updateTestCase(ChallengeTestCase $testCase, array $attributes): void
    {
        $this->testCases->update($testCase, $attributes);
    }

    public function deleteTestCase(ChallengeTestCase $testCase): void
    {
        $this->testCases->delete($testCase);
    }

    /**
     * @param  array<string, mixed>  $attributes
     * @return array<string, mixed>
     */
    private function normalizeAttributes(array $attributes, ?CodingChallenge $existing = null): array
    {
        if (! isset($attributes['environment'])) {
            $attributes['environment'] = $existing?->environment?->value
                ?? ChallengeEnvironment::LaravelInertiaReact->value;
        }

        if (! isset($attributes['workspace_mode'])) {
            $attributes['workspace_mode'] = $existing?->workspace_mode?->value
                ?? ChallengeWorkspaceMode::SingleFile->value;
        }

        $environment = is_string($attributes['environment'])
            ? ChallengeEnvironment::from($attributes['environment'])
            : $attributes['environment'];

        $workspaceMode = is_string($attributes['workspace_mode'])
            ? ChallengeWorkspaceMode::from($attributes['workspace_mode'])
            : $attributes['workspace_mode'];

        if ($workspaceMode === ChallengeWorkspaceMode::Project && empty($attributes['template_key'])) {
            $attributes['template_key'] = $existing?->template_key ?? config('coding-challenges.default_project_template', 'laravel-inertia-react-template');
        }

        if (! isset($attributes['language'])) {
            $attributes['language'] = $existing?->language?->value
                ?? $environment->defaultLanguage()->value;
        }

        $language = is_string($attributes['language'])
            ? ChallengeLanguage::from($attributes['language'])
            : $attributes['language'];

        $entryPoint = $attributes['entry_point']
            ?? $existing?->entry_point
            ?? 'solution';

        $starterMissingOrBlank = ! isset($attributes['starter_code'])
            || trim((string) $attributes['starter_code']) === '';

        if ($starterMissingOrBlank && isset($attributes['entry_point'], $attributes['language'])) {
            $attributes['starter_code'] = EnvironmentRegistry::defaultStarter(
                $environment,
                $language,
                $entryPoint,
            );
        } elseif ($starterMissingOrBlank && $existing === null) {
            $attributes['starter_code'] = EnvironmentRegistry::defaultStarter(
                $environment,
                $language,
                $entryPoint,
            );
        }

        return $attributes;
    }
}
