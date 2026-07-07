<?php

namespace App\Http\Controllers\Learn;

use App\Actions\Learning\CompleteContent;
use App\Http\Controllers\Controller;
use App\Http\Resources\EnrollmentResource;
use App\Http\Resources\LearningPathResource;
use App\Http\Resources\LevelResource;
use App\Models\LearningMaterial;
use App\Models\LearningPath;
use App\Models\Level;
use App\Models\Video;
use App\Services\Learning\LearnPresentationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LevelController extends Controller
{
    public function __construct(
        private readonly LearnPresentationService $presentation,
    ) {}

    public function show(Request $request, LearningPath $path, Level $level): Response
    {
        abort_unless($level->learning_path_id === $path->id, 404);
        $this->authorize('view', $level);

        $level = $this->presentation->levelForPlayer($path, $level, $request->user());
        $pathWithProgress = $this->presentation->pathWithProgress($path, $request->user());
        $enrollment = $this->presentation->enrollmentForPath($request->user(), $path);

        return Inertia::render('learn/levels/show', [
            'path' => new LearningPathResource($pathWithProgress),
            'level' => new LevelResource($level),
            'enrollment' => $enrollment ? new EnrollmentResource($enrollment) : null,
        ]);
    }

    public function completeMaterial(Request $request, LearningMaterial $material, CompleteContent $completeContent): RedirectResponse
    {
        abort_unless($request->user()->isIntern(), 403);
        $completeContent->execute($request->user(), $material);

        return back();
    }

    public function completeVideo(Request $request, Video $video, CompleteContent $completeContent): RedirectResponse
    {
        abort_unless($request->user()->isIntern(), 403);
        $completeContent->execute($request->user(), $video);

        return back();
    }
}
