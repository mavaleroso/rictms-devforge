<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Admin\CreateLearningPath;
use App\Actions\Admin\CreateLevel;
use App\Actions\Admin\DeleteLearningPath;
use App\Actions\Admin\UpdateLearningPath;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreLearningPathRequest;
use App\Http\Requests\Admin\UpdateLearningPathRequest;
use App\Http\Resources\LearningPathResource;
use App\Models\LearningPath;
use App\Repositories\Contracts\LearningPathRepository;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class LearningPathController extends Controller
{
    public function __construct(
        private readonly LearningPathRepository $paths,
    ) {}

    public function index(): Response
    {
        $this->authorize('viewAny', LearningPath::class);

        $paths = $this->paths->listWithLevelCount();

        return Inertia::render('admin/paths/index', [
            'paths' => LearningPathResource::collection($paths),
            'stats' => [
                'total' => $paths->count(),
                'active' => $paths->where('is_active', true)->count(),
                'enrollments' => (int) $paths->sum('enrollments_count'),
            ],
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', LearningPath::class);

        return Inertia::render('admin/paths/create');
    }

    public function store(StoreLearningPathRequest $request, CreateLearningPath $createLearningPath): RedirectResponse
    {
        $path = $createLearningPath->execute(
            $request->safe()->except(['cover_image', 'remove_cover']),
            $request->file('cover_image'),
        );

        return to_route('admin.paths.edit', $path);
    }

    public function edit(LearningPath $path): Response
    {
        $this->authorize('update', $path);

        $this->paths->loadWithOrderedLevels($path);

        return Inertia::render('admin/paths/edit', [
            'path' => new LearningPathResource($path),
        ]);
    }

    public function update(UpdateLearningPathRequest $request, LearningPath $path, UpdateLearningPath $updateLearningPath): RedirectResponse
    {
        $updateLearningPath->execute(
            $path,
            $request->safe()->except(['cover_image', 'remove_cover']),
            $request->file('cover_image'),
            $request->boolean('remove_cover'),
        );

        $path->refresh();

        return to_route('admin.paths.edit', $path);
    }

    public function destroy(LearningPath $path, DeleteLearningPath $deleteLearningPath): RedirectResponse
    {
        $this->authorize('delete', $path);

        $name = $path->name;
        $deleteLearningPath->execute($path);

        return to_route('admin.paths.index')->with('success', "Learning path \"{$name}\" and all related content were deleted.");
    }
}
