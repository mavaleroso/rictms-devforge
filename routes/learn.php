<?php

use App\Http\Controllers\Learn\LevelController;
use App\Http\Controllers\Learn\PathController;
use App\Http\Controllers\Learn\QuizController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'role:intern'])->prefix('learn')->name('learn.')->group(function () {
    Route::get('paths', [PathController::class, 'index'])->name('paths.index');
    Route::get('paths/{path}', [PathController::class, 'show'])->name('paths.show');
    Route::post('paths/{path}/enroll', [PathController::class, 'enroll'])->name('paths.enroll');

    Route::get('paths/{path}/levels/{level}', [LevelController::class, 'show'])->name('levels.show');
    Route::post('materials/{material}/complete', [LevelController::class, 'completeMaterial'])->name('materials.complete');
    Route::post('videos/{video}/complete', [LevelController::class, 'completeVideo'])->name('videos.complete');

    Route::get('quizzes/{quiz}', [QuizController::class, 'show'])->name('quizzes.show');
    Route::post('quizzes/{quiz}/submit', [QuizController::class, 'submit'])->name('quizzes.submit');
});
