<?php

use App\Http\Controllers\Mentor\InternController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'role:mentor'])->prefix('mentor')->name('mentor.')->group(function () {
    Route::get('interns', [InternController::class, 'index'])->name('interns.index');
    Route::get('interns/{intern}', [InternController::class, 'show'])->name('interns.show');
    Route::get('reviews', [\App\Http\Controllers\Mentor\ReviewController::class, 'index'])->name('reviews.index');
    Route::get('reviews/{submission}', [\App\Http\Controllers\Mentor\ReviewController::class, 'show'])->name('reviews.show');
    Route::patch('reviews/{submission}', [\App\Http\Controllers\Mentor\ReviewController::class, 'update'])->name('reviews.update');
    Route::get('capstone-reviews', [\App\Http\Controllers\Mentor\CapstoneReviewController::class, 'index'])->name('capstone-reviews.index');
    Route::get('capstone-reviews/{milestone}', [\App\Http\Controllers\Mentor\CapstoneReviewController::class, 'show'])->name('capstone-reviews.show');
    Route::patch('capstone-reviews/{milestone}', [\App\Http\Controllers\Mentor\CapstoneReviewController::class, 'update'])->name('capstone-reviews.update');
});
