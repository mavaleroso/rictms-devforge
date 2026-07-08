<?php

use App\Actions\Challenge\SubmitChallenge;
use App\Enums\ChallengeLanguage;
use App\Enums\ProgressStatus;
use App\Enums\SubmissionStatus;
use App\Library\CodingChallenge\LanguageRegistry;
use App\Models\ChallengeTestCase;
use App\Models\CodingChallenge;
use App\Models\Enrollment;
use App\Models\LearningPath;
use App\Models\Level;
use App\Models\LevelProgress;

function seedChallengeLevel(): array
{
    $intern = userWithRole('intern');
    $path = LearningPath::create(['name' => 'Challenge Path', 'slug' => 'challenge-path', 'is_active' => true]);
    $level = Level::create([
        'learning_path_id' => $path->id,
        'number' => 1,
        'title' => 'L1',
        'estimated_minutes' => 30,
        'difficulty' => 'beginner',
    ]);

    $challenge = CodingChallenge::create([
        'level_id' => $level->id,
        'title' => 'Sum Two',
        'description' => 'Return sum of two numbers',
        'language' => ChallengeLanguage::Php,
        'entry_point' => 'sumTwo',
        'starter_code' => LanguageRegistry::defaultStarter(ChallengeLanguage::Php, 'sumTwo'),
        'time_limit_ms' => 2000,
        'memory_limit_mb' => 128,
        'max_attempts' => 3,
        'requires_mentor_review' => false,
        'is_active' => true,
    ]);

    ChallengeTestCase::create([
        'coding_challenge_id' => $challenge->id,
        'label' => 'Sample',
        'input' => ['args' => [2, 3]],
        'expected_output' => '5',
        'is_sample' => true,
        'sort_order' => 1,
    ]);

    ChallengeTestCase::create([
        'coding_challenge_id' => $challenge->id,
        'label' => 'Hidden',
        'input' => ['args' => [10, 15]],
        'expected_output' => '25',
        'is_sample' => false,
        'sort_order' => 2,
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
        'status' => ProgressStatus::InProgress,
    ]);

    return compact('intern', 'challenge', 'level', 'enrollment');
}

test('correct php submission passes all test cases', function () {
    ['intern' => $intern, 'challenge' => $challenge] = seedChallengeLevel();

    $code = <<<'PHP'
<?php
function sumTwo($a, $b) {
    return $a + $b;
}
PHP;

    $submission = app(SubmitChallenge::class)->execute($intern, $challenge, $code);

    expect($submission->status)->toBe(SubmissionStatus::Passed)
        ->and($submission->tests_passed)->toBe(2)
        ->and($submission->tests_total)->toBe(2);
});

test('incorrect submission fails hidden tests', function () {
    ['intern' => $intern, 'challenge' => $challenge] = seedChallengeLevel();

    $code = <<<'PHP'
<?php
function sumTwo($a, $b) {
    return $a * $b;
}
PHP;

    $submission = app(SubmitChallenge::class)->execute($intern, $challenge, $code);

    expect($submission->status)->toBe(SubmissionStatus::Failed)
        ->and($submission->tests_passed)->toBeLessThan(2);
});

test('php trim solution passes tab whitespace hidden cases', function () {
    $intern = userWithRole('intern');
    $path = LearningPath::create(['name' => 'Trim Path', 'slug' => 'trim-path', 'is_active' => true]);
    $level = Level::create([
        'learning_path_id' => $path->id,
        'number' => 1,
        'title' => 'L1',
        'estimated_minutes' => 30,
        'difficulty' => 'beginner',
    ]);

    $challenge = CodingChallenge::create([
        'level_id' => $level->id,
        'title' => 'Normalize',
        'description' => 'trim + upper',
        'language' => ChallengeLanguage::Php,
        'entry_point' => 'normalizeKeyFragment',
        'starter_code' => LanguageRegistry::defaultStarter(ChallengeLanguage::Php, 'normalizeKeyFragment'),
        'time_limit_ms' => 2000,
        'memory_limit_mb' => 128,
        'max_attempts' => 5,
        'requires_mentor_review' => false,
        'is_active' => true,
    ]);

    ChallengeTestCase::create([
        'coding_challenge_id' => $challenge->id,
        'label' => 'Spaces',
        'input' => ['args' => ['  ab  ']],
        'expected_output' => '"AB"',
        'is_sample' => true,
        'sort_order' => 1,
    ]);

    ChallengeTestCase::create([
        'coding_challenge_id' => $challenge->id,
        'label' => 'Tabs',
        'input' => ['args' => ["  \t  "]],
        'expected_output' => '""',
        'is_sample' => false,
        'sort_order' => 2,
    ]);

    Enrollment::create([
        'user_id' => $intern->id,
        'learning_path_id' => $path->id,
        'status' => 'active',
        'started_at' => now(),
    ]);

    $spaceOnly = <<<'PHP'
<?php
function normalizeKeyFragment($fragment) {
    $start = 0;
    $end = strlen($fragment) - 1;
    while ($start <= $end && $fragment[$start] == ' ') { $start++; }
    while ($end >= $start && $fragment[$end] == ' ') { $end--; }
    $result = '';
    for ($i = $start; $i <= $end; $i++) {
        $char = $fragment[$i];
        if ($char >= 'a' && $char <= 'z') {
            $char = chr(ord($char) - 32);
        }
        $result .= $char;
    }
    return $result;
}
PHP;

    $failed = app(SubmitChallenge::class)->execute($intern, $challenge, $spaceOnly);
    expect($failed->status)->toBe(SubmissionStatus::Failed)
        ->and($failed->tests_passed)->toBe(1);

    $correct = <<<'PHP'
function normalizeKeyFragment($fragment) {
    return strtoupper(trim($fragment));
}
PHP;

    $passed = app(SubmitChallenge::class)->execute($intern, $challenge, $correct);
    expect($passed->status)->toBe(SubmissionStatus::Passed)
        ->and($passed->tests_passed)->toBe(2);
});

test('intern submit response hides hidden test case details', function () {
    ['intern' => $intern, 'challenge' => $challenge] = seedChallengeLevel();

    $code = <<<'PHP'
<?php
function sumTwo($a, $b) {
    return $a * $b;
}
PHP;

    $this->actingAs($intern)
        ->postJson(route('learn.challenges.submit', $challenge), ['code' => $code, 'source' => 'editor'])
        ->assertOk()
        ->assertJsonPath('submission.status', 'failed')
        ->assertJsonPath('submission.results.1.test_case.label', 'Hidden test')
        ->assertJsonMissingPath('submission.results.1.test_case.input')
        ->assertJsonMissingPath('submission.results.1.actual_output')
        ->assertJsonPath('submission.results.1.error_message', 'Hidden test failed.');
});

test('intern can view challenge workspace', function () {
    ['intern' => $intern, 'challenge' => $challenge] = seedChallengeLevel();

    $this->actingAs($intern)
        ->get(route('learn.challenges.show', $challenge))
        ->assertOk();
});

test('mentor can review submission needing approval', function () {
    ['intern' => $intern, 'challenge' => $challenge] = seedChallengeLevel();
    $mentor = userWithRole('mentor');

    $challenge->update(['requires_mentor_review' => true]);

    $intern->enrollments()->first()?->update(['mentor_id' => $mentor->id]);

    $code = <<<'PHP'
<?php
function sumTwo($a, $b) {
    return $a + $b;
}
PHP;

    $submission = app(SubmitChallenge::class)->execute($intern, $challenge, $code);

    expect($submission->status)->toBe(SubmissionStatus::NeedsReview);

    $this->actingAs($mentor)
        ->get(route('mentor.reviews.show', $submission))
        ->assertOk();
});
