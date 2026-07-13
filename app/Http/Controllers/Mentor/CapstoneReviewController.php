<?php

namespace App\Http\Controllers\Mentor;

use App\Actions\Capstone\ApproveCapstoneKickoff;
use App\Actions\Capstone\ReviewCapstoneMilestone;
use App\Enums\CapstoneMilestoneStatus;
use App\Enums\CapstoneProjectStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Mentor\ReviewCapstoneMilestoneRequest;
use App\Http\Resources\CapstoneProjectMilestoneResource;
use App\Http\Resources\CapstoneProjectResource;
use App\Http\Resources\JournalEntryResource;
use App\Models\CapstoneProject;
use App\Models\CapstoneProjectMilestone;
use App\Repositories\Contracts\CapstoneProjectRepository;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CapstoneReviewController extends Controller
{
    public function __construct(
        private readonly CapstoneProjectRepository $projects,
    ) {}

    public function index(Request $request): Response
    {
        abort_unless($request->user()->isMentor(), 403);

        $milestones = $this->projects->pendingReviewsForMentor($request->user()->id);
        $kickoffs = CapstoneProject::query()
            ->where('status', CapstoneProjectStatus::Draft)
            ->whereHas('enrollment', fn ($q) => $q->where('mentor_id', $request->user()->id))
            ->with(['enrollment.user', 'template'])
            ->latest('started_at')
            ->limit(20)
            ->get();

        return Inertia::render('mentor/capstone-reviews/index', [
            'milestones' => CapstoneProjectMilestoneResource::collection($milestones),
            'kickoffs' => CapstoneProjectResource::collection($kickoffs),
            'stats' => [
                'pending' => $milestones->count(),
                'kickoffs' => $kickoffs->count(),
                'interns_waiting' => $milestones->map(fn ($m) => $m->project?->enrollment?->user_id)->unique()->filter()->count(),
            ],
        ]);
    }

    public function show(Request $request, CapstoneProjectMilestone $milestone): Response
    {
        abort_unless($request->user()->isMentor(), 403);

        $record = $this->projects->findMilestoneForMentorReview($request->user()->id, $milestone);
        abort_unless($record, 404);
        $this->authorize('review', $record);

        $journals = $record->project->journalEntries()
            ->with('milestone')
            ->limit(20)
            ->get();

        $approved = $record->project->milestones->where('status', CapstoneMilestoneStatus::Approved)->count();
        $total = $record->project->milestones->count();

        return Inertia::render('mentor/capstone-reviews/show', [
            'milestone' => new CapstoneProjectMilestoneResource($record),
            'journals' => JournalEntryResource::collection($journals),
            'project_progress' => [
                'approved' => $approved,
                'total' => $total,
                'percent' => $total > 0 ? (int) round(($approved / $total) * 100) : 0,
            ],
        ]);
    }

    public function update(
        ReviewCapstoneMilestoneRequest $request,
        CapstoneProjectMilestone $milestone,
        ReviewCapstoneMilestone $review,
    ): RedirectResponse {
        $record = $this->projects->findMilestoneForMentorReview($request->user()->id, $milestone);
        abort_unless($record, 404);
        $this->authorize('review', $record);

        $review->execute(
            $request->user(),
            $record,
            CapstoneMilestoneStatus::from($request->validated('status')),
            $request->validated('mentor_feedback'),
            $request->validated('mentor_score'),
        );

        return redirect()->route('mentor.capstone-reviews.index');
    }

    public function approveKickoff(
        Request $request,
        CapstoneProject $project,
        ApproveCapstoneKickoff $approve,
    ): RedirectResponse {
        abort_unless($request->user()->isMentor(), 403);
        abort_unless($project->enrollment?->mentor_id === $request->user()->id, 404);
        $this->authorize('approveKickoff', $project);

        $approve->execute($request->user(), $project);

        return redirect()->route('mentor.capstone-reviews.index');
    }
}
