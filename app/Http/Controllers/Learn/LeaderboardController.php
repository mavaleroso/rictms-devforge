<?php

namespace App\Http\Controllers\Learn;

use App\Http\Controllers\Controller;
use App\Repositories\Contracts\EnrollmentRepository;
use App\Services\Gamification\GamificationService;
use App\Services\Gamification\LeaderboardService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LeaderboardController extends Controller
{
    public function __construct(
        private readonly LeaderboardService $leaderboard,
        private readonly GamificationService $gamification,
        private readonly EnrollmentRepository $enrollments,
    ) {}

    public function index(Request $request): Response
    {
        abort_unless($request->user()->isIntern(), 403);

        $enrollment = $this->enrollments->findActiveForUser($request->user());
        $pathId = $request->integer('path') ?: $enrollment?->learning_path_id;

        return Inertia::render('learn/leaderboard/index', [
            'leaderboard' => $this->leaderboard->forIntern($request->user(), $pathId),
            'gamification' => $this->gamification->profilePayloadFor($request->user()),
            'enrolled_path_id' => $enrollment?->learning_path_id,
        ]);
    }
}
