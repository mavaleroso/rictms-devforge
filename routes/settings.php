<?php

use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('auth')->group(function () {
    Route::redirect('settings', 'settings/profile');

    Route::get('settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('settings/profile', [ProfileController::class, 'update'])->name('profile.update');

    Route::get('settings/password', [PasswordController::class, 'edit'])->name('password.edit');
    Route::put('settings/password', [PasswordController::class, 'update'])->name('password.update');

    Route::get('settings/appearance', function () {
        return Inertia::render('settings/appearance');
    })->name('appearance');

    Route::get('settings/integrations', [\App\Http\Controllers\Settings\IntegrationsController::class, 'edit'])->name('integrations.edit');
    Route::patch('settings/integrations/github', [\App\Http\Controllers\Settings\IntegrationsController::class, 'updateGitHub'])->name('integrations.github.update');
    Route::delete('settings/integrations/github', [\App\Http\Controllers\Settings\IntegrationsController::class, 'destroyGitHub'])->name('integrations.github.destroy');
});
