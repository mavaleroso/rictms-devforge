<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Admin\CreateUser;
use App\Actions\Admin\DeleteUser;
use App\Actions\Admin\UpdateUser;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreUserRequest;
use App\Http\Requests\Admin\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Repositories\Contracts\UserRepository;
use App\Services\Admin\UserService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function __construct(
        private readonly UserRepository $users,
        private readonly UserService $userService,
    ) {}

    public function index(Request $request): Response
    {
        $this->authorize('viewAny', User::class);

        return Inertia::render('admin/users/index', [
            'stats' => [
                'total' => User::count(),
                'admins' => $this->users->countByRole('admin'),
                'mentors' => $this->users->countByRole('mentor'),
                'interns' => $this->users->countByRole('intern'),
            ],
        ]);
    }

    public function table(Request $request): AnonymousResourceCollection
    {
        $this->authorize('viewAny', User::class);

        $validated = $request->validate([
            'page' => ['sometimes', 'integer', 'min:1'],
            'per_page' => ['sometimes', 'integer', 'min:5', 'max:100'],
            'sort' => ['sometimes', 'nullable', 'string', 'in:name,email,created_at'],
            'direction' => ['sometimes', 'string', 'in:asc,desc'],
            'search' => ['sometimes', 'nullable', 'string', 'max:255'],
        ]);

        $users = $this->users->paginateWithRoles(
            perPage: $validated['per_page'] ?? 15,
            search: $validated['search'] ?? null,
            sort: $validated['sort'] ?? null,
            direction: $validated['direction'] ?? 'asc',
        );

        return UserResource::collection($users);
    }

    public function updateActive(Request $request, User $user): UserResource
    {
        $this->authorize('update', $user);

        $validated = $request->validate([
            'is_active' => ['required', 'boolean'],
        ]);

        $updated = $this->userService->setActiveStatus(
            $user,
            $request->user(),
            $validated['is_active'],
        );

        $updated->loadCount(['enrollments', 'mentoredEnrollments']);

        return new UserResource($updated->load('roles'));
    }

    public function create(): Response
    {
        $this->authorize('create', User::class);

        return Inertia::render('admin/users/create');
    }

    public function store(StoreUserRequest $request, CreateUser $createUser): RedirectResponse
    {
        $user = $createUser->execute(
            $request->safe()->except(['avatar']),
            $request->file('avatar'),
        );

        return to_route('admin.users.edit', $user);
    }

    public function edit(User $user): Response
    {
        $this->authorize('update', $user);

        $user->load('roles')->loadCount(['enrollments', 'mentoredEnrollments']);

        return Inertia::render('admin/users/edit', [
            'user' => new UserResource($user),
        ]);
    }

    public function update(UpdateUserRequest $request, User $user, UpdateUser $updateUser): RedirectResponse
    {
        $updated = $updateUser->execute(
            $user,
            $request->safe()->except(['avatar', 'remove_avatar']),
            $request->file('avatar'),
            $request->boolean('remove_avatar'),
        );

        return to_route('admin.users.edit', $updated);
    }

    public function destroy(Request $request, User $user, DeleteUser $deleteUser): RedirectResponse
    {
        $this->authorize('delete', $user);

        $deleteUser->execute($user, $request->user());

        return to_route('admin.users.index');
    }
}
