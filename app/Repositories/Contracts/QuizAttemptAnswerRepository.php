<?php

namespace App\Repositories\Contracts;

use App\Models\QuizAttempt;
use App\Models\QuizAttemptAnswer;
use App\Models\QuizQuestion;

interface QuizAttemptAnswerRepository
{
    public function create(QuizAttempt $attempt, QuizQuestion $question, string $answer, bool $isCorrect, int $points): QuizAttemptAnswer;
}
