<?php

namespace App\Http\Controllers\Learn;

use App\Http\Controllers\Controller;
use App\Http\Resources\CapstoneProjectResource;
use App\Http\Resources\CapstoneTaskResource;
use App\Http\Resources\CapstoneTemplateResource;
use App\Http\Resources\JournalEntryResource;
use App\Models\CapstoneProjectMilestone;
use App\Models\CapstoneTask;
use App\Models\CapstoneTemplate;
use App\Repositories\Contracts\CapstoneProjectRepository;
use App\Repositories\Contracts\CapstoneTemplateRepository;
use App\Repositories\Contracts\JournalEntryRepository;
use App\Services\Capstone\CapstoneAccessService;
use App\Services\Capstone\CapstoneBoardService;
use App\Services\Capstone\CapstoneProjectService;
use App\Services\Capstone\JournalService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CapstoneController extends Controller
{
    public function __construct(
        private readonly CapstoneAccessService $access,
        private readonly CapstoneProjectRepository $projects,
        private readonly CapstoneTemplateRepository $templates,
        private readonly CapstoneProjectService $projectService,
        private readonly CapstoneBoardService $board,
        private readonly JournalService $journal,
        private readonly JournalEntryRepository $journalEntries,
    ) {}

    public function show(Request $request): Response
    {
        abort_unless($request->user()->isIntern(), 403);

        $enrollment = $this->access->requireAccess($request->user());
        $project = $this->projects->findForEnrollment($enrollment);

        $stats = null;

        if ($project) {
            $approved = $project->milestones->where('status', \App\Enums\CapstoneMilestoneStatus::Approved)->count();
            $total = $project->milestones->count();

            $stats = [
                'milestones_approved' => $approved,
                'milestones_total' => $total,
                'tasks_done' => $project->tasks->where('status', \App\Enums\CapstoneTaskStatus::Done)->count(),
                'tasks_total' => $project->tasks->count(),
                'progress' => $total > 0 ? (int) round(($approved / $total) * 100) : 0,
            ];
        }

        return Inertia::render('learn/capstone/show', [
            'project' => $project ? new CapstoneProjectResource($project) : null,
            'project_stats' => $stats,
            'templates' => $project ? null : CapstoneTemplateResource::collection(
                $this->templates->activeWithRelations(),
            ),
            'can_start' => ! $project,
        ]);
    }

    public function start(Request $request): RedirectResponse
    {
        abort_unless($request->user()->isIntern(), 403);

        $enrollment = $this->access->requireAccess($request->user());

        $validated = $request->validate([
            'template_id' => ['required', 'integer', 'exists:capstone_templates,id'],
        ]);

        $template = CapstoneTemplate::query()->findOrFail($validated['template_id']);
        $this->projectService->start($enrollment, $template, $request->user());

        return redirect()->route('learn.capstone.show');
    }

    public function board(Request $request): Response
    {
        abort_unless($request->user()->isIntern(), 403);

        $enrollment = $this->access->requireAccess($request->user());
        $project = $this->projects->findForEnrollment($enrollment);

        abort_unless($project, 404);

        return Inertia::render('learn/capstone/board', [
            'project' => new CapstoneProjectResource($project),
            'columns' => collect($this->board->groupedByStatus($project))->map(
                fn ($tasks, $status) => [
                    'status' => $status,
                    'tasks' => CapstoneTaskResource::collection(collect($tasks)),
                ],
            )->values(),
            'milestones' => $project->milestones->map(fn ($m) => [
                'id' => $m->id,
                'title' => $m->title,
            ]),
        ]);
    }

    public function storeTask(Request $request): RedirectResponse
    {
        abort_unless($request->user()->isIntern(), 403);

        $enrollment = $this->access->requireAccess($request->user());
        $project = $this->projects->findForEnrollment($enrollment);

        abort_unless($project, 404);

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'status' => ['nullable', 'string'],
            'priority' => ['nullable', 'string'],
            'milestone_id' => ['nullable', 'integer'],
            'due_date' => ['nullable', 'date'],
        ]);

        $this->board->createTask($project, $request->user(), $validated);

        return back();
    }

    public function updateTask(Request $request, CapstoneTask $task): RedirectResponse
    {
        abort_unless($request->user()->isIntern(), 403);

        $enrollment = $this->access->requireAccess($request->user());
        $project = $this->projects->findForEnrollment($enrollment);

        abort_unless($project && $task->capstone_project_id === $project->id, 404);

        $validated = $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'status' => ['sometimes', 'string'],
            'priority' => ['sometimes', 'string'],
            'due_date' => ['nullable', 'date'],
        ]);

        $this->board->updateTask($task, $validated);

        return back();
    }

    public function journal(Request $request): Response
    {
        abort_unless($request->user()->isIntern(), 403);

        $enrollment = $this->access->requireAccess($request->user());
        $project = $this->projects->findForEnrollment($enrollment);

        abort_unless($project, 404);

        return Inertia::render('learn/capstone/journal', [
            'project' => new CapstoneProjectResource($project),
            'entries' => JournalEntryResource::collection(
                $this->journalEntries->forProject($project),
            ),
            'today' => now()->toDateString(),
        ]);
    }

    public function storeJournal(Request $request): RedirectResponse
    {
        abort_unless($request->user()->isIntern(), 403);

        $enrollment = $this->access->requireAccess($request->user());
        $project = $this->projects->findForEnrollment($enrollment);

        abort_unless($project, 404);

        $validated = $request->validate([
            'entry_date' => ['required', 'date'],
            'content' => ['required', 'string', 'min:10'],
            'mood' => ['nullable', 'string'],
            'hours_spent' => ['nullable', 'numeric', 'min:0', 'max:24'],
        ]);

        $this->journal->saveEntry($project, $request->user(), $validated);

        return back();
    }

    public function submitMilestone(Request $request, CapstoneProjectMilestone $milestone): RedirectResponse
    {
        abort_unless($request->user()->isIntern(), 403);

        $enrollment = $this->access->requireAccess($request->user());
        $project = $this->projects->findForEnrollment($enrollment);

        abort_unless($project && $milestone->capstone_project_id === $project->id, 404);

        $this->projectService->submitMilestone($request->user(), $milestone);

        return back();
    }
}
