<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Learning\EnrollIntern;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreEnrollmentRequest;
use App\Http\Resources\EnrollmentResource;
use App\Models\Enrollment;
use App\Repositories\Contracts\EnrollmentRepository;
use App\Repositories\Contracts\LearningPathRepository;
use App\Repositories\Contracts\UserRepository;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class EnrollmentController extends Controller
{
    public function __construct(
        private readonly EnrollmentRepository $enrollments,
        private readonly UserRepository $users,
        private readonly LearningPathRepository $paths,
    ) {}

    public function index(): Response
    {
        $this->authorize('viewAny', Enrollment::class);

        return Inertia::render('admin/enrollments/index', [
            'enrollments' => EnrollmentResource::collection(
                $this->enrollments->listWithRelations()
            ),
            'interns' => $this->users->byRole('intern', ['id', 'name', 'email']),
            'mentors' => $this->users->byRole('mentor', ['id', 'name', 'email']),
            'paths' => $this->paths->activeList(['id', 'name']),
        ]);
    }

    public function store(StoreEnrollmentRequest $request, EnrollIntern $enrollIntern): RedirectResponse
    {
        $intern = $this->users->findById($request->validated('user_id'));
        $path = $this->paths->findById($request->validated('learning_path_id'));

        $mentor = $request->validated('mentor_id')
            ? $this->users->findById($request->validated('mentor_id'))
            : null;

        $enrollIntern->execute($intern, $path, $mentor);

        return back();
    }
}
