<?php

namespace App\Http\Controllers\Mentor;

use App\Actions\Challenge\ReviewChallengeSubmission;
use App\Enums\SubmissionStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Mentor\ReviewChallengeSubmissionRequest;
use App\Http\Resources\ChallengeSubmissionResource;
use App\Models\ChallengeSubmission;
use App\Repositories\Contracts\ChallengeSubmissionRepository;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReviewController extends Controller
{
    public function __construct(
        private readonly ChallengeSubmissionRepository $submissions,
    ) {}

    public function index(Request $request): Response
    {
        abort_unless($request->user()->isMentor(), 403);

        $items = $this->submissions->pendingReviewsForMentor($request->user()->id);

        return Inertia::render('mentor/reviews/index', [
            'submissions' => ChallengeSubmissionResource::collection($items),
            'stats' => [
                'pending' => $items->count(),
                'interns_waiting' => $items->pluck('user_id')->unique()->count(),
            ],
        ]);
    }

    public function show(Request $request, ChallengeSubmission $submission): Response
    {
        abort_unless($request->user()->isMentor(), 403);

        $submission = $this->submissions->findForMentorReview($request->user()->id, $submission);

        abort_unless($submission, 404);

        return Inertia::render('mentor/reviews/show', [
            'submission' => new ChallengeSubmissionResource($submission),
        ]);
    }

    public function update(
        ReviewChallengeSubmissionRequest $request,
        ChallengeSubmission $submission,
        ReviewChallengeSubmission $reviewChallengeSubmission,
    ): RedirectResponse {
        $mentorSubmission = $this->submissions->findForMentorReview($request->user()->id, $submission);

        abort_unless($mentorSubmission, 404);

        $reviewChallengeSubmission->execute(
            $request->user(),
            $mentorSubmission,
            SubmissionStatus::from($request->validated('status')),
            $request->validated('mentor_feedback'),
            $request->validated('mentor_score'),
        );

        return redirect()->route('mentor.reviews.index');
    }
}
