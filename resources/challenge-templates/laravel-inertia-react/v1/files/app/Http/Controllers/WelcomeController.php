<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class WelcomeController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('welcome', [
            'appName' => config('app.name', 'DevForge Lab'),
            'tagline' => 'Ship something small today.',
        ]);
    }
}
