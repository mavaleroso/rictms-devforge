<?php

namespace App\Http\Controllers\Learn;

use App\Actions\Capstone\StartCapstoneProject;
use App\Actions\Capstone\SubmitCapstoneMilestone;
use App\Enums\CapstoneMilestoneStatus;
use App\Enums\CapstoneProjectStatus;
use App\Enums\CapstoneTaskStatus;
use App\Enums\ProgressStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Learn\StartCapstoneProjectRequest;
use App\Http\Requests\Learn\StoreCapstoneTaskRequest;
use App\Http\Requests\Learn\StoreJournalEntryRequest;
use App\Http\Requests\Learn\SubmitCapstoneMilestoneRequest;
use App\Http\Requests\Learn\UpdateCapstoneTaskRequest;
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
        $enrollment = $this->access->requireAccess($request->user());
        $project = $this->projects->findForEnrollment($enrollment);

        $stats = null;
        $levelStatus = null;
        $nextAction = null;

        if ($project) {
            $project->loadMissing(['milestones', 'tasks', 'enrollment.mentor', 'template']);

            if ($project->status === CapstoneProjectStatus::Archived) {
                return Inertia::render('learn/capstone/show', [
                    'project' => null,
                    'project_stats' => null,
                    'level_status' => null,
                    'next_action' => 'Your previous capstone was archived. Choose a template to start again.',
                    'templates' => CapstoneTemplateResource::collection(
                        $this->templates->activeWithRelations(),
                    ),
                    'can_start' => true,
                    'has_mentor' => (bool) $enrollment->mentor_id,
                    'archived_project_id' => $project->id,
                ]);
            }
            $approved = $project->milestones->where('status', CapstoneMilestoneStatus::Approved)->count();
            $total = $project->milestones->count();
            $weeks = max(1, (int) ($project->template?->estimated_weeks ?? 4));
            $elapsedDays = $project->started_at ? $project->started_at->diffInDays(now()) : 0;
            $elapsedWeeks = round($elapsedDays / 7, 1);
            $activeMilestone = $project->milestones->first(
                fn ($m) => in_array($m->status, [CapstoneMilestoneStatus::InProgress, CapstoneMilestoneStatus::Rejected], true),
            );

            $stats = [
                'milestones_approved' => $approved,
                'milestones_total' => $total,
                'tasks_done' => $project->tasks->where('status', CapstoneTaskStatus::Done)->count(),
                'tasks_total' => $project->tasks->count(),
                'progress' => $total > 0 ? (int) round(($approved / $total) * 100) : 0,
                'estimated_weeks' => $weeks,
                'elapsed_weeks' => $elapsedWeeks,
                'hours_logged' => (float) $project->journalEntries()->sum('hours_spent'),
                'active_milestone_title' => $activeMilestone?->title,
            ];

            if ($project->level_id) {
                $levelProgress = $enrollment->levelProgress()
                    ->with('level')
                    ->where('level_id', $project->level_id)
                    ->first();

                $levelStatus = [
                    'status' => $levelProgress?->status?->value ?? ProgressStatus::Available->value,
                    'level_number' => $levelProgress?->level?->number ?? 20,
                    'is_complete' => $levelProgress?->status === ProgressStatus::Completed,
                    'capstone_complete' => $project->status === CapstoneProjectStatus::Completed,
                ];
            }

            $nextAction = match (true) {
                $project->needsKickoff() => 'Awaiting mentor kickoff approval before milestone work begins.',
                $project->status === CapstoneProjectStatus::Completed && ! ($levelStatus['is_complete'] ?? false) => 'Capstone done — finish any remaining Level 20 materials, quiz, or challenges to complete the path.',
                $project->status === CapstoneProjectStatus::Completed => 'Capstone and Level 20 are complete. Great work!',
                $project->status === CapstoneProjectStatus::Archived => 'This project is archived. Start a new template to continue.',
                $activeMilestone !== null => 'Next: work and submit “'.$activeMilestone->title.'”.',
                default => 'Keep logging journal entries and moving board tasks forward.',
            };
        }

        return Inertia::render('learn/capstone/show', [
            'project' => $project ? new CapstoneProjectResource($project) : null,
            'project_stats' => $stats,
            'level_status' => $levelStatus,
            'next_action' => $nextAction,
            'templates' => $project ? null : CapstoneTemplateResource::collection(
                $this->templates->activeWithRelations(),
            ),
            'can_start' => ! $project,
            'has_mentor' => (bool) $enrollment->mentor_id,
        ]);
    }

    public function start(StartCapstoneProjectRequest $request, StartCapstoneProject $start): RedirectResponse
    {
        $enrollment = $this->access->requireAccess($request->user());
        $template = CapstoneTemplate::query()->findOrFail($request->validated('template_id'));

        $existing = $this->projects->findForEnrollment($enrollment);
        if ($existing?->status === CapstoneProjectStatus::Archived) {
            $existing->delete();
        }

        $start->execute($enrollment, $template, $request->user());

        return redirect()->route('learn.capstone.show');
    }

    public function archive(Request $request): RedirectResponse
    {
        $enrollment = $this->access->requireAccess($request->user());
        $project = $this->projects->findForEnrollment($enrollment);
        abort_unless($project, 404);
        $this->authorize('archive', $project);
        $this->projectService->archive($project);

        return redirect()->route('learn.capstone.show');
    }

    public function board(Request $request): Response
    {
        $enrollment = $this->access->requireAccess($request->user());
        $project = $this->projects->findForEnrollment($enrollment);
        abort_unless($project, 404);
        $this->authorize('view', $project);

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

    public function storeTask(StoreCapstoneTaskRequest $request): RedirectResponse
    {
        $enrollment = $this->access->requireAccess($request->user());
        $project = $this->projects->findForEnrollment($enrollment);
        abort_unless($project, 404);
        $this->authorize('update', $project);

        $this->board->createTask($project, $request->user(), $request->validated());

        return back();
    }

    public function updateTask(UpdateCapstoneTaskRequest $request, CapstoneTask $task): RedirectResponse
    {
        $enrollment = $this->access->requireAccess($request->user());
        $project = $this->projects->findForEnrollment($enrollment);
        abort_unless($project && $task->capstone_project_id === $project->id, 404);
        $this->authorize('update', $project);

        $this->board->updateTask($task, $request->validated());

        return back();
    }

    public function destroyTask(Request $request, CapstoneTask $task): RedirectResponse
    {
        $enrollment = $this->access->requireAccess($request->user());
        $project = $this->projects->findForEnrollment($enrollment);
        abort_unless($project && $task->capstone_project_id === $project->id, 404);
        $this->authorize('update', $project);

        $this->board->deleteTask($task);

        return back();
    }

    public function journal(Request $request): Response
    {
        $enrollment = $this->access->requireAccess($request->user());
        $project = $this->projects->findForEnrollment($enrollment);
        abort_unless($project, 404);
        $this->authorize('view', $project);

        return Inertia::render('learn/capstone/journal', [
            'project' => new CapstoneProjectResource($project),
            'entries' => JournalEntryResource::collection(
                $this->journalEntries->forProject($project),
            ),
            'milestones' => $project->milestones->map(fn ($m) => [
                'id' => $m->id,
                'title' => $m->title,
            ]),
            'today' => now()->toDateString(),
        ]);
    }

    public function storeJournal(StoreJournalEntryRequest $request): RedirectResponse
    {
        $enrollment = $this->access->requireAccess($request->user());
        $project = $this->projects->findForEnrollment($enrollment);
        abort_unless($project, 404);
        $this->authorize('update', $project);

        $this->journal->saveEntry($project, $request->user(), $request->validated());

        return back();
    }

    public function submitMilestone(
        SubmitCapstoneMilestoneRequest $request,
        CapstoneProjectMilestone $milestone,
        SubmitCapstoneMilestone $submit,
    ): RedirectResponse {
        $enrollment = $this->access->requireAccess($request->user());
        $project = $this->projects->findForEnrollment($enrollment);
        abort_unless($project && $milestone->capstone_project_id === $project->id, 404);
        $this->authorize('submit', $milestone);

        $submit->execute(
            $request->user(),
            $milestone,
            $request->safe()->except(['attachments']),
            array_values($request->file('attachments', []) ?? []),
        );

        return back();
    }
}
