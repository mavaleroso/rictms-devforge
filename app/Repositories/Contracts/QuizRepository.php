<?php

namespace App\Repositories\Contracts;

use App\Models\Level;
use App\Models\Quiz;
use App\Models\QuizQuestion;
use Illuminate\Support\Collection;

interface QuizRepository
{
    public function loadWithQuestionsAndOptions(Quiz $quiz): Quiz;

    /** @return Collection<int, QuizQuestion> */
    public function questionsWithOptions(Quiz $quiz): Collection;

    public function updateOrCreateForLevel(Level $level, array $attributes): Quiz;
}
