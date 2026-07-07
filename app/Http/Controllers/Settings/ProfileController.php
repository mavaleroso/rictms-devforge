<?php

namespace App\Http\Controllers\Settings;

use App\Actions\Settings\DeleteUserAccount;
use App\Actions\Settings\UpdateUserProfile;
use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\DeleteAccountRequest;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('settings/profile', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Update the user's profile settings.
     */
    public function update(ProfileUpdateRequest $request, UpdateUserProfile $updateUserProfile): RedirectResponse
    {
        $updateUserProfile->execute($request->user(), $request->validated());

        return to_route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(DeleteAccountRequest $request, DeleteUserAccount $deleteUserAccount): RedirectResponse
    {
        $user = $request->user();

        Auth::logout();

        $deleteUserAccount->execute($user);

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
