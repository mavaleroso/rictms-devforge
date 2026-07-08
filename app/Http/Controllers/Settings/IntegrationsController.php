<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\UpdateGitHubIntegrationRequest;
use App\Services\Integrations\GitHub\GitHubAccountService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class IntegrationsController extends Controller
{
    public function __construct(
        private readonly GitHubAccountService $github,
    ) {}

    public function edit(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('settings/integrations', [
            'github' => [
                'connected' => $this->github->isConnected($user),
                'username' => $user->github_username,
            ],
            'evaluation' => [
                'driver' => config('evaluation.driver', 'local'),
            ],
        ]);
    }

    public function updateGitHub(UpdateGitHubIntegrationRequest $request): RedirectResponse
    {
        $this->github->connect(
            $request->user(),
            $request->validated('github_username'),
            $request->validated('github_token'),
        );

        return to_route('integrations.edit');
    }

    public function destroyGitHub(Request $request): RedirectResponse
    {
        $this->github->disconnect($request->user());

        return to_route('integrations.edit');
    }
}
