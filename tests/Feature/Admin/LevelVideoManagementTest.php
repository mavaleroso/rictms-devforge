<?php

use App\Enums\VideoProvider;
use App\Models\LearningPath;
use App\Models\Level;
use App\Models\Video;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

function createAdminLevelVideoContext(): array
{
    $path = LearningPath::create([
        'name' => 'Video Path',
        'slug' => 'video-path',
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

test('admin can add a youtube video to a level', function () {
    ['path' => $path, 'level' => $level] = createAdminLevelVideoContext();
    $admin = userWithRole('admin');

    $this->actingAs($admin)
        ->post(route('admin.videos.store', [$path, $level]), [
            'title' => 'Intro walkthrough',
            'provider' => VideoProvider::Youtube->value,
            'url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            'sort_order' => 1,
        ])
        ->assertRedirect();

    $video = Video::first();

    expect($video)->not->toBeNull()
        ->and($video->title)->toBe('Intro walkthrough')
        ->and($video->provider)->toBe(VideoProvider::Youtube)
        ->and($video->url)->toBe('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
        ->and($video->file_path)->toBeNull();
});

test('admin can upload a video file to a level', function () {
    Storage::fake('public');

    ['path' => $path, 'level' => $level] = createAdminLevelVideoContext();
    $admin = userWithRole('admin');
    $file = UploadedFile::fake()->create('lesson.mp4', 1024, 'video/mp4');

    $this->actingAs($admin)
        ->post(route('admin.videos.store', [$path, $level]), [
            'title' => 'Recorded lesson',
            'provider' => VideoProvider::Upload->value,
            'file' => $file,
            'sort_order' => 1,
        ])
        ->assertRedirect();

    $video = Video::first();

    expect($video)->not->toBeNull()
        ->and($video->title)->toBe('Recorded lesson')
        ->and($video->provider)->toBe(VideoProvider::Upload)
        ->and($video->url)->toBeNull()
        ->and($video->file_path)->not->toBeNull();

    Storage::disk('public')->assertExists($video->file_path);
});

test('upload provider requires a video file', function () {
    ['path' => $path, 'level' => $level] = createAdminLevelVideoContext();
    $admin = userWithRole('admin');

    $this->actingAs($admin)
        ->post(route('admin.videos.store', [$path, $level]), [
            'title' => 'Missing file',
            'provider' => VideoProvider::Upload->value,
            'sort_order' => 1,
        ])
        ->assertSessionHasErrors('file');
});

test('deleting an uploaded video removes the stored file', function () {
    Storage::fake('public');

    ['path' => $path, 'level' => $level] = createAdminLevelVideoContext();
    $admin = userWithRole('admin');
    $file = UploadedFile::fake()->create('lesson.mp4', 1024, 'video/mp4');

    $this->actingAs($admin)
        ->post(route('admin.videos.store', [$path, $level]), [
            'title' => 'Recorded lesson',
            'provider' => VideoProvider::Upload->value,
            'file' => $file,
            'sort_order' => 1,
        ]);

    $video = Video::first();
    $storedPath = $video->file_path;

    Storage::disk('public')->assertExists($storedPath);

    $this->actingAs($admin)
        ->delete(route('admin.videos.destroy', $video))
        ->assertRedirect();

    Storage::disk('public')->assertMissing($storedPath);
    expect(Video::count())->toBe(0);
});
