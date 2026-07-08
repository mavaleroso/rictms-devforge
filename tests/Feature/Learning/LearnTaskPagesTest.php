<?php

use App\Enums\MaterialType;
use App\Enums\VideoProvider;
use App\Models\Enrollment;
use App\Models\LearningMaterial;
use App\Models\LearningPath;
use App\Models\Level;
use App\Models\LevelProgress;
use App\Models\Video;

test('intern can view material and video task pages', function () {
    $intern = userWithRole('intern');
    $path = LearningPath::create(['name' => 'Task Path', 'slug' => 'task-path', 'is_active' => true]);
    $level = Level::create([
        'learning_path_id' => $path->id,
        'number' => 1,
        'title' => 'L1',
        'estimated_minutes' => 30,
        'difficulty' => 'beginner',
    ]);

    $material = LearningMaterial::create([
        'level_id' => $level->id,
        'type' => MaterialType::Markdown,
        'title' => 'Lesson 1',
        'content' => 'Hello',
        'sort_order' => 1,
    ]);

    $video = Video::create([
        'level_id' => $level->id,
        'title' => 'Walkthrough',
        'provider' => VideoProvider::Youtube,
        'url' => 'https://www.youtube.com/embed/test',
        'sort_order' => 1,
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
        'status' => 'in_progress',
    ]);

    $this->actingAs($intern)
        ->get(route('learn.materials.show', $material))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('learn/materials/show')
            ->where('currentTask', 'material-'.$material->id)
        );

    $this->actingAs($intern)
        ->get(route('learn.videos.show', $video))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('learn/videos/show')
            ->where('currentTask', 'video-'.$video->id)
        );
});

test('level overview includes continue link to first incomplete task', function () {
    $intern = userWithRole('intern');
    $path = LearningPath::create(['name' => 'Overview Path', 'slug' => 'overview-path', 'is_active' => true]);
    $level = Level::create([
        'learning_path_id' => $path->id,
        'number' => 1,
        'title' => 'L1',
        'estimated_minutes' => 30,
        'difficulty' => 'beginner',
    ]);

    $material = LearningMaterial::create([
        'level_id' => $level->id,
        'type' => MaterialType::Markdown,
        'title' => 'First lesson',
        'content' => 'Content',
        'sort_order' => 1,
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
        'status' => 'in_progress',
    ]);

    $this->actingAs($intern)
        ->get(route('learn.levels.show', [$path, $level]))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('learn/levels/show')
            ->where('currentTask', 'overview')
            ->where('continueHref', route('learn.materials.show', $material))
        );
});
