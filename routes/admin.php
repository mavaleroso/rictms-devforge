<?php

use App\Http\Controllers\Admin\AnalyticsController;
use App\Http\Controllers\Admin\CapstoneTemplateController;
use App\Http\Controllers\Admin\EnrollmentController;
use App\Http\Controllers\Admin\LearningPathController;
use App\Http\Controllers\Admin\LevelContentController;
use App\Http\Controllers\Admin\LevelController;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('paths', [LearningPathController::class, 'index'])->name('paths.index');
    Route::get('paths/create', [LearningPathController::class, 'create'])->name('paths.create');
    Route::post('paths', [LearningPathController::class, 'store'])->name('paths.store');
    Route::get('paths/{path}/edit', [LearningPathController::class, 'edit'])->name('paths.edit');
    Route::patch('paths/{path}', [LearningPathController::class, 'update'])->name('paths.update');
    Route::delete('paths/{path}', [LearningPathController::class, 'destroy'])->name('paths.destroy');

    Route::post('paths/{path}/levels', [LevelController::class, 'store'])->name('levels.store');
    Route::get('paths/{path}/levels/{level}/edit', [LevelController::class, 'edit'])->name('levels.edit');
    Route::patch('paths/{path}/levels/{level}', [LevelController::class, 'update'])->name('levels.update');

    Route::post('paths/{path}/levels/{level}/materials', [LevelContentController::class, 'storeMaterial'])->name('materials.store');
    Route::patch('materials/{material}', [LevelContentController::class, 'updateMaterial'])->name('materials.update');
    Route::delete('materials/{material}', [LevelContentController::class, 'destroyMaterial'])->name('materials.destroy');

    Route::post('paths/{path}/levels/{level}/videos', [LevelContentController::class, 'storeVideo'])->name('videos.store');
    Route::patch('videos/{video}', [LevelContentController::class, 'updateVideo'])->name('videos.update');
    Route::delete('videos/{video}', [LevelContentController::class, 'destroyVideo'])->name('videos.destroy');

    Route::patch('paths/{path}/levels/{level}/quiz', [LevelContentController::class, 'updateQuiz'])->name('quiz.update');
    Route::post('quizzes/{quiz}/questions', [LevelContentController::class, 'storeQuestion'])->name('questions.store');
    Route::patch('questions/{question}', [LevelContentController::class, 'updateQuestion'])->name('questions.update');
    Route::delete('questions/{question}', [LevelContentController::class, 'destroyQuestion'])->name('questions.destroy');

    Route::patch('paths/{path}/levels/{level}/challenge', [\App\Http\Controllers\Admin\ChallengeContentController::class, 'updateChallenge'])->name('challenge.update');
    Route::post('challenges/{challenge}/test-cases', [\App\Http\Controllers\Admin\ChallengeContentController::class, 'storeTestCase'])->name('challenge-test-cases.store');
    Route::patch('challenge-test-cases/{testCase}', [\App\Http\Controllers\Admin\ChallengeContentController::class, 'updateTestCase'])->name('challenge-test-cases.update');
    Route::delete('challenge-test-cases/{testCase}', [\App\Http\Controllers\Admin\ChallengeContentController::class, 'destroyTestCase'])->name('challenge-test-cases.destroy');

    Route::get('users', [UserController::class, 'index'])->name('users.index');
    Route::get('users/table', [UserController::class, 'table'])->name('users.table');
    Route::patch('users/{user}/active', [UserController::class, 'updateActive'])->name('users.update-active');
    Route::get('users/create', [UserController::class, 'create'])->name('users.create');
    Route::post('users', [UserController::class, 'store'])->name('users.store');
    Route::get('users/{user}/edit', [UserController::class, 'edit'])->name('users.edit');
    Route::patch('users/{user}', [UserController::class, 'update'])->name('users.update');
    Route::delete('users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
    Route::get('enrollments', [EnrollmentController::class, 'index'])->name('enrollments.index');
    Route::get('enrollments/table', [EnrollmentController::class, 'table'])->name('enrollments.table');
    Route::post('enrollments', [EnrollmentController::class, 'store'])->name('enrollments.store');

    Route::get('analytics', [AnalyticsController::class, 'index'])->name('analytics.index');
    Route::get('analytics/table', [AnalyticsController::class, 'table'])->name('analytics.table');
    Route::get('analytics/export', [AnalyticsController::class, 'export'])->name('analytics.export');

    Route::get('capstone-templates', [CapstoneTemplateController::class, 'index'])->name('capstone-templates.index');
    Route::get('capstone-templates/{template}/edit', [CapstoneTemplateController::class, 'edit'])->name('capstone-templates.edit');
    Route::patch('capstone-templates/{template}', [CapstoneTemplateController::class, 'update'])->name('capstone-templates.update');
});
