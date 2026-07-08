<?php

use App\Models\User;
use App\Services\AI\TutorService;
use App\Services\Integrations\GitHub\GitHubAccountService;
use App\Services\Learning\RecommendationService;
use Illuminate\Support\Facades\Http;

test('intern receives personalized recommendations when enrolled', function () {
    $intern = userWithRole('intern');

    $this->seed(\Database\Seeders\DevForgeSeeder::class);

    $recommendations = app(RecommendationService::class)->forUser(
        User::query()->where('email', 'intern1@devforge.test')->firstOrFail(),
    );

    expect($recommendations)->not->toBeEmpty()
        ->and($recommendations[0])->toHaveKeys(['type', 'title', 'reason', 'href', 'priority']);
});

test('ai tutor surfaces openai api errors instead of mock fallback', function () {
    config([
        'ai.driver' => 'openai',
        'ai.api_key' => 'test-key',
        'ai.base_url' => 'https://api.openai.com/v1',
    ]);

    Http::fake([
        'api.openai.com/*' => Http::response([
            'error' => ['message' => 'You exceeded your current quota, please check your plan and billing details.'],
        ], 429),
    ]);

    $intern = userWithRole('intern');

    $session = app(TutorService::class)->findOrCreateSession(
        $intern,
        'challenge',
        99,
        null,
        'Sum of Two Numbers',
    );

    app(TutorService::class)->sendMessage($session, $intern, 'I need a hint');
})->throws(
    Illuminate\Validation\ValidationException::class,
    'You exceeded your current quota',
);

test('ai tutor uses openai when configured', function () {
    config([
        'ai.driver' => 'openai',
        'ai.api_key' => 'test-key',
        'ai.base_url' => 'https://api.openai.com/v1',
    ]);

    Http::fake([
        'api.openai.com/*' => Http::response([
            'choices' => [
                ['message' => ['content' => 'Try breaking the problem into smaller steps.']],
            ],
        ], 200),
    ]);

    $intern = userWithRole('intern');

    $session = app(TutorService::class)->findOrCreateSession(
        $intern,
        'challenge',
        100,
        null,
        'Sum of Two Numbers',
    );

    $reply = app(TutorService::class)->sendMessage($session, $intern, 'I need a hint');

    expect($reply->content)->toBe('Try breaking the problem into smaller steps.');
});

test('ai tutor returns mock guidance', function () {
    $intern = userWithRole('intern');

    $session = app(TutorService::class)->findOrCreateSession(
        $intern,
        'challenge',
        1,
        null,
        'Sum of Two Numbers',
    );

    $reply = app(TutorService::class)->sendMessage($session, $intern, 'I need a hint');

    expect($reply->role->value)->toBe('assistant')
        ->and($reply->content)->not->toBe('');
});

test('intern can post tutor message via api', function () {
    $intern = userWithRole('intern');

    $this->actingAs($intern)
        ->postJson(route('learn.tutor.messages.store'), [
            'context_type' => 'level',
            'context_id' => 1,
            'title' => 'Level 1',
            'message' => 'How do I approach this?',
        ])
        ->assertOk()
        ->assertJsonStructure(['id', 'title', 'messages']);
});

test('github account can be connected and disconnected', function () {
    $intern = userWithRole('intern');

    app(GitHubAccountService::class)->connect($intern, 'devforge-intern', 'fake-token-123');

    expect($intern->fresh()->github_username)->toBe('devforge-intern');

    app(GitHubAccountService::class)->disconnect($intern->fresh());

    expect($intern->fresh()->github_username)->toBeNull();
});

test('github submission fetches file content', function () {
    Http::fake([
        'api.github.com/*' => Http::sequence()
            ->push('<?php function sumTwo($a,$b){return $a+$b;}', 200)
            ->push(['sha' => 'abc123def'], 200),
    ]);

    $intern = userWithRole('intern');
    app(GitHubAccountService::class)->connect($intern, 'devforge-intern', 'fake-token');

    $result = app(\App\Services\Integrations\GitHub\GitHubContentFetcher::class)->fetchFile(
        $intern->fresh(),
        'owner',
        'repo',
        'solution.php',
        'main',
    );

    expect($result['code'])->toContain('sumTwo')
        ->and($result['commit_sha'])->toBe('abc123def');
});

test('integrations settings page renders', function () {
    $intern = userWithRole('intern');

    $this->actingAs($intern)
        ->get(route('integrations.edit'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('settings/integrations'));
});
