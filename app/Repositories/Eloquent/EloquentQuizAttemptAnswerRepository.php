<?php

namespace App\Repositories\Eloquent;

use App\Models\QuizAttempt;
use App\Models\QuizAttemptAnswer;
use App\Models\QuizQuestion;
use App\Repositories\Contracts\QuizAttemptAnswerRepository;

final class EloquentQuizAttemptAnswerRepository implements QuizAttemptAnswerRepository
{
    public function create(QuizAttempt $attempt, QuizQuestion $question, string $answer, bool $isCorrect, int $points): QuizAttemptAnswer
    {
        return QuizAttemptAnswer::create([
            'quiz_attempt_id' => $attempt->id,
            'quiz_question_id' => $question->id,
            'answer' => $answer,
            'is_correct' => $isCorrect,
            'points_awarded' => $points,
        ]);
    }
}
