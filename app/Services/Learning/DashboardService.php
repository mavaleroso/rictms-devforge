<?php

namespace App\Services\Learning;

use App\Enums\EnrollmentStatus;
use App\Http\Resources\EnrollmentResource;
use App\Models\User;
use App\Repositories\Contracts\CapstoneProjectRepository;
use App\Repositories\Contracts\ChallengeSubmissionRepository;
use App\Repositories\Contracts\EnrollmentRepository;
use App\Repositories\Contracts\LearningPathRepository;
use App\Repositories\Contracts\UserRepository;
use App\Services\Gamification\GamificationService;

final class DashboardService
{
    public function __construct(
        private readonly UserRepository $users,
        private readonly EnrollmentRepository $enrollments,
        private readonly LearningPathRepository $paths,
        private readonly ChallengeSubmissionRepository $challengeSubmissions,
        private readonly CapstoneProjectRepository $capstoneProjects,
        private readonly GamificationService $gamification,
        private readonly RecommendationService $recommendations,
    ) {}

    /** @return array<string, mixed> */
    public function adminStats(): array
    {
        return [
            'total_users' => $this->users->countByRole(['admin', 'mentor', 'intern']),
            'interns' => $this->users->countByRole('intern'),
            'mentors' => $this->users->countByRole('mentor'),
            'active_enrollments' => $this->enrollments->countByStatus(EnrollmentStatus::Active),
            'completed_enrollments' => $this->enrollments->countByStatus(EnrollmentStatus::Completed),
            'learning_paths' => $this->paths->activeCount(),
        ];
    }

    /** @return array<string, mixed> */
    public function mentorData(User $mentor): array
    {
        $assigned = $this->enrollments->forMentor($mentor->id);

        return [
            'role' => 'mentor',
            'mentor_stats' => [
                'assigned' => $assigned->count(),
                'in_progress' => $assigned->where('status', EnrollmentStatus::Active)->count(),
                'completed' => $assigned->where('status', EnrollmentStatus::Completed)->count(),
            ],
            'assigned_interns' => EnrollmentResource::collection($assigned),
            'pending_reviews' => $this->challengeSubmissions->countPendingReviewsForMentor($mentor->id),
            'pending_capstone_reviews' => $this->capstoneProjects->countPendingReviewsForMentor($mentor->id),
        ];
    }

    /** @return array<string, mixed> */
    public function internData(User $intern): array
    {
        $enrollment = $this->enrollments->findActiveForUser($intern);

        if ($enrollment) {
            $enrollment->load(['learningPath.levels', 'levelProgress.level']);
        }

        return [
            'role' => 'intern',
            'enrollment' => $enrollment ? new EnrollmentResource($enrollment) : null,
            'available_paths' => $enrollment ? null : $this->paths->activeList(['id', 'name', 'slug', 'description']),
            'gamification' => $this->gamification->profilePayloadFor($intern),
            'recommendations' => $this->recommendations->forUser($intern),
        ];
    }
}
