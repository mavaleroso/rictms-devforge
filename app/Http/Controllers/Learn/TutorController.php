<?php

namespace App\Http\Controllers\Learn;

use App\Http\Controllers\Controller;
use App\Http\Requests\Learn\SendTutorMessageRequest;
use App\Http\Resources\ChallengeSubmissionResource;
use App\Models\ChallengeSubmission;
use App\Models\CodingChallenge;
use App\Models\TutorSession;
use App\Services\AI\TutorService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TutorController extends Controller
{
    public function __construct(
        private readonly TutorService $tutor,
    ) {}

    public function show(Request $request, TutorSession $session): JsonResponse
    {
        abort_unless($session->user_id === $request->user()->id, 403);

        return response()->json($this->tutor->sessionPayload($session));
    }

    public function store(SendTutorMessageRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $session = $this->tutor->findOrCreateSession(
            $request->user(),
            $validated['context_type'],
            $validated['context_id'] ?? null,
            isset($validated['level_id']) ? \App\Models\Level::find($validated['level_id']) : null,
            $validated['title'],
        );

        $this->tutor->sendMessage($session, $request->user(), $validated['message']);

        return response()->json($this->tutor->sessionPayload($session->fresh()));
    }
}
