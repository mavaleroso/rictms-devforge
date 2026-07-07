<?php

namespace App\Services\Learning;

use App\Models\Enrollment;
use App\Models\LearningMaterial;
use App\Models\LearningPath;
use App\Models\Level;
use App\Models\Quiz;
use App\Models\User;
use App\Models\Video;
use App\Repositories\Contracts\ContentCompletionRepository;
use App\Repositories\Contracts\EnrollmentRepository;
use App\Repositories\Contracts\LearningPathRepository;
use App\Repositories\Contracts\LevelProgressRepository;
use App\Repositories\Contracts\LevelRepository;
use App\Repositories\Contracts\QuizAttemptRepository;
use App\Repositories\Contracts\QuizRepository;

final class LearnPresentationService
{
    public function __construct(
        private readonly LearningPathRepository $paths,
        private readonly EnrollmentRepository $enrollments,
        private readonly LevelRepository $levels,
        private readonly LevelProgressRepository $levelProgress,
        private readonly ContentCompletionRepository $completions,
        private readonly QuizAttemptRepository $quizAttempts,
        private readonly QuizRepository $quizzes,
    ) {}

    public function pathWithProgress(LearningPath $path, User $user): LearningPath
    {
        $enrollment = $this->enrollments->findForUserAndPath($user, $path);
        $path = $this->paths->loadWithOrderedLevels($path);

        $levels = $path->levels->map(function (Level $level) use ($enrollment) {
            $progress = $enrollment?->levelProgress->firstWhere('level_id', $level->id);
            $level->progress_status = $progress?->status?->value ?? 'locked';

            return $level;
        });

        $path->setRelation('levels', $levels);

        return $path;
    }

    public function enrollmentForPath(User $user, LearningPath $path): ?Enrollment
    {
        return $this->enrollments->findForUserAndPath($user, $path);
    }

    public function levelForPlayer(LearningPath $path, Level $level, User $user): Level
    {
        $level = $this->levels->loadWithContent($level);

        $grouped = $this->completions->completedIdsGroupedByType($user->id);
        $materialCompletions = $grouped->get((new LearningMaterial)->getMorphClass(), collect());
        $videoCompletions = $grouped->get((new Video)->getMorphClass(), collect());

        $level->materials->each(fn ($m) => $m->completed = $materialCompletions->contains($m->id));
        $level->videos->each(fn ($v) => $v->completed = $videoCompletions->contains($v->id));

        if ($level->quiz) {
            $stats = $this->quizAttempts->statsForUserAndQuiz($user->id, $level->quiz->id);
            $level->quiz->attempts_used = $stats['attempts_used'];
            $level->quiz->best_score = $stats['best_score'];
            $level->quiz->passed = $stats['passed'];
        }

        $enrollment = $this->enrollments->findForUserAndPath($user, $path);
        $progress = $enrollment
            ? $this->levelProgress->findForEnrollmentAndLevel($enrollment, $level)
            : null;
        $level->progress_status = $progress?->status?->value;

        return $level;
    }

    public function quizForPlayer(Quiz $quiz, User $user): Quiz
    {
        $quiz = $this->quizzes->loadWithQuestionsAndOptions($quiz);
        $stats = $this->quizAttempts->statsForUserAndQuiz($user->id, $quiz->id);
        $quiz->attempts_used = $stats['attempts_used'];
        $quiz->best_score = $stats['best_score'];
        $quiz->passed = $stats['passed'];

        return $quiz;
    }
}
