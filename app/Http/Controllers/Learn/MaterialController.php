<?php

namespace App\Http\Controllers\Learn;

use App\Http\Controllers\Controller;
use App\Models\LearningMaterial;
use App\Models\LearningMaterialFile;
use App\Services\Learning\LearnPlayerContext;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class MaterialController extends Controller
{
    public function __construct(
        private readonly LearnPlayerContext $playerContext,
    ) {}

    public function show(Request $request, LearningMaterial $material): Response
    {
        abort_unless($request->user()->isIntern(), 403);

        $material->loadMissing('level.learningPath');
        $this->authorize('view', $material->level);

        return Inertia::render('learn/materials/show', [
            ...$this->playerContext->forMaterial($material, $request->user()),
            'currentTask' => 'material-'.$material->id,
        ]);
    }

    public function downloadFile(Request $request, LearningMaterialFile $file): StreamedResponse
    {
        abort_unless($request->user()->isIntern(), 403);

        $file->loadMissing('material.level');
        $this->authorize('view', $file->material->level);

        abort_unless(Storage::disk('public')->exists($file->file_path), 404);

        return Storage::disk('public')->download($file->file_path, $file->original_name);
    }
}
