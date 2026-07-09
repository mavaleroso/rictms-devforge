<?php

use App\Enums\MaterialType;
use App\Models\LearningMaterial;
use App\Models\LearningMaterialFile;
use App\Models\LearningPath;
use App\Models\Level;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

function createAdminLevelMaterialContext(): array
{
    $path = LearningPath::create([
        'name' => 'Material Path',
        'slug' => 'material-path',
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

test('admin can add a material with rich text content', function () {
    ['path' => $path, 'level' => $level] = createAdminLevelMaterialContext();
    $admin = userWithRole('admin');

    $this->actingAs($admin)
        ->post(route('admin.materials.store', [$path, $level]), [
            'type' => MaterialType::Markdown->value,
            'title' => 'Intro lesson',
            'content' => '<h2>Welcome</h2><p>Read this first.</p>',
            'sort_order' => 1,
        ])
        ->assertRedirect();

    $material = LearningMaterial::first();

    expect($material)->not->toBeNull()
        ->and($material->title)->toBe('Intro lesson')
        ->and($material->content)->toBe('<h2>Welcome</h2><p>Read this first.</p>')
        ->and($material->files)->toHaveCount(0);
});

test('admin can upload multiple resource files with a material', function () {
    Storage::fake('public');

    ['path' => $path, 'level' => $level] = createAdminLevelMaterialContext();
    $admin = userWithRole('admin');
    $guide = UploadedFile::fake()->create('guide.pdf', 512, 'application/pdf');
    $slides = UploadedFile::fake()->create('slides.pptx', 512, 'application/vnd.openxmlformats-officedocument.presentationml.presentation');

    $this->actingAs($admin)
        ->post(route('admin.materials.store', [$path, $level]), [
            'type' => MaterialType::Pdf->value,
            'title' => 'Style guide',
            'content' => '<p>Review the attached files.</p>',
            'files' => [$guide, $slides],
            'sort_order' => 1,
        ])
        ->assertRedirect();

    $material = LearningMaterial::with('files')->first();

    expect($material)->not->toBeNull()
        ->and($material->title)->toBe('Style guide')
        ->and($material->files)->toHaveCount(2)
        ->and($material->files->pluck('original_name')->all())->toBe(['guide.pdf', 'slides.pptx']);

    foreach ($material->files as $file) {
        Storage::disk('public')->assertExists($file->file_path);
    }
});

test('admin can update a material and replace resource files', function () {
    Storage::fake('public');

    ['path' => $path, 'level' => $level] = createAdminLevelMaterialContext();
    $admin = userWithRole('admin');
    $originalFile = UploadedFile::fake()->create('old.pdf', 256, 'application/pdf');

    $this->actingAs($admin)
        ->post(route('admin.materials.store', [$path, $level]), [
            'type' => MaterialType::Pdf->value,
            'title' => 'Original',
            'files' => [$originalFile],
            'sort_order' => 1,
        ]);

    $material = LearningMaterial::with('files')->first();
    $oldFile = $material->files->first();
    $newFile = UploadedFile::fake()->create('new.pdf', 256, 'application/pdf');

    Storage::disk('public')->assertExists($oldFile->file_path);

    $this->actingAs($admin)
        ->post(route('admin.materials.update', $material), [
            '_method' => 'patch',
            'title' => 'Updated guide',
            'content' => '<p>Updated notes.</p>',
            'remove_file_ids' => [$oldFile->id],
            'files' => [$newFile],
        ])
        ->assertRedirect();

    $material->refresh()->load('files');

    expect($material->title)->toBe('Updated guide')
        ->and($material->content)->toBe('<p>Updated notes.</p>')
        ->and($material->files)->toHaveCount(1)
        ->and($material->files->first()->original_name)->toBe('new.pdf');

    Storage::disk('public')->assertMissing($oldFile->file_path);
    Storage::disk('public')->assertExists($material->files->first()->file_path);
    expect(LearningMaterialFile::find($oldFile->id))->toBeNull();
});

test('admin can remove material resource files on update', function () {
    Storage::fake('public');

    ['path' => $path, 'level' => $level] = createAdminLevelMaterialContext();
    $admin = userWithRole('admin');
    $file = UploadedFile::fake()->create('guide.pdf', 256, 'application/pdf');

    $this->actingAs($admin)
        ->post(route('admin.materials.store', [$path, $level]), [
            'type' => MaterialType::Pdf->value,
            'title' => 'Guide',
            'files' => [$file],
            'sort_order' => 1,
        ]);

    $material = LearningMaterial::with('files')->first();
    $storedFile = $material->files->first();

    Storage::disk('public')->assertExists($storedFile->file_path);

    $this->actingAs($admin)
        ->patch(route('admin.materials.update', $material), [
            'remove_file_ids' => [$storedFile->id],
        ])
        ->assertRedirect();

    $material->refresh();

    expect($material->files)->toHaveCount(0);
    Storage::disk('public')->assertMissing($storedFile->file_path);
});

test('deleting a material removes all stored resource files', function () {
    Storage::fake('public');

    ['path' => $path, 'level' => $level] = createAdminLevelMaterialContext();
    $admin = userWithRole('admin');
    $guide = UploadedFile::fake()->create('guide.pdf', 256, 'application/pdf');
    $image = UploadedFile::fake()->image('diagram.png');

    $this->actingAs($admin)
        ->post(route('admin.materials.store', [$path, $level]), [
            'type' => MaterialType::Pdf->value,
            'title' => 'Guide',
            'files' => [$guide, $image],
            'sort_order' => 1,
        ]);

    $material = LearningMaterial::with('files')->first();
    $storedPaths = $material->files->pluck('file_path');

    foreach ($storedPaths as $path) {
        Storage::disk('public')->assertExists($path);
    }

    $this->actingAs($admin)
        ->delete(route('admin.materials.destroy', $material))
        ->assertRedirect();

    foreach ($storedPaths as $path) {
        Storage::disk('public')->assertMissing($path);
    }

    expect(LearningMaterial::count())->toBe(0)
        ->and(LearningMaterialFile::count())->toBe(0);
});
