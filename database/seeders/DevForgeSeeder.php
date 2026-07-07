<?php

namespace Database\Seeders;

use App\Enums\EnrollmentStatus;
use App\Enums\LevelDifficulty;
use App\Enums\MaterialType;
use App\Enums\ProgressStatus;
use App\Enums\QuestionType;
use App\Enums\VideoProvider;
use App\Models\Enrollment;
use App\Models\LearningMaterial;
use App\Models\LearningPath;
use App\Models\Level;
use App\Models\LevelProgress;
use App\Models\Quiz;
use App\Models\QuizOption;
use App\Models\QuizQuestion;
use App\Models\User;
use App\Models\Video;
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

        $admin = User::factory()->create([
            'name' => 'DevForge Admin',
            'email' => 'admin@devforge.test',
            'password' => Hash::make('password'),
        ]);
        $admin->assignRole('admin');

        $mentors = collect([
            ['name' => 'Mentor One', 'email' => 'mentor1@devforge.test'],
            ['name' => 'Mentor Two', 'email' => 'mentor2@devforge.test'],
        ])->map(function (array $data) {
            $user = User::factory()->create([
                ...$data,
                'password' => Hash::make('password'),
            ]);
            $user->assignRole('mentor');

            return $user;
        });

        $interns = collect([
            ['name' => 'Intern Alpha', 'email' => 'intern1@devforge.test'],
            ['name' => 'Intern Beta', 'email' => 'intern2@devforge.test'],
            ['name' => 'Intern Gamma', 'email' => 'intern3@devforge.test'],
        ])->map(function (array $data) {
            $user = User::factory()->create([
                ...$data,
                'password' => Hash::make('password'),
            ]);
            $user->assignRole('intern');

            return $user;
        });

        $path = LearningPath::create([
            'name' => 'Laravel + Inertia Full Stack',
            'slug' => 'laravel-inertia-full-stack',
            'description' => 'Master Laravel 12 with Inertia.js, React, and Catalyst UI following company standards.',
            'icon' => 'laravel',
            'is_active' => true,
            'sort_order' => 1,
        ]);

        $levelTitles = [
            1 => 'Introduction to Programming Fundamentals',
            2 => 'PHP & Laravel Basics',
            3 => 'Routing & Controllers',
            4 => 'Eloquent ORM',
            5 => 'Migrations & Seeders',
            6 => 'Form Requests & Validation',
            7 => 'Authentication & Authorization',
            8 => 'Inertia.js Fundamentals',
            9 => 'React Components with Catalyst',
            10 => 'State Management Patterns',
            11 => 'API Design Standards',
            12 => 'Testing with Pest',
            13 => 'Queue & Jobs',
            14 => 'File Storage',
            15 => 'Email & Notifications',
            16 => 'Performance & Caching',
            17 => 'Security Best Practices',
            18 => 'Deployment Workflow',
            19 => 'Code Review Standards',
            20 => 'Capstone Project',
        ];

        $levels = [];

        foreach ($levelTitles as $number => $title) {
            $levels[$number] = Level::create([
                'learning_path_id' => $path->id,
                'number' => $number,
                'title' => $title,
                'overview' => "Level {$number}: {$title}",
                'objectives' => "- Understand core concepts\n- Apply best practices\n- Complete hands-on exercises",
                'expected_outcome' => 'You can demonstrate competency in this level\'s topics.',
                'estimated_minutes' => 120,
                'difficulty' => match (true) {
                    $number <= 5 => LevelDifficulty::Beginner,
                    $number <= 12 => LevelDifficulty::Intermediate,
                    $number <= 18 => LevelDifficulty::Advanced,
                    default => LevelDifficulty::Expert,
                },
                'sort_order' => $number,
            ]);
        }

        $this->seedLevelContent($levels[1], 'Laravel Environment Setup', true);
        $this->seedLevelContent($levels[2], 'PHP Syntax & OOP', false);
        $this->seedLevelContent($levels[3], 'HTTP & REST Fundamentals', false);

        $enrollment = Enrollment::create([
            'user_id' => $interns[0]->id,
            'learning_path_id' => $path->id,
            'mentor_id' => $mentors[0]->id,
            'status' => EnrollmentStatus::Active,
            'started_at' => now(),
        ]);

        foreach ($levels as $number => $level) {
            LevelProgress::create([
                'enrollment_id' => $enrollment->id,
                'level_id' => $level->id,
                'status' => $number === 1 ? ProgressStatus::InProgress : ProgressStatus::Locked,
            ]);
        }

        Enrollment::create([
            'user_id' => $interns[1]->id,
            'learning_path_id' => $path->id,
            'mentor_id' => $mentors[1]->id,
            'status' => EnrollmentStatus::Active,
            'started_at' => now()->subDays(3),
        ]);

        foreach ($levels as $number => $level) {
            LevelProgress::create([
                'enrollment_id' => Enrollment::where('user_id', $interns[1]->id)->first()->id,
                'level_id' => $level->id,
                'status' => $number === 1 ? ProgressStatus::Available : ProgressStatus::Locked,
            ]);
        }
    }

    private function seedLevelContent(Level $level, string $topic, bool $detailed): void
    {
        LearningMaterial::create([
            'level_id' => $level->id,
            'type' => MaterialType::Markdown,
            'title' => "{$topic} — Lesson",
            'content' => "# {$topic}\n\nWelcome to **DevForge**. This lesson covers {$topic}.\n\n## Objectives\n\n- Learn the fundamentals\n- Follow company coding standards\n- Complete the quiz below\n\n## Company Standards\n\nAlways use Form Requests, Actions, and thin controllers.",
            'sort_order' => 1,
        ]);

        if ($detailed) {
            LearningMaterial::create([
                'level_id' => $level->id,
                'type' => MaterialType::Standard,
                'title' => 'Company Git Workflow',
                'content' => "Branch naming: `feature/TICKET-description`\n\nCommit format: `type(scope): message`",
                'sort_order' => 2,
            ]);
        }

        Video::create([
            'level_id' => $level->id,
            'title' => "{$topic} Walkthrough",
            'provider' => VideoProvider::Youtube,
            'url' => 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            'sort_order' => 1,
        ]);

        $quiz = Quiz::create([
            'level_id' => $level->id,
            'title' => "Level {$level->number} Quiz",
            'passing_score' => 80,
            'max_attempts' => 3,
        ]);

        $q1 = QuizQuestion::create([
            'quiz_id' => $quiz->id,
            'type' => QuestionType::MultipleChoice,
            'question' => 'Which pattern should controllers follow in DevForge?',
            'points' => 2,
            'sort_order' => 1,
        ]);

        QuizOption::insert([
            ['quiz_question_id' => $q1->id, 'label' => 'Fat controllers with all logic', 'is_correct' => false, 'sort_order' => 1],
            ['quiz_question_id' => $q1->id, 'label' => 'Thin controllers delegating to Actions', 'is_correct' => true, 'sort_order' => 2],
            ['quiz_question_id' => $q1->id, 'label' => 'No validation layer', 'is_correct' => false, 'sort_order' => 3],
        ]);

        QuizQuestion::create([
            'quiz_id' => $quiz->id,
            'type' => QuestionType::TrueFalse,
            'question' => 'Levels must be completed in order without skipping.',
            'points' => 1,
            'correct_answer' => 'true',
            'sort_order' => 2,
        ]);

        QuizQuestion::create([
            'quiz_id' => $quiz->id,
            'type' => QuestionType::Identification,
            'question' => 'What UI kit does DevForge use? (one word)',
            'points' => 1,
            'correct_answer' => 'Catalyst',
            'sort_order' => 3,
        ]);
    }
}
