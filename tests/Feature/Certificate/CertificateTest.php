<?php

use App\Enums\EnrollmentStatus;
use App\Models\Certificate;
use App\Services\Certificate\CertificateService;
use Illuminate\Support\Facades\Notification;

test('completing level 20 issues a certificate', function () {
    Notification::fake();

    $intern = userWithRole('intern');

    $path = \App\Models\LearningPath::create([
        'name' => 'Cert Path',
        'slug' => 'cert-path',
        'is_active' => true,
    ]);

    $level = \App\Models\Level::create([
        'learning_path_id' => $path->id,
        'number' => 20,
        'title' => 'Final Level',
        'estimated_minutes' => 60,
        'difficulty' => 'advanced',
    ]);

    $enrollment = app(\App\Actions\Learning\EnrollIntern::class)->execute($intern, $path);

    $enrollment->levelProgress()->where('level_id', $level->id)->update([
        'status' => \App\Enums\ProgressStatus::InProgress,
    ]);

    $quiz = \App\Models\Quiz::create([
        'level_id' => $level->id,
        'title' => 'Final Quiz',
        'passing_score' => 50,
        'max_attempts' => 3,
    ]);

    $question = \App\Models\QuizQuestion::create([
        'quiz_id' => $quiz->id,
        'type' => \App\Enums\QuestionType::Identification,
        'question' => 'Answer',
        'points' => 1,
        'correct_answer' => 'done',
    ]);

    app(\App\Actions\Quiz\GradeQuizAttempt::class)->execute($intern, $quiz, [
        $question->id => 'done',
    ]);

    expect($enrollment->fresh()->status)->toBe(EnrollmentStatus::Completed)
        ->and(Certificate::query()->where('enrollment_id', $enrollment->id)->exists())->toBeTrue();

    Notification::assertSentTo($intern, \App\Notifications\CertificateIssuedNotification::class);
});

test('public verification page shows valid certificate', function () {
    $intern = userWithRole('intern');
    $path = \App\Models\LearningPath::create(['name' => 'Verify Path', 'slug' => 'verify-path', 'is_active' => true]);

    $enrollment = \App\Models\Enrollment::create([
        'user_id' => $intern->id,
        'learning_path_id' => $path->id,
        'status' => EnrollmentStatus::Completed,
        'started_at' => now()->subDays(10),
        'completed_at' => now(),
    ]);

    $certificate = app(CertificateService::class)->issueForEnrollment($enrollment);

    $this->get(route('certificates.verify', $certificate->verification_code))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('certificates/verify')
            ->where('valid', true)
            ->where('certificate.certificate_number', $certificate->certificate_number));
});

test('invalid verification code shows failure', function () {
    $this->get(route('certificates.verify', 'invalid-code-123'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('certificates/verify')
            ->where('valid', false));
});

test('intern can view certificates page', function () {
    $intern = userWithRole('intern');

    $this->actingAs($intern)
        ->get(route('learn.certificates.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('learn/certificates/index'));
});

test('admin can view analytics dashboard', function () {
    $admin = userWithRole('admin');

    $this->actingAs($admin)
        ->get(route('admin.analytics.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/analytics/index')
            ->has('stats')
            ->has('trend'));
});

test('admin can export completions csv', function () {
    $admin = userWithRole('admin');

    $this->actingAs($admin)
        ->get(route('admin.analytics.export'))
        ->assertOk()
        ->assertHeader('content-type', 'text/csv; charset=UTF-8');
});
