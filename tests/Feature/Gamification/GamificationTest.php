<?php

use App\Actions\Learning\CompleteContent;
use App\Enums\XpSourceType;
use App\Enums\MaterialType;
use App\Models\LearningMaterial;
use App\Models\LearningPath;
use App\Models\Level;
use App\Models\UserGamificationProfile;
use App\Models\XpTransaction;
use App\Services\Gamification\GamificationService;
use Database\Seeders\BadgeSeeder;

beforeEach(function () {
    $this->seed(BadgeSeeder::class);
});

test('completing material awards xp idempotently', function () {
    $intern = userWithRole('intern');

    $path = LearningPath::create(['name' => 'XP Path', 'slug' => 'xp-path', 'is_active' => true]);
    $level = Level::create([
        'learning_path_id' => $path->id,
        'number' => 1,
        'title' => 'L1',
        'estimated_minutes' => 30,
        'difficulty' => 'beginner',
    ]);

    $material = LearningMaterial::create([
        'level_id' => $level->id,
        'title' => 'Intro',
        'content' => 'Hello',
        'type' => MaterialType::Markdown,
        'sort_order' => 1,
    ]);

    app(CompleteContent::class)->execute($intern, $material);
    app(CompleteContent::class)->execute($intern, $material);

    expect(XpTransaction::query()->where('user_id', $intern->id)->where('source_type', XpSourceType::MaterialComplete)->count())->toBe(1)
        ->and(XpTransaction::query()->where('user_id', $intern->id)->count())->toBeGreaterThanOrEqual(2);

    $profile = UserGamificationProfile::query()->where('user_id', $intern->id)->first();

    expect($profile)->not->toBeNull()
        ->and($profile->total_xp)->toBeGreaterThan(0)
        ->and($profile->current_streak)->toBe(1);
});

test('gamification service summary includes tier progress', function () {
    $intern = userWithRole('intern');

    UserGamificationProfile::create([
        'user_id' => $intern->id,
        'total_xp' => 600,
        'current_streak' => 3,
        'longest_streak' => 5,
    ]);

    $summary = app(GamificationService::class)->summaryFor($intern);

    expect($summary['total_xp'])->toBe(600)
        ->and($summary['tier']['slug'])->toBe('builder')
        ->and($summary['current_streak'])->toBe(3);
});

test('intern can view leaderboard page', function () {
    $intern = userWithRole('intern');

    $this->actingAs($intern)
        ->get(route('learn.leaderboard.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('learn/leaderboard/index')
            ->has('leaderboard.all_time')
            ->has('gamification.total_xp'));
});

test('non-intern cannot view leaderboard', function () {
    $mentor = userWithRole('mentor');

    $this->actingAs($mentor)
        ->get(route('learn.leaderboard.index'))
        ->assertForbidden();
});
