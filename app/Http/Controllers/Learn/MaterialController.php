<?php

namespace App\Http\Controllers\Learn;

use App\Http\Controllers\Controller;
use App\Models\LearningMaterial;
use App\Services\Learning\LearnPlayerContext;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

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
}
