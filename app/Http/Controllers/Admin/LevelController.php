<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Admin\CreateLevel;
use App\Actions\Admin\UpdateLevel;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreLevelRequest;
use App\Http\Requests\Admin\UpdateLevelRequest;
use App\Http\Resources\LevelResource;
use App\Models\LearningPath;
use App\Models\Level;
use App\Repositories\Contracts\LevelRepository;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class LevelController extends Controller
{
    public function __construct(
        private readonly LevelRepository $levels,
    ) {}

    public function store(
        StoreLevelRequest $request,
        LearningPath $path,
        CreateLevel $createLevel,
    ): RedirectResponse {
        $this->authorize('update', $path);

        $level = $createLevel->execute($path, $request->validated());

        return to_route('admin.levels.edit', [$path, $level]);
    }

    public function edit(LearningPath $path, Level $level): Response
    {
        $this->authorize('update', $level);

        abort_unless($level->learning_path_id === $path->id, 404);

        $this->levels->loadWithContent($level);

        return Inertia::render('admin/levels/edit', [
            'path' => $path->only(['id', 'name', 'slug', 'icon']),
            'level' => new LevelResource($level),
        ]);
    }

    public function update(UpdateLevelRequest $request, LearningPath $path, Level $level, UpdateLevel $updateLevel): RedirectResponse
    {
        abort_unless($level->learning_path_id === $path->id, 404);

        $updateLevel->execute($level, $request->validated());

        return back();
    }
}
