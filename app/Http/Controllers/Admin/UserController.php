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
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function __construct(
        private readonly UserRepository $users,
    ) {}

    public function index(Request $request): Response
    {
        $this->authorize('viewAny', User::class);

        $users = $this->users->listWithRoles();

        return Inertia::render('admin/users/index', [
            'users' => UserResource::collection($users),
            'stats' => [
                'total' => $users->count(),
                'admins' => $this->users->countByRole('admin'),
                'mentors' => $this->users->countByRole('mentor'),
                'interns' => $this->users->countByRole('intern'),
            ],
        ]);
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
