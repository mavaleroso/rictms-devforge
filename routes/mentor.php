<?php

use App\Http\Controllers\Mentor\InternController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'role:mentor'])->prefix('mentor')->name('mentor.')->group(function () {
    Route::get('interns', [InternController::class, 'index'])->name('interns.index');
    Route::get('interns/{intern}', [InternController::class, 'show'])->name('interns.show');
});
