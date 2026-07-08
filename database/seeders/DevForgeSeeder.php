<?php

namespace Database\Seeders;

use App\Enums\EnrollmentStatus;
use App\Enums\ProgressStatus;
use App\Models\Enrollment;
use App\Models\LevelProgress;
use App\Models\User;
use Database\Seeders\Curriculum\LaravelInertiaCurriculum;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class DevForgeSeeder extends Seeder
{
    public function run(): void
    {
        foreach (['admin', 'mentor', 'intern'] as $role) {
            Role::firstOrCreate(['name' => $role, 'guard_name' => 'web']);
        }

        $this->call(BadgeSeeder::class);

        $this->seedUser([
            'name' => 'DevForge Admin',
            'email' => 'admin@devforge.test',
        ], 'admin');

        $mentors = collect([
            ['name' => 'Mentor One', 'email' => 'mentor1@devforge.test'],
            ['name' => 'Mentor Two', 'email' => 'mentor2@devforge.test'],
        ])->map(fn (array $data) => $this->seedUser($data, 'mentor'));

        $interns = collect([
            ['name' => 'Intern Alpha', 'email' => 'intern1@devforge.test'],
            ['name' => 'Intern Beta', 'email' => 'intern2@devforge.test'],
            ['name' => 'Intern Gamma', 'email' => 'intern3@devforge.test'],
        ])->map(fn (array $data) => $this->seedUser($data, 'intern'));

        $path = LaravelInertiaCurriculum::syncPath();
        $levels = LaravelInertiaCurriculum::syncLevels($path);
        LaravelInertiaCurriculum::syncAllContent($levels, force: true);

        $this->call(CapstoneSeeder::class);
        $this->call(CertificateSeeder::class);

        $enrollment = Enrollment::firstOrCreate(
            [
                'user_id' => $interns[0]->id,
                'learning_path_id' => $path->id,
            ],
            [
                'mentor_id' => $mentors[0]->id,
                'status' => EnrollmentStatus::Active,
                'started_at' => now(),
            ],
        );

        foreach ($levels as $number => $level) {
            LevelProgress::firstOrCreate(
                [
                    'enrollment_id' => $enrollment->id,
                    'level_id' => $level->id,
                ],
                [
                    'status' => match (true) {
                        $number === 20 => ProgressStatus::Available,
                        $number === 1 => ProgressStatus::InProgress,
                        default => ProgressStatus::Locked,
                    },
                ],
            );
        }

        LevelProgress::query()
            ->where('enrollment_id', $enrollment->id)
            ->whereHas('level', fn ($q) => $q->where('number', 20))
            ->update(['status' => ProgressStatus::Available]);

        $secondEnrollment = Enrollment::firstOrCreate(
            [
                'user_id' => $interns[1]->id,
                'learning_path_id' => $path->id,
            ],
            [
                'mentor_id' => $mentors[1]->id,
                'status' => EnrollmentStatus::Active,
                'started_at' => now()->subDays(3),
            ],
        );

        foreach ($levels as $number => $level) {
            LevelProgress::firstOrCreate(
                [
                    'enrollment_id' => $secondEnrollment->id,
                    'level_id' => $level->id,
                ],
                [
                    'status' => $number === 1 ? ProgressStatus::Available : ProgressStatus::Locked,
                ],
            );
        }
    }

    /** @param  array{name: string, email: string}  $data */
    private function seedUser(array $data, string $role): User
    {
        $user = User::firstOrCreate(
            ['email' => $data['email']],
            [
                'name' => $data['name'],
                'password' => Hash::make('password'),
            ],
        );

        if (! $user->hasRole($role)) {
            $user->assignRole($role);
        }

        return $user;
    }
}
