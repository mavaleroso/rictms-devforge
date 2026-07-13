<?php

namespace App\Services\Gamification;

use App\Enums\EnrollmentStatus;
use App\Enums\ProgressStatus;
use App\Enums\XpSourceType;
use App\Library\Gamification\StreakCalculator;
use App\Library\Gamification\TierRegistry;
use App\Library\Gamification\XpRules;
use App\Enums\CapstoneMilestoneStatus;
use App\Enums\CapstoneProjectStatus;
use App\Models\Badge;
use App\Models\CapstoneProject;
use App\Models\CapstoneProjectMilestone;
use App\Models\ContentCompletion;
use App\Models\Enrollment;
use App\Models\User;
use App\Repositories\Contracts\BadgeRepository;
use App\Repositories\Contracts\ChallengeSubmissionRepository;
use App\Repositories\Contracts\GamificationProfileRepository;
use App\Repositories\Contracts\LevelProgressRepository;
use App\Repositories\Contracts\QuizAttemptRepository;
use App\Repositories\Contracts\XpTransactionRepository;
use Illuminate\Support\Facades\DB;

final class AchievementEvaluator
{
    public function __construct(
        private readonly BadgeRepository $badges,
        private readonly QuizAttemptRepository $quizAttempts,
        private readonly ChallengeSubmissionRepository $challengeSubmissions,
        private readonly LevelProgressRepository $levelProgress,
        private readonly GamificationProfileRepository $profiles,
    ) {}

    /** @return list<Badge> */
    public function evaluate(User $user): array
    {
        $earned = [];

        foreach ($this->candidateSlugs($user) as $slug) {
            if ($this->badges->userHasBadge($user, $slug)) {
                continue;
            }

            if (! $this->qualifies($user, $slug)) {
                continue;
            }

            $badge = $this->badges->findBySlug($slug);

            if ($badge && $this->badges->awardIfNew($user, $badge)) {
                $earned[] = $badge;
            }
        }

        return $earned;
    }

    /** @return list<string> */
    private function candidateSlugs(User $user): array
    {
        $profile = $this->profiles->findForUser($user);

        return array_values(array_filter([
            'first_steps',
            'quiz_ace',
            'code_runner',
            'streak_week',
            'streak_month',
            'level_milestone',
            'path_graduate',
            'capstone_builder',
            'capstone_graduate',
            'xp_builder',
            'dedicated_learner',
            $profile && $profile->total_xp >= 1500 ? 'xp_specialist' : null,
        ]));
    }

    private function qualifies(User $user, string $slug): bool
    {
        return match ($slug) {
            'first_steps' => ContentCompletion::query()->where('user_id', $user->id)->exists(),
            'quiz_ace' => $this->quizAttempts->bestScoreForUser($user->id) >= 100,
            'code_runner' => $this->challengeSubmissions->passedCountForUser($user->id) >= 1,
            'streak_week' => ($this->profiles->findForUser($user)?->current_streak ?? 0) >= 7,
            'streak_month' => ($this->profiles->findForUser($user)?->current_streak ?? 0) >= 30,
            'level_milestone' => $this->completedLevelCount($user) >= 5,
            'path_graduate' => $user->enrollments()->where('status', EnrollmentStatus::Completed)->exists(),
            'capstone_builder' => CapstoneProjectMilestone::query()
                ->where('status', CapstoneMilestoneStatus::Approved)
                ->whereHas('project.enrollment', fn ($q) => $q->where('user_id', $user->id))
                ->exists(),
            'capstone_graduate' => CapstoneProject::query()
                ->where('status', CapstoneProjectStatus::Completed)
                ->whereHas('enrollment', fn ($q) => $q->where('user_id', $user->id))
                ->exists(),
            'xp_builder' => ($this->profiles->findForUser($user)?->total_xp ?? 0) >= 500,
            'xp_specialist' => ($this->profiles->findForUser($user)?->total_xp ?? 0) >= 1500,
            'dedicated_learner' => ContentCompletion::query()->where('user_id', $user->id)->count() >= 10,
            default => false,
        };
    }

    private function completedLevelCount(User $user): int
    {
        return $user->enrollments()
            ->with('levelProgress')
            ->get()
            ->flatMap(fn (Enrollment $enrollment) => $enrollment->levelProgress)
            ->where('status', ProgressStatus::Completed)
            ->count();
    }
}
