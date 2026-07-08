<?php

namespace Database\Seeders\Curriculum;

use App\Enums\QuestionType;

final class LaravelInertiaQuizzes
{
    /** @return array{title: string, passing_score: int, max_attempts: int, questions: list<array<string, mixed>>} */
    public static function forLevel(int $number): array
    {
        $bank = [
            1 => [
                'title' => 'Environment & Anatomy Gate',
                'passing_score' => 80,
                'max_attempts' => 3,
                'questions' => [
                    [
                        'type' => QuestionType::MultipleChoice,
                        'question' => 'Which command generates APP_KEY?',
                        'points' => 2,
                        'options' => [
                            ['label' => 'php artisan key:generate', 'is_correct' => true],
                            ['label' => 'php artisan make:key', 'is_correct' => false],
                            ['label' => 'composer dump-autoload', 'is_correct' => false],
                            ['label' => 'npm run key', 'is_correct' => false],
                        ],
                    ],
                    [
                        'type' => QuestionType::TrueFalse,
                        'question' => '`.env` files must be committed so teammates share APP_KEY.',
                        'points' => 2,
                        'correct_answer' => 'false',
                    ],
                    [
                        'type' => QuestionType::Identification,
                        'question' => 'Which directory holds Inertia page components under resources/js? (folder name)',
                        'points' => 2,
                        'correct_answer' => 'pages',
                    ],
                    [
                        'type' => QuestionType::MultipleChoice,
                        'question' => 'Business use-cases in DevForge primarily live in…',
                        'points' => 2,
                        'options' => [
                            ['label' => 'Controllers', 'is_correct' => false],
                            ['label' => 'Actions', 'is_correct' => true],
                            ['label' => 'Blade views', 'is_correct' => false],
                            ['label' => 'public/', 'is_correct' => false],
                        ],
                    ],
                    [
                        'type' => QuestionType::TrueFalse,
                        'question' => 'Repositories abstract persistence behind contracts.',
                        'points' => 1,
                        'correct_answer' => 'true',
                    ],
                ],
            ],
            2 => [
                'title' => 'Modern PHP Proficiency',
                'passing_score' => 80,
                'max_attempts' => 3,
                'questions' => [
                    [
                        'type' => QuestionType::MultipleChoice,
                        'question' => 'Constructor property promotion is valid in…',
                        'points' => 2,
                        'options' => [
                            ['label' => 'PHP 7.0+', 'is_correct' => false],
                            ['label' => 'PHP 8.0+', 'is_correct' => true],
                            ['label' => 'Only Hack', 'is_correct' => false],
                        ],
                    ],
                    [
                        'type' => QuestionType::TrueFalse,
                        'question' => '`declare(strict_types=1);` enables coercive juggling for scalars.',
                        'points' => 2,
                        'correct_answer' => 'false',
                    ],
                    [
                        'type' => QuestionType::Identification,
                        'question' => 'Which language construct replaces many nested ternaries? (keyword)',
                        'points' => 2,
                        'correct_answer' => 'match',
                    ],
                    [
                        'type' => QuestionType::MultipleChoice,
                        'question' => 'Domain statuses like LevelDifficulty should be…',
                        'points' => 2,
                        'options' => [
                            ['label' => 'Magic strings', 'is_correct' => false],
                            ['label' => 'Backed enums', 'is_correct' => true],
                            ['label' => 'Session globals', 'is_correct' => false],
                        ],
                    ],
                ],
            ],
            3 => [
                'title' => 'Routing & Controllers',
                'passing_score' => 80,
                'max_attempts' => 3,
                'questions' => [
                    [
                        'type' => QuestionType::MultipleChoice,
                        'question' => 'Thin controllers should…',
                        'points' => 2,
                        'options' => [
                            ['label' => 'Contain Eloquent queries', 'is_correct' => false],
                            ['label' => 'Delegate to Actions after Form Requests', 'is_correct' => true],
                            ['label' => 'Send mail inline', 'is_correct' => false],
                        ],
                    ],
                    [
                        'type' => QuestionType::TrueFalse,
                        'question' => 'Named routes are optional for admin URLs.',
                        'points' => 2,
                        'correct_answer' => 'false',
                    ],
                    [
                        'type' => QuestionType::Identification,
                        'question' => 'HTTP verb for updating via spoofed multipart uploads commonly paired with POST?',
                        'points' => 2,
                        'correct_answer' => 'patch',
                    ],
                    [
                        'type' => QuestionType::MultipleChoice,
                        'question' => 'Inertia responses are returned with…',
                        'points' => 2,
                        'options' => [
                            ['label' => 'Inertia::render', 'is_correct' => true],
                            ['label' => 'view()', 'is_correct' => false],
                            ['label' => 'echo json', 'is_correct' => false],
                        ],
                    ],
                ],
            ],
            4 => [
                'title' => 'Eloquent Mastery',
                'passing_score' => 85,
                'max_attempts' => 3,
                'questions' => [
                    [
                        'type' => QuestionType::MultipleChoice,
                        'question' => 'N+1 typically appears when…',
                        'points' => 2,
                        'options' => [
                            ['label' => 'You eager load with with()', 'is_correct' => false],
                            ['label' => 'You access relations inside loops without eager loading', 'is_correct' => true],
                            ['label' => 'You use select()', 'is_correct' => false],
                        ],
                    ],
                    [
                        'type' => QuestionType::TrueFalse,
                        'question' => 'Attribute casts can map columns to enums.',
                        'points' => 2,
                        'correct_answer' => 'true',
                    ],
                    [
                        'type' => QuestionType::Identification,
                        'question' => 'Method used to eager load relations on a model instance already retrieved?',
                        'points' => 2,
                        'correct_answer' => 'load',
                    ],
                    [
                        'type' => QuestionType::MultipleChoice,
                        'question' => 'Local query scopes should be defined as…',
                        'points' => 2,
                        'options' => [
                            ['label' => 'scopeActive(Builder $query)', 'is_correct' => true],
                            ['label' => 'Global helpers only', 'is_correct' => false],
                            ['label' => 'Controller statics', 'is_correct' => false],
                        ],
                    ],
                ],
            ],
            5 => [
                'title' => 'Schema Versioning',
                'passing_score' => 80,
                'max_attempts' => 3,
                'questions' => [
                    [
                        'type' => QuestionType::TrueFalse,
                        'question' => 'Foreign keys should always cascade blindly without reading product rules.',
                        'points' => 2,
                        'correct_answer' => 'false',
                    ],
                    [
                        'type' => QuestionType::MultipleChoice,
                        'question' => 'Idempotent seeders typically use…',
                        'points' => 2,
                        'options' => [
                            ['label' => 'Model::truncate every run', 'is_correct' => false],
                            ['label' => 'firstOrCreate / updateOrCreate', 'is_correct' => true],
                            ['label' => 'Random inserts only', 'is_correct' => false],
                        ],
                    ],
                    [
                        'type' => QuestionType::Identification,
                        'question' => 'Artisan command to rebuild schema and seed?',
                        'points' => 2,
                        'correct_answer' => 'migrate:fresh',
                    ],
                    [
                        'type' => QuestionType::MultipleChoice,
                        'question' => 'Unique constraint on `(learning_path_id, number)` prevents…',
                        'points' => 2,
                        'options' => [
                            ['label' => 'Duplicate level numbers in a path', 'is_correct' => true],
                            ['label' => 'Duplicate emails', 'is_correct' => false],
                            ['label' => 'Queue failures', 'is_correct' => false],
                        ],
                    ],
                ],
            ],
            6 => [
                'title' => 'Validation Contracts',
                'passing_score' => 85,
                'max_attempts' => 3,
                'questions' => [
                    [
                        'type' => QuestionType::MultipleChoice,
                        'question' => 'Authorization for an admin Form Request belongs in…',
                        'points' => 2,
                        'options' => [
                            ['label' => 'authorize()', 'is_correct' => true],
                            ['label' => 'Blade @if', 'is_correct' => false],
                            ['label' => 'Vite config', 'is_correct' => false],
                        ],
                    ],
                    [
                        'type' => QuestionType::TrueFalse,
                        'question' => 'Actions should accept the full Request object for convenience.',
                        'points' => 2,
                        'correct_answer' => 'false',
                    ],
                    [
                        'type' => QuestionType::Identification,
                        'question' => 'Rule helper to require a field only when a condition is true?',
                        'points' => 2,
                        'correct_answer' => 'requiredIf',
                    ],
                    [
                        'type' => QuestionType::MultipleChoice,
                        'question' => 'safe()->except("file") is used to…',
                        'points' => 2,
                        'options' => [
                            ['label' => 'Strip uploaded files from validated arrays', 'is_correct' => true],
                            ['label' => 'Delete the file from disk', 'is_correct' => false],
                            ['label' => 'Bypass CSRF', 'is_correct' => false],
                        ],
                    ],
                ],
            ],
            7 => [
                'title' => 'Authz Hard Gate',
                'passing_score' => 85,
                'max_attempts' => 3,
                'questions' => [
                    [
                        'type' => QuestionType::MultipleChoice,
                        'question' => 'Who may delete learning paths?',
                        'points' => 2,
                        'options' => [
                            ['label' => 'Any authenticated user', 'is_correct' => false],
                            ['label' => 'admin role via policy', 'is_correct' => true],
                            ['label' => 'mentors', 'is_correct' => false],
                        ],
                    ],
                    [
                        'type' => QuestionType::TrueFalse,
                        'question' => 'Spatie roles replace the need for policies entirely.',
                        'points' => 2,
                        'correct_answer' => 'false',
                    ],
                    [
                        'type' => QuestionType::Identification,
                        'question' => 'Middleware package commonly used for role gates (vendor name)?',
                        'points' => 2,
                        'correct_answer' => 'spatie',
                    ],
                    [
                        'type' => QuestionType::MultipleChoice,
                        'question' => 'Interns accessing /admin/paths should receive…',
                        'points' => 2,
                        'options' => [
                            ['label' => '200', 'is_correct' => false],
                            ['label' => '403', 'is_correct' => true],
                            ['label' => '302 to youtube', 'is_correct' => false],
                        ],
                    ],
                ],
            ],
            8 => [
                'title' => 'Inertia Contracts',
                'passing_score' => 80,
                'max_attempts' => 3,
                'questions' => [
                    [
                        'type' => QuestionType::MultipleChoice,
                        'question' => 'Shared auth data is typically set in…',
                        'points' => 2,
                        'options' => [
                            ['label' => 'HandleInertiaRequests', 'is_correct' => true],
                            ['label' => 'vite.config.ts only', 'is_correct' => false],
                            ['label' => 'public/index.php', 'is_correct' => false],
                        ],
                    ],
                    [
                        'type' => QuestionType::TrueFalse,
                        'question' => 'It is acceptable to pass entire Eloquent models with hidden attributes into React.',
                        'points' => 2,
                        'correct_answer' => 'false',
                    ],
                    [
                        'type' => QuestionType::Identification,
                        'question' => 'Library that pairs Laravel with React SPA without a separate API?',
                        'points' => 2,
                        'correct_answer' => 'Inertia',
                    ],
                    [
                        'type' => QuestionType::MultipleChoice,
                        'question' => 'Partial reloads use…',
                        'points' => 2,
                        'options' => [
                            ['label' => 'only / reload options', 'is_correct' => true],
                            ['label' => 'window.location always', 'is_correct' => false],
                            ['label' => 'iframe refresh', 'is_correct' => false],
                        ],
                    ],
                ],
            ],
            9 => [
                'title' => 'Catalyst UI Standards',
                'passing_score' => 80,
                'max_attempts' => 3,
                'questions' => [
                    [
                        'type' => QuestionType::TrueFalse,
                        'question' => 'Custom inaccessible modal markup is preferred over Catalyst Dialog.',
                        'points' => 2,
                        'correct_answer' => 'false',
                    ],
                    [
                        'type' => QuestionType::MultipleChoice,
                        'question' => 'Primary destructive confirms should use…',
                        'points' => 2,
                        'options' => [
                            ['label' => 'Shared confirm dialog with danger tone', 'is_correct' => true],
                            ['label' => 'window.alert only', 'is_correct' => false],
                            ['label' => 'Silent deletes', 'is_correct' => false],
                        ],
                    ],
                    [
                        'type' => QuestionType::Identification,
                        'question' => 'UI kit name used by DevForge?',
                        'points' => 2,
                        'correct_answer' => 'Catalyst',
                    ],
                ],
            ],
            10 => [
                'title' => 'Forms & Client State',
                'passing_score' => 85,
                'max_attempts' => 3,
                'questions' => [
                    [
                        'type' => QuestionType::TrueFalse,
                        'question' => 'PHP parses multipart file bodies on native PATCH requests reliably.',
                        'points' => 2,
                        'correct_answer' => 'false',
                    ],
                    [
                        'type' => QuestionType::MultipleChoice,
                        'question' => 'Client should treat enrollment completion as…',
                        'points' => 2,
                        'options' => [
                            ['label' => 'Server truth', 'is_correct' => true],
                            ['label' => 'localStorage invention', 'is_correct' => false],
                            ['label' => 'CSS classes only', 'is_correct' => false],
                        ],
                    ],
                    [
                        'type' => QuestionType::Identification,
                        'question' => 'Hidden field name used to spoof HTTP methods?',
                        'points' => 2,
                        'correct_answer' => '_method',
                    ],
                ],
            ],
            11 => [
                'title' => 'API Resources',
                'passing_score' => 85,
                'max_attempts' => 3,
                'questions' => [
                    [
                        'type' => QuestionType::MultipleChoice,
                        'question' => 'Transforming models for Inertia/JSON should go through…',
                        'points' => 2,
                        'options' => [
                            ['label' => 'JsonResource classes', 'is_correct' => true],
                            ['label' => 'toArray on controllers ad-hoc forever', 'is_correct' => false],
                            ['label' => 'var_export', 'is_correct' => false],
                        ],
                    ],
                    [
                        'type' => QuestionType::TrueFalse,
                        'question' => 'Cache-busting avatars with `?v=` timestamps is a valid pattern.',
                        'points' => 2,
                        'correct_answer' => 'true',
                    ],
                    [
                        'type' => QuestionType::Identification,
                        'question' => 'TypeScript folder commonly housing shared DTOs under resources/js?',
                        'points' => 1,
                        'correct_answer' => 'types',
                    ],
                ],
            ],
            12 => [
                'title' => 'Pest Discipline',
                'passing_score' => 85,
                'max_attempts' => 3,
                'questions' => [
                    [
                        'type' => QuestionType::MultipleChoice,
                        'question' => 'Authorization denials in Feature tests should assert…',
                        'points' => 2,
                        'options' => [
                            ['label' => 'assertForbidden()', 'is_correct' => true],
                            ['label' => 'assertOk()', 'is_correct' => false],
                            ['label' => 'assertSee("welcome")', 'is_correct' => false],
                        ],
                    ],
                    [
                        'type' => QuestionType::TrueFalse,
                        'question' => 'Storage::fake prevents writing uploads to real disks in tests.',
                        'points' => 2,
                        'correct_answer' => 'true',
                    ],
                    [
                        'type' => QuestionType::Identification,
                        'question' => 'Pest helper in this app for role users? (function name)',
                        'points' => 2,
                        'correct_answer' => 'userWithRole',
                    ],
                ],
            ],
            13 => [
                'title' => 'Queues & Async',
                'passing_score' => 80,
                'max_attempts' => 3,
                'questions' => [
                    [
                        'type' => QuestionType::TrueFalse,
                        'question' => 'Long PDF generation should run inline in the HTTP controller.',
                        'points' => 2,
                        'correct_answer' => 'false',
                    ],
                    [
                        'type' => QuestionType::MultipleChoice,
                        'question' => 'To push work to a queue from an Action…',
                        'points' => 2,
                        'options' => [
                            ['label' => 'Job::dispatch()', 'is_correct' => true],
                            ['label' => 'sleep(60)', 'is_correct' => false],
                            ['label' => 'dd()', 'is_correct' => false],
                        ],
                    ],
                    [
                        'type' => QuestionType::Identification,
                        'question' => 'Local queue driver that executes immediately?',
                        'points' => 2,
                        'correct_answer' => 'sync',
                    ],
                ],
            ],
            14 => [
                'title' => 'Uploads & Disks',
                'passing_score' => 85,
                'max_attempts' => 3,
                'questions' => [
                    [
                        'type' => QuestionType::MultipleChoice,
                        'question' => 'When deleting a learning path with hosted videos you must…',
                        'points' => 2,
                        'options' => [
                            ['label' => 'Leave orphan files forever', 'is_correct' => false],
                            ['label' => 'Delete stored files then cascade DB rows', 'is_correct' => true],
                            ['label' => 'Only soft-delete React state', 'is_correct' => false],
                        ],
                    ],
                    [
                        'type' => QuestionType::TrueFalse,
                        'question' => 'Mime + size validation belongs in Form Requests before Storage::put.',
                        'points' => 2,
                        'correct_answer' => 'true',
                    ],
                    [
                        'type' => QuestionType::Identification,
                        'question' => 'Artisan command to symlink public disk?',
                        'points' => 2,
                        'correct_answer' => 'storage:link',
                    ],
                ],
            ],
            15 => [
                'title' => 'Notifications',
                'passing_score' => 80,
                'max_attempts' => 3,
                'questions' => [
                    [
                        'type' => QuestionType::MultipleChoice,
                        'question' => 'Unread counts for Inertia usually come from…',
                        'points' => 2,
                        'options' => [
                            ['label' => 'Shared props', 'is_correct' => true],
                            ['label' => 'Hardcoded 999', 'is_correct' => false],
                            ['label' => 'CSS counters', 'is_correct' => false],
                        ],
                    ],
                    [
                        'type' => QuestionType::TrueFalse,
                        'question' => 'Notifications can implement multiple channels such as mail + database.',
                        'points' => 2,
                        'correct_answer' => 'true',
                    ],
                    [
                        'type' => QuestionType::Identification,
                        'question' => 'Laravel class family for out-of-band user alerts?',
                        'points' => 2,
                        'correct_answer' => 'Notification',
                    ],
                ],
            ],
            16 => [
                'title' => 'Performance',
                'passing_score' => 85,
                'max_attempts' => 3,
                'questions' => [
                    [
                        'type' => QuestionType::TrueFalse,
                        'question' => 'Cache keys should ignore entity identity and never invalidate.',
                        'points' => 2,
                        'correct_answer' => 'false',
                    ],
                    [
                        'type' => QuestionType::MultipleChoice,
                        'question' => 'Foreign key columns used in WHERE filters should usually have…',
                        'points' => 2,
                        'options' => [
                            ['label' => 'Indexes', 'is_correct' => true],
                            ['label' => 'No schema', 'is_correct' => false],
                            ['label' => 'Only fulltext on emails', 'is_correct' => false],
                        ],
                    ],
                    [
                        'type' => QuestionType::Identification,
                        'question' => 'Facade commonly used for cache reads/writes?',
                        'points' => 1,
                        'correct_answer' => 'Cache',
                    ],
                ],
            ],
            17 => [
                'title' => 'Security',
                'passing_score' => 90,
                'max_attempts' => 2,
                'questions' => [
                    [
                        'type' => QuestionType::MultipleChoice,
                        'question' => 'IDOR mitigation on nested admin routes requires…',
                        'points' => 3,
                        'options' => [
                            ['label' => 'Belongs-to checks / abort_unless', 'is_correct' => true],
                            ['label' => 'Trusting client path ids always', 'is_correct' => false],
                            ['label' => 'Hiding buttons only', 'is_correct' => false],
                        ],
                    ],
                    [
                        'type' => QuestionType::TrueFalse,
                        'question' => 'APP_DEBUG=true is required on production for Inertia.',
                        'points' => 2,
                        'correct_answer' => 'false',
                    ],
                    [
                        'type' => QuestionType::Identification,
                        'question' => 'Token name protecting state-changing forms from CSRF?',
                        'points' => 2,
                        'correct_answer' => '_token',
                    ],
                    [
                        'type' => QuestionType::MultipleChoice,
                        'question' => 'Mass assignment defense primarily uses…',
                        'points' => 2,
                        'options' => [
                            ['label' => '$fillable / guarded + validated input', 'is_correct' => true],
                            ['label' => 'Ignoring validation', 'is_correct' => false],
                            ['label' => 'Public S3 buckets', 'is_correct' => false],
                        ],
                    ],
                ],
            ],
            18 => [
                'title' => 'Deployment',
                'passing_score' => 85,
                'max_attempts' => 3,
                'questions' => [
                    [
                        'type' => QuestionType::MultipleChoice,
                        'question' => 'Before serving production traffic you must…',
                        'points' => 2,
                        'options' => [
                            ['label' => 'Build frontend assets', 'is_correct' => true],
                            ['label' => 'Delete vendor', 'is_correct' => false],
                            ['label' => 'Disable HTTPS', 'is_correct' => false],
                        ],
                    ],
                    [
                        'type' => QuestionType::TrueFalse,
                        'question' => '`php artisan migrate --force` is used in non-interactive production deploys.',
                        'points' => 2,
                        'correct_answer' => 'true',
                    ],
                    [
                        'type' => QuestionType::Identification,
                        'question' => 'Command to cache config for production?',
                        'points' => 2,
                        'correct_answer' => 'config:cache',
                    ],
                ],
            ],
            19 => [
                'title' => 'Review Standards',
                'passing_score' => 90,
                'max_attempts' => 2,
                'questions' => [
                    [
                        'type' => QuestionType::MultipleChoice,
                        'question' => 'A PR that puts Eloquent in controllers should be…',
                        'points' => 3,
                        'options' => [
                            ['label' => 'Rejected until extracted', 'is_correct' => true],
                            ['label' => 'Rubber-stamped', 'is_correct' => false],
                            ['label' => 'Merged only on Fridays', 'is_correct' => false],
                        ],
                    ],
                    [
                        'type' => QuestionType::TrueFalse,
                        'question' => 'Missing authorization tests for new admin endpoints is a blocker.',
                        'points' => 2,
                        'correct_answer' => 'true',
                    ],
                    [
                        'type' => QuestionType::Identification,
                        'question' => 'Severity label for production-breaking review findings?',
                        'points' => 2,
                        'correct_answer' => 'blocker',
                    ],
                ],
            ],
            20 => [
                'title' => 'Capstone Readiness',
                'passing_score' => 90,
                'max_attempts' => 2,
                'questions' => [
                    [
                        'type' => QuestionType::MultipleChoice,
                        'question' => 'Capstone unlocks when…',
                        'points' => 3,
                        'options' => [
                            ['label' => 'Level 20 progress is no longer locked', 'is_correct' => true],
                            ['label' => 'User registers', 'is_correct' => false],
                            ['label' => 'Mentor deletes the path', 'is_correct' => false],
                        ],
                    ],
                    [
                        'type' => QuestionType::TrueFalse,
                        'question' => 'Starting a capstone clones the selected template into a personal project.',
                        'points' => 2,
                        'correct_answer' => 'true',
                    ],
                    [
                        'type' => QuestionType::Identification,
                        'question' => 'Admin module that authors milestone blueprints?',
                        'points' => 2,
                        'correct_answer' => 'Capstone Templates',
                    ],
                    [
                        'type' => QuestionType::MultipleChoice,
                        'question' => 'Mentor sign-off happens against…',
                        'points' => 2,
                        'options' => [
                            ['label' => 'Submitted project milestones', 'is_correct' => true],
                            ['label' => '`.env` files', 'is_correct' => false],
                            ['label' => 'Vite HMR only', 'is_correct' => false],
                        ],
                    ],
                ],
            ],
        ];

        if (! isset($bank[$number])) {
            throw new \InvalidArgumentException("No quiz for level {$number}");
        }

        return $bank[$number];
    }
}
