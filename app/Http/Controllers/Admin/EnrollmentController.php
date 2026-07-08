<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Learning\EnrollIntern;
use App\Enums\EnrollmentStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreEnrollmentRequest;
use App\Http\Resources\EnrollmentResource;
use App\Models\Enrollment;
use App\Repositories\Contracts\EnrollmentRepository;
use App\Repositories\Contracts\LearningPathRepository;
use App\Repositories\Contracts\UserRepository;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
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
            'stats' => [
                'total' => Enrollment::count(),
                'active' => $this->enrollments->countByStatus(EnrollmentStatus::Active),
                'completed' => $this->enrollments->countByStatus(EnrollmentStatus::Completed),
                'with_mentor' => $this->enrollments->countWithMentor(),
            ],
            'interns' => $this->users->byRole('intern', ['id', 'name', 'first_name', 'middle_name', 'last_name', 'email']),
            'mentors' => $this->users->byRole('mentor', ['id', 'name', 'first_name', 'middle_name', 'last_name', 'email']),
            'paths' => $this->paths->activeList(['id', 'name']),
        ]);
    }

    public function table(Request $request): AnonymousResourceCollection
    {
        $this->authorize('viewAny', Enrollment::class);

        $validated = $request->validate([
            'page' => ['sometimes', 'integer', 'min:1'],
            'per_page' => ['sometimes', 'integer', 'min:5', 'max:100'],
            'sort' => ['sometimes', 'nullable', 'string', 'in:started_at,status'],
            'direction' => ['sometimes', 'string', 'in:asc,desc'],
            'search' => ['sometimes', 'nullable', 'string', 'max:255'],
        ]);

        $enrollments = $this->enrollments->paginateWithRelations(
            perPage: $validated['per_page'] ?? 15,
            search: $validated['search'] ?? null,
            sort: $validated['sort'] ?? null,
            direction: $validated['direction'] ?? 'desc',
        );

        return EnrollmentResource::collection($enrollments);
    }

    public function store(StoreEnrollmentRequest $request, EnrollIntern $enrollIntern): RedirectResponse
    {
        $intern = $this->users->findById($request->validated('user_id'));
        $path = $this->paths->findById($request->validated('learning_path_id'));

        $mentor = $request->validated('mentor_id')
            ? $this->users->findById($request->validated('mentor_id'))
            : null;

        $enrollIntern->execute($intern, $path, $mentor);

        return to_route('admin.enrollments.index');
    }
}
