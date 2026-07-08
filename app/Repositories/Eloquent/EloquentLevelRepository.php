<?php

namespace App\Repositories\Eloquent;

use App\Models\LearningPath;
use App\Models\Level;
use App\Repositories\Contracts\LevelRepository;
use Illuminate\Support\Collection;

final class EloquentLevelRepository implements LevelRepository
{
    public function orderedForPath(LearningPath|int $path): Collection
    {
        $pathId = $path instanceof LearningPath ? $path->id : $path;

        return Level::query()
            ->where('learning_path_id', $pathId)
            ->orderBy('number')
            ->get();
    }

    public function findNext(Level $level): ?Level
    {
        return Level::query()
            ->where('learning_path_id', $level->learning_path_id)
            ->where('number', $level->number + 1)
            ->first();
    }

    public function findByPathAndNumber(int $pathId, int $number): ?Level
    {
        return Level::query()
            ->where('learning_path_id', $pathId)
            ->where('number', $number)
            ->first();
    }

    public function loadWithContent(Level $level): Level
    {
        return $level->load(['materials', 'videos', 'quiz.questions.options', 'codingChallenge.testCases']);
    }

    public function update(Level $level, array $attributes): void
    {
        $level->update($attributes);
    }

    public function materialIds(Level $level): Collection
    {
        return $level->materials()->pluck('id');
    }

    public function videoIds(Level $level): Collection
    {
        return $level->videos()->pluck('id');
    }
}
