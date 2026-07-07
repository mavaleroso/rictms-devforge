<?php

namespace App\Repositories\Contracts;

use App\Models\QuizAttempt;

interface QuizAttemptRepository
{
    public function countForUserAndQuiz(int $userId, int $quizId): int;

    public function hasPassed(int $userId, int $quizId): bool;

    /** @return array{attempts_used: int, best_score: int, passed: bool} */
    public function statsForUserAndQuiz(int $userId, int $quizId): array;

    public function create(array $attributes): QuizAttempt;

    public function updateScore(QuizAttempt $attempt, int $score, bool $passed): QuizAttempt;
}
