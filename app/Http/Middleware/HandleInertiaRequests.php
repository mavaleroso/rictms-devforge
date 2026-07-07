<?php

namespace App\Http\Middleware;

use App\Http\Resources\EnrollmentResource;
use App\Repositories\Contracts\EnrollmentRepository;
use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    public function __construct(
        private readonly EnrollmentRepository $enrollments,
    ) {}

    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        $user = $request->user();
        $enrollment = $user?->isIntern()
            ? $this->enrollments->findActiveForUser($user)?->load(['learningPath', 'levelProgress.level'])
            : null;

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $user,
                'roles' => $user?->getRoleNames() ?? [],
            ],
            'enrollment' => $enrollment ? new EnrollmentResource($enrollment) : null,
            'flash' => [
                'quiz_result' => fn () => $request->session()->get('quiz_result'),
            ],
        ];
    }
}
