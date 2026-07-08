<?php

namespace App\Http\Controllers\Mentor;

use App\Enums\EnrollmentStatus;
use App\Enums\SubmissionStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\CapstoneProjectResource;
use App\Http\Resources\EnrollmentResource;
use App\Models\ChallengeSubmission;
use App\Models\User;
use App\Repositories\Contracts\CapstoneProjectRepository;
use App\Repositories\Contracts\ChallengeSubmissionRepository;
use App\Repositories\Contracts\EnrollmentRepository;
use App\Repositories\Contracts\GamificationProfileRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InternController extends Controller
{
    public function __construct(
        private readonly EnrollmentRepository $enrollments,
        private readonly ChallengeSubmissionRepository $submissions,
        private readonly CapstoneProjectRepository $capstoneProjects,
        private readonly GamificationProfileRepository $gamificationProfiles,
    ) {}

    public function index(Request $request): Response
    {
        abort_unless($request->user()->isMentor(), 403);

        $mentorId = $request->user()->id;
        $interns = $this->enrollments->forMentor($mentorId)
            ->load(['user', 'learningPath', 'levelProgress.level']);

        $active = $interns->where('status', EnrollmentStatus::Active);
        $avgProgress = $interns->isEmpty()
            ? 0
            : (int) round($interns->avg(fn ($e) => $e->progressPercentage()));

        return Inertia::render('mentor/interns/index', [
            'interns' => EnrollmentResource::collection($interns),
            'stats' => [
                'total' => $interns->count(),
                'active' => $active->count(),
                'completed' => $interns->where('status', EnrollmentStatus::Completed)->count(),
                'avg_progress' => $avgProgress,
            ],
            'queue' => [
                'code_reviews' => $this->submissions->countPendingReviewsForMentor($mentorId),
                'milestone_reviews' => $this->capstoneProjects->countPendingReviewsForMentor($mentorId),
            ],
        ]);
    }

    public function show(Request $request, User $intern): Response
    {
        abort_unless($request->user()->isMentor(), 403);

        $enrollment = $this->enrollments->forMentorAndIntern($request->user()->id, $intern->id);
        $enrollment->load(['user', 'learningPath', 'levelProgress.level', 'capstoneProject.milestones', 'capstoneProject.template']);

        $profile = $this->gamificationProfiles->findForUser($intern);
        $capstone = $this->capstoneProjects->findForEnrollment($enrollment);

        $levelProgress = $enrollment->levelProgress->map(fn ($p) => [
            'level_number' => $p->level->number,
            'level_title' => $p->level->title,
            'status' => $p->status->value,
            'completed_at' => $p->completed_at?->toISOString(),
        ])->sortBy('level_number')->values();

        $completedLevels = $levelProgress->where('status', 'completed')->count();

        return Inertia::render('mentor/interns/show', [
            'enrollment' => new EnrollmentResource($enrollment),
            'level_progress' => $levelProgress,
            'capstone' => $capstone ? new CapstoneProjectResource($capstone) : null,
            'insights' => [
                'levels_completed' => $completedLevels,
                'levels_total' => $levelProgress->count(),
                'total_xp' => $profile?->total_xp ?? 0,
                'current_streak' => $profile?->current_streak ?? 0,
                'pending_submissions' => ChallengeSubmission::query()
                    ->where('user_id', $intern->id)
                    ->where('status', SubmissionStatus::NeedsReview)
                    ->count(),
            ],
        ]);
    }
}
