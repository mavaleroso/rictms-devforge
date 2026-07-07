<?php

namespace App\Repositories\Eloquent;

use App\Models\LearningPath;
use App\Repositories\Contracts\LearningPathRepository;
use Illuminate\Support\Collection;

final class EloquentLearningPathRepository implements LearningPathRepository
{
    public function listWithLevelCount(): Collection
    {
        return LearningPath::withCount(['levels', 'enrollments'])
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();
    }

    public function activeWithLevelCount(): Collection
    {
        return LearningPath::withCount('levels')
            ->withSum('levels as total_estimated_minutes', 'estimated_minutes')
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get();
    }

    public function activeList(array $columns = ['*']): Collection
    {
        return LearningPath::where('is_active', true)->get($columns);
    }

    public function activeCount(): int
    {
        return LearningPath::where('is_active', true)->count();
    }

    public function create(array $attributes): LearningPath
    {
        return LearningPath::create($attributes);
    }

    public function update(LearningPath $path, array $attributes): void
    {
        $path->update($attributes);
    }

    public function loadWithOrderedLevels(LearningPath $path): LearningPath
    {
        $path->loadCount('enrollments');

        return $path->load([
            'levels' => fn ($q) => $q->orderBy('number')
                ->withCount(['materials', 'videos'])
                ->with(['quiz' => fn ($quiz) => $quiz->withCount('questions')]),
        ]);
    }

    public function findById(int $id): LearningPath
    {
        return LearningPath::findOrFail($id);
    }
}
