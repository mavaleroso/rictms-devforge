<?php

namespace App\Http\Controllers\Mentor;

use App\Enums\CapstoneMilestoneStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\CapstoneProjectMilestoneResource;
use App\Models\CapstoneProjectMilestone;
use App\Repositories\Contracts\CapstoneProjectRepository;
use App\Services\Capstone\CapstoneProjectService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CapstoneReviewController extends Controller
{
    public function __construct(
        private readonly CapstoneProjectRepository $projects,
        private readonly CapstoneProjectService $projectService,
    ) {}

    public function index(Request $request): Response
    {
        abort_unless($request->user()->isMentor(), 403);

        $milestones = $this->projects->pendingReviewsForMentor($request->user()->id);

        return Inertia::render('mentor/capstone-reviews/index', [
            'milestones' => CapstoneProjectMilestoneResource::collection($milestones),
            'stats' => [
                'pending' => $milestones->count(),
                'interns_waiting' => $milestones->map(fn ($m) => $m->project?->enrollment?->user_id)->unique()->filter()->count(),
            ],
        ]);
    }

    public function show(Request $request, CapstoneProjectMilestone $milestone): Response
    {
        abort_unless($request->user()->isMentor(), 403);

        $record = $this->projects->findMilestoneForMentorReview($request->user()->id, $milestone);

        abort_unless($record, 404);

        return Inertia::render('mentor/capstone-reviews/show', [
            'milestone' => new CapstoneProjectMilestoneResource($record),
        ]);
    }

    public function update(Request $request, CapstoneProjectMilestone $milestone): RedirectResponse
    {
        abort_unless($request->user()->isMentor(), 403);

        $record = $this->projects->findMilestoneForMentorReview($request->user()->id, $milestone);

        abort_unless($record, 404);

        $validated = $request->validate([
            'status' => ['required', 'in:approved,rejected'],
            'mentor_feedback' => ['nullable', 'string'],
            'mentor_score' => ['nullable', 'integer', 'min:0', 'max:100'],
        ]);

        $this->projectService->reviewMilestone(
            $request->user(),
            $record,
            CapstoneMilestoneStatus::from($validated['status']),
            $validated['mentor_feedback'] ?? null,
            $validated['mentor_score'] ?? null,
        );

        return redirect()->route('mentor.capstone-reviews.index');
    }
}
