<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Capstone\ManageCapstoneTemplate;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreCapstoneTemplateMilestoneRequest;
use App\Http\Requests\Admin\StoreCapstoneTemplateRequest;
use App\Http\Requests\Admin\StoreCapstoneTemplateTaskRequest;
use App\Http\Requests\Admin\UpdateCapstoneTemplateRequest;
use App\Http\Resources\CapstoneTemplateResource;
use App\Models\CapstoneTemplate;
use App\Models\CapstoneTemplateMilestone;
use App\Models\CapstoneTemplateTask;
use App\Repositories\Contracts\CapstoneTemplateRepository;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CapstoneTemplateController extends Controller
{
    public function __construct(
        private readonly CapstoneTemplateRepository $templates,
        private readonly ManageCapstoneTemplate $manage,
    ) {}

    public function index(): Response
    {
        $this->authorize('viewAny', CapstoneTemplate::class);
        $templates = $this->templates->allWithRelations();

        return Inertia::render('admin/capstone-templates/index', [
            'templates' => CapstoneTemplateResource::collection($templates),
            'stats' => [
                'total' => $templates->count(),
                'active' => $templates->where('is_active', true)->count(),
                'milestones' => $templates->sum(fn ($t) => $t->milestones->count()),
            ],
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', CapstoneTemplate::class);

        return Inertia::render('admin/capstone-templates/create');
    }

    public function store(StoreCapstoneTemplateRequest $request): RedirectResponse
    {
        $this->authorize('create', CapstoneTemplate::class);
        $template = $this->manage->create($request->validated());

        return redirect()->route('admin.capstone-templates.edit', $template);
    }

    public function edit(CapstoneTemplate $template): Response
    {
        $this->authorize('update', $template);
        $record = $this->templates->findWithRelations($template->id);
        abort_unless($record, 404);

        return Inertia::render('admin/capstone-templates/edit', [
            'template' => new CapstoneTemplateResource($record),
        ]);
    }

    public function update(UpdateCapstoneTemplateRequest $request, CapstoneTemplate $template): RedirectResponse
    {
        $this->authorize('update', $template);
        $this->manage->update($template, $request->validated());

        return redirect()->route('admin.capstone-templates.edit', $template)
            ->with('success', 'Template updated.');
    }

    public function storeMilestone(StoreCapstoneTemplateMilestoneRequest $request, CapstoneTemplate $template): RedirectResponse
    {
        $this->authorize('update', $template);
        $this->manage->storeMilestone($template, $request->validated());

        return back();
    }

    public function updateMilestone(Request $request, CapstoneTemplateMilestone $milestone): RedirectResponse
    {
        $this->authorize('update', $milestone->template);
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'sort_order' => ['nullable', 'integer', 'min:1'],
            'requires_mentor_signoff' => ['required', 'boolean'],
            'allows_parallel' => ['required', 'boolean'],
            'is_final_showcase' => ['required', 'boolean'],
        ]);
        $this->manage->updateMilestone($milestone->id, $validated);

        return back();
    }

    public function destroyMilestone(CapstoneTemplateMilestone $milestone): RedirectResponse
    {
        $this->authorize('update', $milestone->template);
        $this->manage->deleteMilestone($milestone->id);

        return back();
    }

    public function storeTask(StoreCapstoneTemplateTaskRequest $request, CapstoneTemplate $template): RedirectResponse
    {
        $this->authorize('update', $template);
        $this->manage->storeTask($template, $request->validated());

        return back();
    }

    public function updateTask(Request $request, CapstoneTemplateTask $task): RedirectResponse
    {
        $this->authorize('update', $task->template);
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'capstone_template_milestone_id' => ['nullable', 'integer'],
            'default_status' => ['nullable', 'string'],
            'priority' => ['nullable', 'string'],
            'sort_order' => ['nullable', 'integer', 'min:1'],
        ]);
        $this->manage->updateTask($task->id, $validated);

        return back();
    }

    public function destroyTask(CapstoneTemplateTask $task): RedirectResponse
    {
        $this->authorize('update', $task->template);
        $this->manage->deleteTask($task->id);

        return back();
    }
}
