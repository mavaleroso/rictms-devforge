<?php

namespace App\Actions\Quiz;

use App\Models\Quiz;
use App\Models\QuizAttempt;
use App\Models\User;
use App\Services\Quiz\QuizGradingService;

final class GradeQuizAttempt
{
    public function __construct(
        private readonly QuizGradingService $quizGradingService,
    ) {}

    /**
     * @param  array<int, string>  $answers  question_id => answer
     */
    public function execute(User $user, Quiz $quiz, array $answers): QuizAttempt
    {
        return $this->quizGradingService->grade($user, $quiz, $answers);
    }
}
