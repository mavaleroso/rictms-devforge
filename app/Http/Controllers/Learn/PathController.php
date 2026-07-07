<?php

namespace App\Http\Controllers\Learn;

use App\Actions\Learning\EnrollIntern;
use App\Http\Controllers\Controller;
use App\Http\Requests\Learn\EnrollPathRequest;
use App\Http\Resources\EnrollmentResource;
use App\Http\Resources\LearningPathResource;
use App\Models\LearningPath;
use App\Repositories\Contracts\EnrollmentRepository;
use App\Repositories\Contracts\LearningPathRepository;
use App\Services\Learning\LearnPresentationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PathController extends Controller
{
    public function __construct(
        private readonly LearningPathRepository $paths,
        private readonly EnrollmentRepository $enrollments,
        private readonly LearnPresentationService $presentation,
    ) {}

    public function index(Request $request): Response
    {
        abort_unless($request->user()->isIntern(), 403);

        $enrollment = $this->enrollments->findActiveForUser($request->user());

        if ($enrollment) {
            $enrollment->load(['learningPath', 'levelProgress.level']);
        }

        return Inertia::render('learn/paths/index', [
            'paths' => LearningPathResource::collection(
                $this->paths->activeWithLevelCount()
            ),
            'enrollment' => $enrollment ? new EnrollmentResource($enrollment) : null,
        ]);
    }

    public function show(Request $request, LearningPath $path): Response
    {
        abort_unless($request->user()->isIntern(), 403);

        $enrollment = $this->presentation->enrollmentForPath($request->user(), $path);
        $path = $this->presentation->pathWithProgress($path, $request->user());

        return Inertia::render('learn/paths/show', [
            'path' => new LearningPathResource($path),
            'enrollment' => $enrollment ? new EnrollmentResource($enrollment) : null,
        ]);
    }

    public function enroll(EnrollPathRequest $request, LearningPath $path, EnrollIntern $enrollIntern): RedirectResponse
    {
        $enrollIntern->execute($request->user(), $path);

        return to_route('learn.paths.show', $path);
    }
}
