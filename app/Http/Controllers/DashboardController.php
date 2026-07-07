<?php

namespace App\Http\Controllers;

use App\Services\Learning\DashboardService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(
        private readonly DashboardService $dashboard,
    ) {}

    public function __invoke(Request $request): Response
    {
        $user = $request->user();

        if ($user->isAdmin()) {
            return Inertia::render('dashboard', [
                'stats' => $this->dashboard->adminStats(),
                'role' => 'admin',
            ]);
        }

        if ($user->isMentor()) {
            return Inertia::render('dashboard', $this->dashboard->mentorData($user));
        }

        return Inertia::render('dashboard', $this->dashboard->internData($user));
    }
}
