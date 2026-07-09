<?php

namespace App\Services\Learning;

use App\Enums\ProgressStatus;
use App\Enums\SubmissionStatus;
use App\Models\LearningMaterial;
use App\Models\User;
use App\Models\Video;
use App\Repositories\Contracts\CapstoneProjectRepository;
use App\Repositories\Contracts\ChallengeSubmissionRepository;
use App\Repositories\Contracts\ContentCompletionRepository;
use App\Repositories\Contracts\EnrollmentRepository;
use App\Repositories\Contracts\GamificationProfileRepository;
use App\Repositories\Contracts\QuizAttemptRepository;
use App\Services\Capstone\CapstoneAccessService;

final class RecommendationService
{
    public function __construct(
        private readonly EnrollmentRepository $enrollments,
        private readonly ContentCompletionRepository $completions,
        private readonly QuizAttemptRepository $quizAttempts,
        private readonly ChallengeSubmissionRepository $challengeSubmissions,
        private readonly CapstoneProjectRepository $capstoneProjects,
        private readonly CapstoneAccessService $capstoneAccess,
        private readonly GamificationProfileRepository $gamification,
    ) {}

    /** @return list<array{type: string, title: string, reason: string, href: string, priority: int}> */
    public function forUser(User $user, int $limit = 3): array
    {
        $enrollment = $this->enrollments->findActiveForUser($user);

        if (! $enrollment) {
            return [];
        }

        $enrollment->load(['learningPath.levels', 'levelProgress.level']);
        $recommendations = [];

        $currentLevel = $enrollment->currentLevel();

        if ($currentLevel) {
            $recommendations = array_merge($recommendations, $this->levelTaskRecommendations($user, $enrollment, $currentLevel));
        }

        $recommendations = array_merge($recommendations, $this->streakRecommendation($user));
        $recommendations = array_merge($recommendations, $this->capstoneRecommendation($user, $enrollment));

        usort($recommendations, fn ($a, $b) => $a['priority'] <=> $b['priority']);

        return array_slice(array_values($recommendations), 0, $limit);
    }

    /** @return list<array{type: string, title: string, reason: string, href: string, priority: int}> */
    private function levelTaskRecommendations(User $user, $enrollment, $level): array
    {
        $items = [];
        $path = $enrollment->learningPath;
        $grouped = $this->completions->completedIdsGroupedByType($user->id);
        $materialDone = $grouped->get((new LearningMaterial)->getMorphClass(), collect());
        $videoDone = $grouped->get((new Video)->getMorphClass(), collect());

        $level->loadMissing(['materials', 'videos', 'quiz', 'codingChallenges']);

        foreach ($level->materials as $material) {
            if (! $materialDone->contains($material->id)) {
                $items[] = [
                    'type' => 'material',
                    'title' => $material->title,
                    'reason' => "Continue Level {$level->number} — reading",
                    'href' => route('learn.materials.show', $material->id),
                    'priority' => 1,
                ];
                break;
            }
        }

        foreach ($level->videos as $video) {
            if (! $videoDone->contains($video->id)) {
                $items[] = [
                    'type' => 'video',
                    'title' => $video->title,
                    'reason' => "Continue Level {$level->number} — video lesson",
                    'href' => route('learn.videos.show', $video->id),
                    'priority' => 2,
                ];
                break;
            }
        }

        if ($level->quiz && ! $this->quizAttempts->hasPassed($user->id, $level->quiz->id)) {
            $items[] = [
                'type' => 'quiz',
                'title' => $level->quiz->title,
                'reason' => 'Quiz not passed yet',
                'href' => route('learn.quizzes.show', $level->quiz->id),
                'priority' => 3,
            ];
        }

        foreach ($level->codingChallenges as $challenge) {
            if (! $challenge->is_active || $this->challengeSubmissions->hasPassed($user->id, $challenge->id)) {
                continue;
            }

            $latestStatus = $this->challengeSubmissions->statsForUserAndChallenge($user->id, $challenge->id)['status'];
            $reason = $latestStatus === SubmissionStatus::Failed->value
                ? 'Retry coding challenge — last attempt failed'
                : 'Complete the coding challenge';

            $items[] = [
                'type' => 'challenge',
                'title' => $challenge->title,
                'reason' => $reason,
                'href' => route('learn.challenges.show', $challenge->id),
                'priority' => $latestStatus === SubmissionStatus::Failed->value ? 2 : 4,
            ];
            break;
        }

        $progress = $enrollment->levelProgress->firstWhere('level_id', $level->id);

        if ($progress && in_array($progress->status, [ProgressStatus::Available, ProgressStatus::InProgress], true)) {
            $items[] = [
                'type' => 'level',
                'title' => "Level {$level->number}: {$level->title}",
                'reason' => 'Your current level overview',
                'href' => route('learn.levels.show', [$path->id, $level->id]),
                'priority' => 5,
            ];
        }

        return $items;
    }

    /** @return list<array{type: string, title: string, reason: string, href: string, priority: int}> */
    private function streakRecommendation(User $user): array
    {
        $profile = $this->gamification->findForUser($user);

        if (! $profile || $profile->current_streak < 2) {
            return [];
        }

        $lastActivity = $profile->last_activity_date;

        if ($lastActivity && $lastActivity->isToday()) {
            return [];
        }

        return [[
            'type' => 'streak',
            'title' => 'Keep your streak alive',
            'reason' => "{$profile->current_streak}-day streak — complete one task today",
            'href' => route('learn.paths.index'),
            'priority' => 6,
        ]];
    }

    /** @return list<array{type: string, title: string, reason: string, href: string, priority: int}> */
    private function capstoneRecommendation(User $user, $enrollment): array
    {
        if (! $this->capstoneAccess->canAccess($user)) {
            return [];
        }

        $project = $this->capstoneProjects->findForEnrollment($enrollment);

        if ($project) {
            return [];
        }

        return [[
            'type' => 'capstone',
            'title' => 'Start your capstone project',
            'reason' => 'Level 20 unlocked — begin your portfolio build',
            'href' => route('learn.capstone.show'),
            'priority' => 7,
        ]];
    }
}
