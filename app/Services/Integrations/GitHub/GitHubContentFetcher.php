<?php

namespace App\Services\Integrations\GitHub;

use App\Models\User;
use Illuminate\Support\Facades\Http;
use Illuminate\Validation\ValidationException;

final class GitHubContentFetcher
{
    public function __construct(
        private readonly GitHubAccountService $accounts,
    ) {}

    /**
     * @return array{code: string, commit_sha: string|null}
     */
    public function fetchFile(
        User $user,
        string $owner,
        string $repo,
        string $path,
        string $ref = 'main',
    ): array {
        $owner = trim($owner);
        $repo = trim($repo);
        $path = ltrim(trim($path), '/');
        $ref = trim($ref) ?: 'main';

        if ($owner === '' || $repo === '' || $path === '') {
            throw ValidationException::withMessages([
                'github_path' => 'Repository owner, name, and file path are required.',
            ]);
        }

        $token = $this->accounts->token($user);

        $response = Http::withHeaders($this->headers($token))
            ->accept('application/vnd.github.raw')
            ->get("https://api.github.com/repos/{$owner}/{$repo}/contents/{$path}", [
                'ref' => $ref,
            ]);

        if (! $response->successful()) {
            throw ValidationException::withMessages([
                'github_path' => 'Could not fetch file from GitHub. Check repo, branch, and path.',
            ]);
        }

        $commitSha = $this->resolveCommitSha($owner, $repo, $ref, $token);

        return [
            'code' => $response->body(),
            'commit_sha' => $commitSha,
        ];
    }

    /** @return array<string, string> */
    private function headers(?string $token): array
    {
        $headers = [
            'User-Agent' => config('app.name', 'DevForge'),
        ];

        if ($token) {
            $headers['Authorization'] = 'Bearer '.$token;
        }

        return $headers;
    }

    private function resolveCommitSha(string $owner, string $repo, string $ref, ?string $token): ?string
    {
        $response = Http::withHeaders($this->headers($token))
            ->get("https://api.github.com/repos/{$owner}/{$repo}/commits/{$ref}");

        return $response->successful() ? $response->json('sha') : null;
    }
}
