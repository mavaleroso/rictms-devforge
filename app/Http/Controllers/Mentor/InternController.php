<?php

namespace App\Http\Controllers\Mentor;

use App\Http\Controllers\Controller;
use App\Http\Resources\EnrollmentResource;
use App\Models\User;
use App\Repositories\Contracts\EnrollmentRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InternController extends Controller
{
    public function __construct(
        private readonly EnrollmentRepository $enrollments,
    ) {}

    public function index(Request $request): Response
    {
        abort_unless($request->user()->isMentor(), 403);

        return Inertia::render('mentor/interns/index', [
            'interns' => EnrollmentResource::collection(
                $this->enrollments->forMentor($request->user()->id)
            ),
        ]);
    }

    public function show(Request $request, User $intern): Response
    {
        abort_unless($request->user()->isMentor(), 403);

        $enrollment = $this->enrollments->forMentorAndIntern($request->user()->id, $intern->id);

        return Inertia::render('mentor/interns/show', [
            'enrollment' => new EnrollmentResource($enrollment),
            'level_progress' => $enrollment->levelProgress->map(fn ($p) => [
                'level_number' => $p->level->number,
                'level_title' => $p->level->title,
                'status' => $p->status->value,
                'completed_at' => $p->completed_at?->toISOString(),
            ]),
        ]);
    }
}
