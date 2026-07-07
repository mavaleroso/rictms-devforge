<?php

namespace App\Repositories\Eloquent;

use App\Models\Level;
use App\Models\Quiz;
use App\Repositories\Contracts\QuizRepository;
use Illuminate\Support\Collection;

final class EloquentQuizRepository implements QuizRepository
{
    public function loadWithQuestionsAndOptions(Quiz $quiz): Quiz
    {
        return $quiz->load(['questions.options', 'level.learningPath']);
    }

    public function questionsWithOptions(Quiz $quiz): Collection
    {
        return $quiz->questions()->with('options')->get();
    }

    public function updateOrCreateForLevel(Level $level, array $attributes): Quiz
    {
        return $level->quiz()->updateOrCreate(
            ['level_id' => $level->id],
            $attributes,
        );
    }
}
