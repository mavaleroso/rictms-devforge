<?php

namespace Database\Seeders;

use App\Enums\EnrollmentStatus;
use App\Enums\ProgressStatus;
use App\Models\Enrollment;
use App\Models\LearningPath;
use App\Models\LevelProgress;
use App\Models\User;
use App\Services\Certificate\CertificateService;
use Illuminate\Database\Seeder;

class CertificateSeeder extends Seeder
{
    public function run(): void
    {
        $intern = User::query()->where('email', 'intern3@devforge.test')->first();
        $path = LearningPath::query()->where('slug', 'laravel-inertia-full-stack')->first();

        if (! $intern || ! $path) {
            return;
        }

        $enrollment = Enrollment::firstOrCreate(
            [
                'user_id' => $intern->id,
                'learning_path_id' => $path->id,
            ],
            [
                'mentor_id' => User::query()->where('email', 'mentor2@devforge.test')->value('id'),
                'status' => EnrollmentStatus::Completed,
                'started_at' => now()->subDays(45),
                'completed_at' => now()->subDays(2),
            ],
        );

        $enrollment->update([
            'status' => EnrollmentStatus::Completed,
            'started_at' => $enrollment->started_at ?? now()->subDays(45),
            'completed_at' => $enrollment->completed_at ?? now()->subDays(2),
        ]);

        LevelProgress::query()
            ->where('enrollment_id', $enrollment->id)
            ->update(['status' => ProgressStatus::Completed]);

        app(CertificateService::class)->issueForEnrollment($enrollment->fresh());
    }
}
