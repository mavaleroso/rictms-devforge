<?php

use App\Enums\ChallengeAssertionType;
use App\Enums\ChallengeEnvironment;
use App\Enums\ChallengeLanguage;
use App\Enums\ChallengeWorkspaceMode;
use App\Enums\ProgressStatus;
use App\Library\CodingChallenge\ChallengeTemplateRepository;
use App\Models\ChallengeTestCase;
use App\Models\CodingChallenge;
use App\Models\Enrollment;
use App\Models\LearningPath;
use App\Models\Level;
use App\Models\LevelProgress;
use App\Models\User;

function makeProjectChallengeContext(): array
{
    $intern = userWithRole('intern');
    $path = LearningPath::create(['name' => 'Project Path', 'slug' => 'project-path-'.uniqid(), 'is_active' => true]);
    $level = Level::create([
        'learning_path_id' => $path->id,
        'number' => 1,
        'title' => 'Level 1',
        'estimated_minutes' => 60,
        'difficulty' => 'beginner',
    ]);

    $enrollment = Enrollment::create([
        'user_id' => $intern->id,
        'learning_path_id' => $path->id,
        'status' => 'active',
        'started_at' => now(),
    ]);

    LevelProgress::create([
        'enrollment_id' => $enrollment->id,
        'level_id' => $level->id,
        'status' => ProgressStatus::Available,
    ]);

    $challenge = CodingChallenge::create([
        'level_id' => $level->id,
        'title' => 'Update welcome headline',
        'description' => 'Change the headline.',
        'language' => ChallengeLanguage::Php,
        'environment' => ChallengeEnvironment::LaravelInertiaReact,
        'workspace_mode' => ChallengeWorkspaceMode::Project,
        'template_key' => 'laravel-inertia-react-template',
        'target_files' => ['resources/js/pages/welcome.tsx'],
        'entry_point' => 'solution',
        'starter_code' => '// project',
        'time_limit_ms' => 2000,
        'memory_limit_mb' => 128,
        'max_attempts' => 5,
        'is_active' => true,
    ]);

    ChallengeTestCase::create([
        'coding_challenge_id' => $challenge->id,
        'label' => 'Headline updated',
        'assertion_type' => ChallengeAssertionType::FileContains,
        'target_path' => 'resources/js/pages/welcome.tsx',
        'input' => ['args' => []],
        'expected_output' => 'Start building',
        'is_sample' => true,
        'sort_order' => 1,
    ]);

    return compact('intern', 'path', 'level', 'challenge');
}

test('installed laravel inertia react template is available', function () {
    $repo = app(ChallengeTemplateRepository::class);
    $files = $repo->files('laravel-inertia-react-template');

    expect($files)->toHaveKey('resources/js/pages/welcome.tsx')
        ->and($files)->toHaveKey('routes/web.php')
        ->and($files['resources/js/pages/welcome.tsx'])->toContain("Let's get started")
        ->and($repo->previewUrl('laravel-inertia-react-template'))->toBe('http://127.0.0.1:8001')
        ->and($repo->isProjectLayout('laravel-inertia-react-template'))->toBeTrue();
});

test('blank stub template remains available', function () {
    $repo = app(ChallengeTemplateRepository::class);
    $files = $repo->files('laravel-inertia-react/v1');

    expect($files)->toHaveKey('resources/js/pages/welcome.tsx');
});

test('intern can view project workspace challenge', function () {
    ['intern' => $intern, 'challenge' => $challenge] = makeProjectChallengeContext();

    $this->actingAs($intern)
        ->get(route('learn.challenges.show', $challenge))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('learn/challenges/show')
            ->where('challenge.data.workspace_mode', 'project')
            ->where('challenge.data.template_key', 'laravel-inertia-react-template')
            ->where('challenge.data.preview_url', 'http://127.0.0.1:8001')
            ->has('challenge.data.workspace_files'));
});

test('project challenge passes when task files are updated', function () {
    ['intern' => $intern, 'challenge' => $challenge] = makeProjectChallengeContext();
    $files = app(ChallengeTemplateRepository::class)->files('laravel-inertia-react-template');
    $files['resources/js/pages/welcome.tsx'] = str_replace("Let's get started", 'Start building', $files['resources/js/pages/welcome.tsx']);

    $this->actingAs($intern)
        ->postJson(route('learn.challenges.submit', $challenge), [
            'source' => 'editor',
            'files' => $files,
        ])
        ->assertOk()
        ->assertJsonPath('submission.status', 'passed');
});

test('project challenge fails when required edit is missing', function () {
    ['intern' => $intern, 'challenge' => $challenge] = makeProjectChallengeContext();
    $files = app(ChallengeTemplateRepository::class)->files('laravel-inertia-react-template');

    $this->actingAs($intern)
        ->postJson(route('learn.challenges.submit', $challenge), [
            'source' => 'editor',
            'files' => $files,
        ])
        ->assertOk()
        ->assertJsonPath('submission.status', 'failed');
});
