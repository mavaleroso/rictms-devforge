<?php

namespace App\Http\Controllers\Learn;

use App\Actions\Challenge\RunChallengeTests;
use App\Actions\Challenge\SubmitChallenge;
use App\Http\Controllers\Controller;
use App\Http\Requests\Learn\RunChallengeRequest;
use App\Http\Requests\Learn\SubmitChallengeRequest;
use App\Http\Resources\ChallengeSubmissionResource;
use App\Http\Resources\CodingChallengeResource;
use App\Models\ChallengeSubmission;
use App\Models\CodingChallenge;
use App\Repositories\Contracts\ChallengeSubmissionRepository;
use App\Services\Integrations\GitHub\GitHubAccountService;
use App\Services\Learning\LearnPlayerContext;
use App\Services\Learning\LearnPresentationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ChallengeController extends Controller
{
    public function __construct(
        private readonly LearnPresentationService $presentation,
        private readonly ChallengeSubmissionRepository $submissions,
        private readonly LearnPlayerContext $playerContext,
        private readonly GitHubAccountService $github,
    ) {}

    public function show(Request $request, CodingChallenge $challenge): Response
    {
        abort_unless($request->user()->isIntern(), 403);

        $challenge = $this->presentation->challengeForPlayer($challenge, $request->user());
        $this->authorize('view', $challenge->level);

        $history = $this->submissions->historyForUserAndChallenge(
            $request->user()->id,
            $challenge->id,
        );

        $path = $challenge->level->learningPath;
        $level = $challenge->level;

        return Inertia::render('learn/challenges/show', [
            ...$this->playerContext->forLevel($path, $level, $request->user()),
            'challenge' => new CodingChallengeResource($challenge),
            'submissions' => ChallengeSubmissionResource::collection($history),
            'languages' => $this->presentation->challengeLanguages(),
            'environments' => $this->presentation->challengeEnvironments(),
            'currentTask' => 'challenge-'.$challenge->id,
            'github_connected' => $this->github->isConnected($request->user()),
            'evaluation_driver' => config('evaluation.driver', 'local'),
        ]);
    }

    public function run(RunChallengeRequest $request, CodingChallenge $challenge, RunChallengeTests $runChallengeTests): JsonResponse
    {
        $this->authorize('view', $challenge->level);

        $result = $runChallengeTests->execute(
            $request->user(),
            $challenge,
            $request->validated('code') ?? '',
            $request->validated('files'),
        );

        return response()->json($result->toArray());
    }

    public function submit(SubmitChallengeRequest $request, CodingChallenge $challenge, SubmitChallenge $submitChallenge): JsonResponse
    {
        $this->authorize('view', $challenge->level);

        $submission = $submitChallenge->execute(
            $request->user(),
            $challenge,
            $request->validated('code') ?? '',
            $request->safe()->only(['source', 'github_owner', 'github_repo', 'github_ref', 'github_path', 'files']),
        );

        return response()->json([
            'submission' => new ChallengeSubmissionResource($submission),
        ]);
    }

    public function submissionStatus(Request $request, ChallengeSubmission $submission): JsonResponse
    {
        abort_unless($submission->user_id === $request->user()->id, 403);

        $submission->load(['results.testCase']);

        return response()->json([
            'submission' => new ChallengeSubmissionResource($submission),
        ]);
    }
}
