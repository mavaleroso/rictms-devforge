<?php

use App\Actions\Learning\EnrollIntern;
use App\Models\LearningPath;
use App\Models\Level;
use App\Models\User;

test('admin can view enrollments index with stats', function () {
    $admin = userWithRole('admin');
    userWithRole('intern');
    userWithRole('mentor');

    $this->actingAs($admin)
        ->get(route('admin.enrollments.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/enrollments/index')
            ->has('stats', fn ($stats) => $stats
                ->where('total', 0)
                ->where('active', 0)
                ->where('completed', 0)
                ->where('with_mentor', 0)
            )
            ->has('interns')
            ->has('mentors')
            ->has('paths')
        );
});

test('admin can fetch paginated enrollments table data', function () {
    $admin = userWithRole('admin');
    $intern = userWithRole('intern');
    $mentor = userWithRole('mentor');

    $path = LearningPath::create([
        'name' => 'Table Test Path',
        'slug' => 'table-test-path',
        'is_active' => true,
    ]);

    Level::create([
        'learning_path_id' => $path->id,
        'number' => 1,
        'title' => 'Level 1',
        'estimated_minutes' => 60,
        'difficulty' => 'beginner',
    ]);

    app(EnrollIntern::class)->execute($intern, $path, $mentor);

    $this->actingAs($admin)
        ->getJson(route('admin.enrollments.table', ['page' => 1, 'per_page' => 10]))
        ->assertOk()
        ->assertJsonStructure([
            'data' => [['id', 'status', 'progress_percentage', 'user', 'learning_path']],
            'meta' => ['current_page', 'last_page', 'per_page', 'total'],
        ])
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('meta.total', 1)
        ->assertJsonPath('data.0.user.email', $intern->email);
});

test('admin can enroll an intern from the admin panel', function () {
    $admin = userWithRole('admin');
    $intern = userWithRole('intern');
    $mentor = userWithRole('mentor');

    $path = LearningPath::create([
        'name' => 'Admin Enroll Path',
        'slug' => 'admin-enroll-path',
        'is_active' => true,
    ]);

    Level::create([
        'learning_path_id' => $path->id,
        'number' => 1,
        'title' => 'Level 1',
        'estimated_minutes' => 60,
        'difficulty' => 'beginner',
    ]);

    $this->actingAs($admin)
        ->post(route('admin.enrollments.store'), [
            'user_id' => $intern->id,
            'learning_path_id' => $path->id,
            'mentor_id' => $mentor->id,
        ])
        ->assertRedirect(route('admin.enrollments.index'));

    expect($intern->enrollments()->where('learning_path_id', $path->id)->exists())->toBeTrue();
});
