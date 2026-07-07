<?php

namespace App\Services\Admin;

use App\Models\LearningPath;
use App\Models\Level;
use App\Repositories\Contracts\LevelRepository;
use App\Repositories\Contracts\QuizRepository;

final class LevelService
{
    public function __construct(
        private readonly LevelRepository $levels,
        private readonly QuizRepository $quizzes,
    ) {}

    public function createForPath(LearningPath $path, array $attributes): Level
    {
        if (! isset($attributes['number'])) {
            $attributes['number'] = ((int) $path->levels()->max('number')) + 1;
        }

        $attributes['sort_order'] = $attributes['sort_order'] ?? $attributes['number'];

        $level = $path->levels()->create($attributes);

        $this->quizzes->updateOrCreateForLevel($level, [
            'title' => "Level {$level->number} Quiz",
            'passing_score' => 80,
            'max_attempts' => 3,
        ]);

        return $level;
    }
}
