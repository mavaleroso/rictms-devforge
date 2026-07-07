<?php

use App\Enums\EnrollmentStatus;
use App\Models\Enrollment;
use App\Models\LearningPath;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('admin can view learning paths index', function () {
    $admin = userWithRole('admin');

    $this->actingAs($admin)
        ->get(route('admin.paths.index'))
        ->assertOk();
});

test('intern cannot access admin learning paths', function () {
    $intern = userWithRole('intern');

    $this->actingAs($intern)
        ->get(route('admin.paths.index'))
        ->assertForbidden();
});

test('admin can create a learning path', function () {
    $admin = userWithRole('admin');

    $this->actingAs($admin)
        ->post(route('admin.paths.store'), [
            'name' => 'Test Path',
            'description' => 'A test learning path',
            'is_active' => true,
        ])
        ->assertRedirect();

    expect(LearningPath::where('name', 'Test Path')->exists())->toBeTrue();
});

test('admin can create a learning path with cover image', function () {
    Storage::fake('public');

    $admin = userWithRole('admin');
    $cover = UploadedFile::fake()->image('cover.jpg', 1280, 720);

    $this->actingAs($admin)
        ->post(route('admin.paths.store'), [
            'name' => 'Path With Cover',
            'description' => 'Has a cover image',
            'is_active' => true,
            'cover_image' => $cover,
        ])
        ->assertRedirect();

    $path = LearningPath::where('name', 'Path With Cover')->first();

    expect($path)->not->toBeNull()
        ->and($path->cover_image)->not->toBeNull();

    Storage::disk('public')->assertExists($path->cover_image);
});

test('admin can update a learning path cover image via post method spoofing', function () {
    Storage::fake('public');

    $admin = userWithRole('admin');
    $path = LearningPath::create([
        'name' => 'Spoof Path',
        'slug' => 'spoof-path',
        'description' => 'Test path',
        'icon' => 'code-bracket',
        'is_active' => true,
        'sort_order' => 0,
    ]);
    $cover = UploadedFile::fake()->image('browser-cover.jpg', 1280, 720);

    $this->actingAs($admin)
        ->post(route('admin.paths.update', $path), [
            '_method' => 'patch',
            'name' => $path->name,
            'slug' => $path->slug,
            'description' => $path->description,
            'icon' => $path->icon,
            'is_active' => true,
            'sort_order' => 0,
            'cover_image' => $cover,
            'remove_cover' => false,
        ])
        ->assertRedirect(route('admin.paths.edit', $path));

    $path->refresh();

    expect($path->cover_image)->not->toBeNull();
    Storage::disk('public')->assertExists($path->cover_image);
});

test('admin can update a learning path cover image', function () {
    Storage::fake('public');

    $admin = userWithRole('admin');
    $path = LearningPath::create([
        'name' => 'Existing Path',
        'slug' => 'existing-path',
        'description' => 'Test path',
        'icon' => 'code-bracket',
        'is_active' => true,
        'sort_order' => 0,
    ]);
    $cover = UploadedFile::fake()->image('new-cover.jpg', 1280, 720);

    $this->actingAs($admin)
        ->patch(route('admin.paths.update', $path), [
            'name' => $path->name,
            'slug' => $path->slug,
            'description' => $path->description,
            'icon' => $path->icon,
            'is_active' => true,
            'sort_order' => 0,
            'cover_image' => $cover,
            'remove_cover' => false,
        ])
        ->assertRedirect(route('admin.paths.edit', $path));

    $path->refresh();

    expect($path->cover_image)->not->toBeNull();
    Storage::disk('public')->assertExists($path->cover_image);
});

test('path edit page includes enrollment count', function () {
    $admin = userWithRole('admin');
    $intern = userWithRole('intern');

    $path = LearningPath::create([
        'name' => 'Enrolled Path',
        'slug' => 'enrolled-path',
        'is_active' => true,
    ]);

    Enrollment::create([
        'user_id' => $intern->id,
        'learning_path_id' => $path->id,
        'status' => EnrollmentStatus::Active,
        'started_at' => now(),
    ]);

    $this->actingAs($admin)
        ->get(route('admin.paths.edit', $path))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/paths/edit')
            ->where('path.data.enrollments_count', 1));
});
