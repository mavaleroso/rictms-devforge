<?php

namespace App\Repositories\Eloquent;

use App\Models\QuizAttempt;
use App\Repositories\Contracts\QuizAttemptRepository;

final class EloquentQuizAttemptRepository implements QuizAttemptRepository
{
    public function countForUserAndQuiz(int $userId, int $quizId): int
    {
        return QuizAttempt::query()
            ->where('user_id', $userId)
            ->where('quiz_id', $quizId)
            ->count();
    }

    public function hasPassed(int $userId, int $quizId): bool
    {
        return QuizAttempt::query()
            ->where('user_id', $userId)
            ->where('quiz_id', $quizId)
            ->where('passed', true)
            ->exists();
    }

    public function statsForUserAndQuiz(int $userId, int $quizId): array
    {
        $query = QuizAttempt::query()
            ->where('user_id', $userId)
            ->where('quiz_id', $quizId);

        return [
            'attempts_used' => $query->count(),
            'best_score' => (int) ($query->max('score') ?? 0),
            'passed' => (clone $query)->where('passed', true)->exists(),
        ];
    }

    public function create(array $attributes): QuizAttempt
    {
        return QuizAttempt::create($attributes);
    }

    public function updateScore(QuizAttempt $attempt, int $score, bool $passed): QuizAttempt
    {
        $attempt->update([
            'score' => $score,
            'passed' => $passed,
        ]);

        return $attempt->fresh(['answers']);
    }

    public function bestScoreForUser(int $userId): int
    {
        return (int) (QuizAttempt::query()
            ->where('user_id', $userId)
            ->max('score') ?? 0);
    }
}
