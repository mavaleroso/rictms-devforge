<?php

use App\Http\Controllers\Learn\CapstoneController;
use App\Http\Controllers\Learn\CertificateController;
use App\Http\Controllers\Learn\ChallengeController;
use App\Http\Controllers\Learn\LeaderboardController;
use App\Http\Controllers\Learn\LevelController;
use App\Http\Controllers\Learn\MaterialController;
use App\Http\Controllers\Learn\PathController;
use App\Http\Controllers\Learn\QuizController;
use App\Http\Controllers\Learn\VideoController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'role:intern'])->prefix('learn')->name('learn.')->group(function () {
    Route::get('paths', [PathController::class, 'index'])->name('paths.index');
    Route::get('paths/{path}', [PathController::class, 'show'])->name('paths.show');
    Route::post('paths/{path}/enroll', [PathController::class, 'enroll'])->name('paths.enroll');

    Route::get('paths/{path}/levels/{level}', [LevelController::class, 'show'])->name('levels.show');
    Route::get('materials/{material}', [MaterialController::class, 'show'])->name('materials.show');
    Route::get('material-files/{file}', [MaterialController::class, 'downloadFile'])->name('material-files.download');
    Route::post('materials/{material}/complete', [LevelController::class, 'completeMaterial'])->name('materials.complete');
    Route::get('videos/{video}', [VideoController::class, 'show'])->name('videos.show');
    Route::post('videos/{video}/complete', [LevelController::class, 'completeVideo'])->name('videos.complete');

    Route::get('quizzes/{quiz}', [QuizController::class, 'show'])->name('quizzes.show');
    Route::post('quizzes/{quiz}/submit', [QuizController::class, 'submit'])->name('quizzes.submit');

    Route::get('challenges/{challenge}', [ChallengeController::class, 'show'])->name('challenges.show');
    Route::post('challenges/{challenge}/run', [ChallengeController::class, 'run'])->name('challenges.run');
    Route::post('challenges/{challenge}/submit', [ChallengeController::class, 'submit'])->name('challenges.submit');
    Route::get('challenges/submissions/{submission}', [ChallengeController::class, 'submissionStatus'])->name('challenges.submissions.show');

    Route::post('tutor/messages', [\App\Http\Controllers\Learn\TutorController::class, 'store'])->name('tutor.messages.store');
    Route::get('tutor/sessions/{session}', [\App\Http\Controllers\Learn\TutorController::class, 'show'])->name('tutor.sessions.show');

    Route::get('leaderboard', [LeaderboardController::class, 'index'])->name('leaderboard.index');

    Route::get('certificates', [CertificateController::class, 'index'])->name('certificates.index');
    Route::get('certificates/{certificate}', [CertificateController::class, 'show'])->name('certificates.show');
    Route::get('certificates/{certificate}/download', [CertificateController::class, 'download'])->name('certificates.download');

    Route::get('capstone', [CapstoneController::class, 'show'])->name('capstone.show');
    Route::post('capstone/start', [CapstoneController::class, 'start'])->name('capstone.start');
    Route::get('capstone/board', [CapstoneController::class, 'board'])->name('capstone.board');
    Route::post('capstone/tasks', [CapstoneController::class, 'storeTask'])->name('capstone.tasks.store');
    Route::patch('capstone/tasks/{task}', [CapstoneController::class, 'updateTask'])->name('capstone.tasks.update');
    Route::get('capstone/journal', [CapstoneController::class, 'journal'])->name('capstone.journal');
    Route::post('capstone/journal', [CapstoneController::class, 'storeJournal'])->name('capstone.journal.store');
    Route::post('capstone/milestones/{milestone}/submit', [CapstoneController::class, 'submitMilestone'])->name('capstone.milestones.submit');
});
