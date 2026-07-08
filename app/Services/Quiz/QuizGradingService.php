<?php

namespace App\Services\Quiz;

use App\Enums\QuestionType;
use App\Models\Quiz;
use App\Models\QuizAttempt;
use App\Models\QuizQuestion;
use App\Models\User;
use App\Repositories\Contracts\EnrollmentRepository;
use App\Repositories\Contracts\LevelProgressRepository;
use App\Repositories\Contracts\QuizAttemptAnswerRepository;
use App\Repositories\Contracts\QuizAttemptRepository;
use App\Repositories\Contracts\QuizRepository;
use App\Services\Gamification\GamificationService;
use App\Enums\XpSourceType;
use App\Library\Gamification\XpRules;
use App\Services\Learning\ProgressEngine;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

final class QuizGradingService
{
    public function __construct(
        private readonly QuizAttemptRepository $attempts,
        private readonly QuizAttemptAnswerRepository $answers,
        private readonly QuizRepository $quizzes,
        private readonly EnrollmentRepository $enrollments,
        private readonly LevelProgressRepository $levelProgress,
        private readonly ProgressEngine $progressEngine,
        private readonly GamificationService $gamification,
    ) {}

    /**
     * @param  array<int, string>  $answers
     */
    public function grade(User $user, Quiz $quiz, array $answers): QuizAttempt
    {
        $attemptCount = $this->attempts->countForUserAndQuiz($user->id, $quiz->id);

        if ($attemptCount >= $quiz->max_attempts) {
            throw ValidationException::withMessages([
                'quiz' => 'You have used all allowed attempts for this quiz.',
            ]);
        }

        $questions = $this->quizzes->questionsWithOptions($quiz);
        $totalPoints = $questions->sum('points');
        $earnedPoints = 0;

        return DB::transaction(function () use ($user, $quiz, $answers, $questions, $totalPoints, &$earnedPoints, $attemptCount) {
            $attempt = $this->attempts->create([
                'user_id' => $user->id,
                'quiz_id' => $quiz->id,
                'attempt_number' => $attemptCount + 1,
                'score' => 0,
                'passed' => false,
            ]);

            foreach ($questions as $question) {
                $answer = $answers[$question->id] ?? '';
                $isCorrect = $this->gradeQuestion($question, $answer);
                $points = $isCorrect ? $question->points : 0;
                $earnedPoints += $points;

                $this->answers->create($attempt, $question, $answer, $isCorrect, $points);
            }

            $score = $totalPoints > 0 ? (int) round(($earnedPoints / $totalPoints) * 100) : 0;
            $passed = $score >= $quiz->passing_score;

            $attempt = $this->attempts->updateScore($attempt, $score, $passed);

            if ($passed) {
                $level = $quiz->level;
                $enrollment = $this->enrollments->findActiveForUserAndPath($user, $level->learning_path_id);

                if ($enrollment) {
                    $progress = $this->levelProgress->findForEnrollmentAndLevel($enrollment, $level);

                    if ($progress) {
                        $this->levelProgress->markInProgress($progress);
                    }

                    $this->progressEngine->evaluate($enrollment, $level);
                }

                $this->gamification->awardXp(
                    $user,
                    XpSourceType::QuizPass,
                    $quiz->id,
                    XpRules::quiz($score, $attemptCount + 1),
                    'Quiz passed',
                    ['score' => $score, 'attempt' => $attemptCount + 1],
                );
            }

            return $attempt;
        });
    }

    private function gradeQuestion(QuizQuestion $question, string $answer): bool
    {
        return match ($question->type) {
            QuestionType::MultipleChoice => $question->options
                ->firstWhere('id', (int) $answer)?->is_correct ?? false,
            QuestionType::TrueFalse, QuestionType::Identification => strcasecmp(
                trim($answer),
                trim((string) $question->correct_answer)
            ) === 0,
            QuestionType::Essay => false,
        };
    }
}
