<?php

namespace App\Http\Controllers\Auth;

use App\Actions\Auth\RegisterUser;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    /**
     * Handle an incoming registration request.
     */
    public function store(RegisterRequest $request, RegisterUser $registerUser): RedirectResponse
    {
        $validated = $request->validated();

        $user = $registerUser->execute(
            name: $validated['name'],
            email: $validated['email'],
            password: $validated['password'],
        );

        Auth::login($user);

        return to_route('dashboard');
    }
}
