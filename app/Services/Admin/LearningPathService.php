<?php

namespace App\Services\Admin;

use App\Models\LearningPath;
use App\Repositories\Contracts\LearningPathRepository;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

final class LearningPathService
{
    public function __construct(
        private readonly LearningPathRepository $paths,
    ) {}

    public function create(array $attributes, ?UploadedFile $cover = null): LearningPath
    {
        $attributes['slug'] = Str::slug($attributes['slug'] ?? $attributes['name']);
        unset($attributes['cover_image'], $attributes['remove_cover']);

        $path = $this->paths->create($attributes);

        if ($cover) {
            $this->storeCover($path, $cover);
        }

        return $path;
    }

    public function update(LearningPath $path, array $attributes, ?UploadedFile $cover = null, bool $removeCover = false): void
    {
        if (isset($attributes['slug'])) {
            $attributes['slug'] = Str::slug($attributes['slug']);
        }

        unset($attributes['cover_image'], $attributes['remove_cover']);

        $this->paths->update($path, $attributes);
        $this->syncCover($path, $cover, $removeCover);
    }

    public function syncCover(LearningPath $path, ?UploadedFile $cover = null, bool $remove = false): void
    {
        if ($remove) {
            $this->deleteCover($path);
        }

        if ($cover) {
            $this->deleteCover($path);
            $this->storeCover($path, $cover);
        }
    }

    private function storeCover(LearningPath $path, UploadedFile $cover): void
    {
        $path->update([
            'cover_image' => $cover->store('learning-paths/covers', 'public'),
        ]);
    }

    private function deleteCover(LearningPath $path): void
    {
        if (! $path->cover_image) {
            return;
        }

        Storage::disk('public')->delete($path->cover_image);
        $path->update(['cover_image' => null]);
    }
}
