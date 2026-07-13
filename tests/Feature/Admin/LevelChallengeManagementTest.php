<?php

use App\Enums\ChallengeLanguage;
use App\Models\CodingChallenge;
use App\Models\LearningPath;
use App\Models\Level;

function createAdminLevelChallengeContext(): array
{
    $path = LearningPath::create([
        'name' => 'Challenge Path',
        'slug' => 'challenge-path',
        'is_active' => true,
    ]);

    $level = Level::create([
        'learning_path_id' => $path->id,
        'number' => 1,
        'title' => 'Level 1',
        'estimated_minutes' => 60,
        'difficulty' => 'beginner',
    ]);

    return compact('path', 'level');
}

test('admin can add multiple coding challenges to a level', function () {
    ['path' => $path, 'level' => $level] = createAdminLevelChallengeContext();
    $admin = userWithRole('admin');

    $this->actingAs($admin)
        ->post(route('admin.challenges.store', [$path, $level]), [
            'title' => 'Warm-up challenge',
            'description' => '<p>Return the sum of two integers.</p>',
            'language' => ChallengeLanguage::Php->value,
            'entry_point' => 'solution',
            'time_limit_ms' => 2000,
            'memory_limit_mb' => 128,
            'max_attempts' => 5,
            'sort_order' => 1,
        ])
        ->assertRedirect();

    $this->actingAs($admin)
        ->post(route('admin.challenges.store', [$path, $level]), [
            'title' => 'Follow-up challenge',
            'description' => '<p>Sort an array of integers.</p>',
            'language' => ChallengeLanguage::Javascript->value,
            'entry_point' => 'solution',
            'time_limit_ms' => 3000,
            'memory_limit_mb' => 128,
            'max_attempts' => 3,
            'sort_order' => 2,
        ])
        ->assertRedirect();

    $challenges = CodingChallenge::query()->where('level_id', $level->id)->orderBy('sort_order')->get();

    expect($challenges)->toHaveCount(2)
        ->and($challenges->pluck('title')->all())->toBe(['Warm-up challenge', 'Follow-up challenge'])
        ->and($challenges->every(fn ($c) => $c->environment === \App\Enums\ChallengeEnvironment::LaravelInertiaReact))->toBeTrue();
});

test('admin can create challenge in laravel inertia react environment', function () {
    ['path' => $path, 'level' => $level] = createAdminLevelChallengeContext();
    $admin = userWithRole('admin');

    $this->actingAs($admin)
        ->post(route('admin.challenges.store', [$path, $level]), [
            'title' => 'Inertia props helper',
            'description' => '<p>Normalize shared Inertia props.</p>',
            'language' => ChallengeLanguage::Php->value,
            'environment' => \App\Enums\ChallengeEnvironment::LaravelInertiaReact->value,
            'entry_point' => 'normalizeProps',
            'time_limit_ms' => 2000,
            'memory_limit_mb' => 128,
            'max_attempts' => 5,
            'sort_order' => 1,
        ])
        ->assertRedirect();

    $challenge = CodingChallenge::first();

    expect($challenge->environment)->toBe(\App\Enums\ChallengeEnvironment::LaravelInertiaReact)
        ->and($challenge->starter_code)->toContain('Laravel + Inertia + React');
});

test('admin can update and delete a coding challenge', function () {
    ['path' => $path, 'level' => $level] = createAdminLevelChallengeContext();
    $admin = userWithRole('admin');

    $this->actingAs($admin)
        ->post(route('admin.challenges.store', [$path, $level]), [
            'title' => 'Original challenge',
            'description' => '<p>Original prompt.</p>',
            'language' => ChallengeLanguage::Php->value,
            'entry_point' => 'solution',
            'time_limit_ms' => 2000,
            'memory_limit_mb' => 128,
            'max_attempts' => 5,
            'sort_order' => 1,
        ]);

    $challenge = CodingChallenge::first();

    $this->actingAs($admin)
        ->patch(route('admin.challenges.update', $challenge), [
            'title' => 'Updated challenge',
            'description' => '<p>Updated prompt.</p>',
        ])
        ->assertRedirect()
        ->assertSessionHasNoErrors();

    $challenge->refresh();

    expect($challenge->title)->toBe('Updated challenge')
        ->and($challenge->description)->toBe('<p>Updated prompt.</p>');

    $this->actingAs($admin)
        ->delete(route('admin.challenges.destroy', $challenge))
        ->assertRedirect();

    expect(CodingChallenge::count())->toBe(0);
});
