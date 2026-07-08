<?php

namespace App\Services\Integrations\GitHub;

use App\Models\User;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Http;
use Illuminate\Validation\ValidationException;

final class GitHubAccountService
{
    public function isConnected(User $user): bool
    {
        return $user->github_username !== null && $user->github_token !== null;
    }

    public function connect(User $user, string $username, string $token): User
    {
        $username = ltrim(trim($username), '@');

        if ($username === '' || trim($token) === '') {
            throw ValidationException::withMessages([
                'github_username' => 'GitHub username and token are required.',
            ]);
        }

        $user->update([
            'github_username' => $username,
            'github_token' => Crypt::encryptString(trim($token)),
        ]);

        return $user->fresh();
    }

    public function disconnect(User $user): User
    {
        $user->update([
            'github_id' => null,
            'github_username' => null,
            'github_token' => null,
        ]);

        return $user->fresh();
    }

    public function token(User $user): ?string
    {
        if (! $user->github_token) {
            return null;
        }

        try {
            return Crypt::decryptString($user->github_token);
        } catch (\Throwable) {
            return null;
        }
    }
}
