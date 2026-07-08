<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\CapstoneTemplateResource;
use App\Repositories\Contracts\CapstoneTemplateRepository;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CapstoneTemplateController extends Controller
{
    public function __construct(
        private readonly CapstoneTemplateRepository $templates,
    ) {}

    public function index(): Response
    {
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

    public function edit(int $template): Response
    {
        $record = $this->templates->findWithRelations($template);

        abort_unless($record, 404);

        return Inertia::render('admin/capstone-templates/edit', [
            'template' => new CapstoneTemplateResource($record),
        ]);
    }

    public function update(Request $request, int $template): RedirectResponse
    {
        $record = $this->templates->findWithRelations($template);

        abort_unless($record, 404);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'objectives' => ['nullable', 'string'],
            'estimated_weeks' => ['required', 'integer', 'min:1', 'max:52'],
            'is_active' => ['required', 'boolean'],
        ]);

        $this->templates->update($record, $validated);

        return redirect()->route('admin.capstone-templates.index');
    }
}
