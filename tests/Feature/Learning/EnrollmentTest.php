<?php

use App\Actions\Learning\EnrollIntern;
use App\Enums\ProgressStatus;
use App\Models\LearningPath;
use App\Models\Level;

test('intern can enroll in an active learning path', function () {
    $intern = userWithRole('intern');

    $path = LearningPath::create([
        'name' => 'Enroll Test Path',
        'slug' => 'enroll-test',
        'is_active' => true,
    ]);

    Level::create([
        'learning_path_id' => $path->id,
        'number' => 1,
        'title' => 'Level 1',
        'estimated_minutes' => 60,
        'difficulty' => 'beginner',
    ]);

    $this->actingAs($intern)
        ->post(route('learn.paths.enroll', $path))
        ->assertRedirect(route('learn.paths.show', $path));

    expect($intern->enrollments()->where('learning_path_id', $path->id)->exists())->toBeTrue();
});

test('enrollment creates level progress with level 1 available', function () {
    $intern = userWithRole('intern');

    $path = LearningPath::create([
        'name' => 'Progress Path',
        'slug' => 'progress-path',
        'is_active' => true,
    ]);

    $level1 = Level::create([
        'learning_path_id' => $path->id,
        'number' => 1,
        'title' => 'Level 1',
        'estimated_minutes' => 60,
        'difficulty' => 'beginner',
    ]);

    Level::create([
        'learning_path_id' => $path->id,
        'number' => 2,
        'title' => 'Level 2',
        'estimated_minutes' => 60,
        'difficulty' => 'beginner',
    ]);

    $enrollment = app(EnrollIntern::class)->execute($intern, $path);

    $progress = $enrollment->levelProgress()->with('level')->get();

    expect($progress->firstWhere('level_id', $level1->id)->status)->toBe(ProgressStatus::Available)
        ->and($progress->where('status', ProgressStatus::Locked)->count())->toBe(1);
});
