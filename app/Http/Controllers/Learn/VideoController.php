<?php

namespace App\Http\Controllers\Learn;

use App\Http\Controllers\Controller;
use App\Models\Video;
use App\Services\Learning\LearnPlayerContext;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class VideoController extends Controller
{
    public function __construct(
        private readonly LearnPlayerContext $playerContext,
    ) {}

    public function show(Request $request, Video $video): Response
    {
        abort_unless($request->user()->isIntern(), 403);

        $video->loadMissing('level.learningPath');
        $this->authorize('view', $video->level);

        return Inertia::render('learn/videos/show', [
            ...$this->playerContext->forVideo($video, $request->user()),
            'currentTask' => 'video-'.$video->id,
        ]);
    }
}
