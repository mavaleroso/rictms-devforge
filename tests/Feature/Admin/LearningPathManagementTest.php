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

test('admin can delete a learning path and all related data', function () {
    Storage::fake('public');
    Storage::fake('local');

    $admin = userWithRole('admin');
    $intern = userWithRole('intern');

    $path = LearningPath::create([
        'name' => 'Delete Me Path',
        'slug' => 'delete-me-path',
        'description' => 'To be removed',
        'is_active' => true,
    ]);

    $cover = UploadedFile::fake()->image('cover.jpg');
    $path->update(['cover_image' => $cover->store('learning-paths/covers', 'public')]);

    $level = \App\Models\Level::create([
        'learning_path_id' => $path->id,
        'number' => 1,
        'title' => 'Level 1',
        'estimated_minutes' => 30,
        'difficulty' => 'beginner',
    ]);

    $videoFile = UploadedFile::fake()->create('lesson.mp4', 100, 'video/mp4');
    $videoPath = $videoFile->store("learning-paths/{$path->id}/levels/{$level->id}/videos", 'public');

    $video = \App\Models\Video::create([
        'level_id' => $level->id,
        'title' => 'Lesson',
        'provider' => \App\Enums\VideoProvider::Upload,
        'file_path' => $videoPath,
    ]);

    $enrollment = Enrollment::create([
        'user_id' => $intern->id,
        'learning_path_id' => $path->id,
        'status' => EnrollmentStatus::Active,
        'started_at' => now(),
    ]);

    $certificate = \App\Models\Certificate::create([
        'enrollment_id' => $enrollment->id,
        'user_id' => $intern->id,
        'learning_path_id' => $path->id,
        'certificate_number' => 'DF-TEST-001',
        'verification_code' => 'verify-code-123',
        'issued_at' => now(),
        'pdf_path' => 'certificates/DF-TEST-001.pdf',
    ]);

    Storage::disk('local')->put($certificate->pdf_path, 'pdf-content');

    $this->actingAs($admin)
        ->delete(route('admin.paths.destroy', $path))
        ->assertRedirect(route('admin.paths.index'));

    expect(LearningPath::count())->toBe(0)
        ->and(\App\Models\Level::count())->toBe(0)
        ->and(\App\Models\Video::count())->toBe(0)
        ->and(Enrollment::count())->toBe(0)
        ->and(\App\Models\Certificate::count())->toBe(0);

    Storage::disk('public')->assertMissing($path->cover_image);
    Storage::disk('public')->assertMissing($videoPath);
    Storage::disk('local')->assertMissing($certificate->pdf_path);
});

test('intern cannot delete a learning path', function () {
    $intern = userWithRole('intern');
    $path = LearningPath::create([
        'name' => 'Protected Path',
        'slug' => 'protected-path',
        'is_active' => true,
    ]);

    $this->actingAs($intern)
        ->delete(route('admin.paths.destroy', $path))
        ->assertForbidden();

    expect(LearningPath::count())->toBe(1);
});
