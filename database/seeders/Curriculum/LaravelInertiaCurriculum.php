<?php

namespace Database\Seeders\Curriculum;

use App\Enums\ChallengeLanguage;
use App\Enums\LevelDifficulty;
use App\Enums\VideoProvider;
use App\Library\CodingChallenge\LanguageRegistry;
use App\Models\ChallengeTestCase;
use App\Models\CodingChallenge;
use App\Models\LearningMaterial;
use App\Models\LearningPath;
use App\Models\Level;
use App\Models\Quiz;
use App\Models\QuizOption;
use App\Models\QuizQuestion;
use App\Models\Video;
use Illuminate\Support\Facades\DB;

final class LaravelInertiaCurriculum
{
    public static function pathAttributes(): array
    {
        return [
            'slug' => 'laravel-inertia-full-stack',
            'name' => 'Laravel + Inertia Full Stack',
            'description' => 'A rigorous 20-level academy for Laravel 12, Inertia.js, React, and Catalyst UI—enforcing thin controllers, Form Requests, Actions, Pest tests, queues, security, and production deployment.',
            'icon' => 'laravel',
            'is_active' => true,
            'sort_order' => 1,
        ];
    }

    /** @return array<int, array<string, mixed>> */
    public static function levels(): array
    {
        return [
            1 => [
                'title' => 'Dev Environment & Laravel Anatomy',
                'overview' => 'Install the DevForge stack correctly: PHP 8.3+, Composer, Node, Laravel 12 app structure, `.env` discipline, and first artisan commands.',
                'objectives' => "- Install and verify PHP, Composer, Node, and Laragon/WSL tooling\n- Generate a Laravel 12 app and explain each top-level directory\n- Configure `.env`, APP_KEY, and local database access\n- Run `artisan serve`, `migrate`, and the Vite frontend toolchain",
                'expected_outcome' => 'You can bootstrap a greenfield Laravel app, explain directory responsibilities, and prove the HTTP + Vite loop works locally.',
                'estimated_minutes' => 150,
                'difficulty' => LevelDifficulty::Beginner,
            ],
            2 => [
                'title' => 'Modern PHP for Laravel Developers',
                'overview' => 'Master the PHP language surface Laravel depends on: typed properties, constructor promotion, enums, match, named args, and PSR-12 style.',
                'objectives' => "- Write typed functions and configure-aware classes\n- Use enums and match expressions instead of magic strings\n- Apply PSR-12 and DevForge naming rules\n- Spot anti-patterns that produce fat business logic in the wrong layer",
                'expected_outcome' => 'You can write PHP that compiles cleanly with Laravel’s expectations and survives static review.',
                'estimated_minutes' => 150,
                'difficulty' => LevelDifficulty::Beginner,
            ],
            3 => [
                'title' => 'HTTP, Routing & Thin Controllers',
                'overview' => 'Design route files, resource controllers, and Form Request entry points while keeping controllers under 10 lines of business logic.',
                'objectives' => "- Register web/API routes with named routes and middleware groups\n- Build resource controllers that only orchestrate\n- Inject Actions and Form Requests correctly\n- Return Inertia responses with typed props",
                'expected_outcome' => 'Every new endpoint has a named route, authorized Form Request, Action call, and intentional response type.',
                'estimated_minutes' => 160,
                'difficulty' => LevelDifficulty::Beginner,
            ],
            4 => [
                'title' => 'Eloquent Modeling & Relationships',
                'overview' => 'Model domain entities with casts, relationships, scopes, and eager loading—avoiding N+1 and save-time surprises.',
                'objectives' => "- Define fillable/guarded and attribute casts safely\n- Implement hasMany, belongsTo, morphs where needed\n- Use local scopes and query builder fluency\n- Detect and fix N+1 with `with()` and Debugbar/Telescope",
                'expected_outcome' => 'You design models that encode domain rules without leaking query chaos into controllers.',
                'estimated_minutes' => 170,
                'difficulty' => LevelDifficulty::Beginner,
            ],
            5 => [
                'title' => 'Migrations, Seeders & Factories',
                'overview' => 'Treat the database schema as versioned product code: reversible migrations, idempotent seeders, and realistic factories.',
                'objectives' => "- Author zero-downtime-friendly migrations\n- Seed roles/users/paths without duplicates\n- Build factories that support feature tests\n- Reset local DBs predictably with migrate:fresh --seed",
                'expected_outcome' => 'Schema changes are reviewable PRs; fresh installs reproduce demo data reliably.',
                'estimated_minutes' => 150,
                'difficulty' => LevelDifficulty::Beginner,
            ],
            6 => [
                'title' => 'Form Requests & Validation Contracts',
                'overview' => 'Centralize authorization and validation. Never trust `$request->all()` in Actions.',
                'objectives' => "- Authorize inside Form Requests with policies\n- Write field rules, custom messages, and after hooks\n- Publish validated arrays into Actions\n- Reject overposting / mass-assignment attacks",
                'expected_outcome' => 'Invalid payloads never reach domain code; authorization failures are consistent 403s.',
                'estimated_minutes' => 160,
                'difficulty' => LevelDifficulty::Intermediate,
            ],
            7 => [
                'title' => 'Auth, Roles & Policies',
                'overview' => 'Wire Breeze/Jetstream-style auth, Spatie roles, and Laravel Policies so every SensitiveAction is gated.',
                'objectives' => "- Assign roles (admin, mentor, intern) correctly\n- Write policies for LearningPath and Level content\n- Protect routes with middleware and Gate checks\n- Audit mentor vs intern boundaries",
                'expected_outcome' => 'Privilege escalation attempts fail at middleware/policy layers before Actions run.',
                'estimated_minutes' => 180,
                'difficulty' => LevelDifficulty::Intermediate,
            ],
            8 => [
                'title' => 'Inertia.js Contracts & Shared Props',
                'overview' => 'Treat Inertia as the contract between Laravel and React: deferred props, shared auth flash, and partial reloads.',
                'objectives' => "- Render Inertia pages from controllers/Actions\n- Share auth, flash, and gamification summaries\n- Use preserved scroll, only, and reload patterns\n- Avoid shipping secrets or oversized graphs",
                'expected_outcome' => 'SPA navigation feels native while requests stay first-class Laravel HTTP.',
                'estimated_minutes' => 170,
                'difficulty' => LevelDifficulty::Intermediate,
            ],
            9 => [
                'title' => 'React + Catalyst Component Systems',
                'overview' => 'Compose Catalyst-accessible primitives: forms, dialogs, tables, and sidebars that match DevForge visual standards.',
                'objectives' => "- Build controlled forms with Catalyst Fieldsets\n- Reuse dialogs/toasts for confirmations\n- Structure page layouts with AppLayout/SidebarLayout\n- Prefer composition over one-off CSS",
                'expected_outcome' => 'UI is consistent, accessible, and trivial to extend without CSS sprawl.',
                'estimated_minutes' => 180,
                'difficulty' => LevelDifficulty::Intermediate,
            ],
            10 => [
                'title' => 'Client State, Forms & Optimistic UX',
                'overview' => 'Use Inertia useForm, validated wrappers, and their limits—when to introduce query state vs server truth.',
                'objectives' => "- Submit multipart and spoofed PATCH uploads\n- Surface Laravel validation as toasts + field errors\n- Preserve UX on long-running runs/polls\n- Keep server as source of truth for enrollments/progress",
                'expected_outcome' => 'Forms degrade gracefully, never invent progress status on the client.',
                'estimated_minutes' => 160,
                'difficulty' => LevelDifficulty::Intermediate,
            ],
            11 => [
                'title' => 'API Resources & Payload Hygiene',
                'overview' => 'Expose JsonResource / Inertia props that transform models intentionally—never leak Eloquent bags.',
                'objectives' => "- Map models through Resources\n- Version sensitive fields (avatars with cache bust)\n- Paginate and shape nested relations\n- Align TypeScript types with backend contracts",
                'expected_outcome' => 'Frontend types and backend Resources stay 1:1; over-fetching is cringe-reviewed.',
                'estimated_minutes' => 150,
                'difficulty' => LevelDifficulty::Intermediate,
            ],
            12 => [
                'title' => 'Pest Feature & Unit Testing',
                'overview' => 'Prove learning flows with Pest: enrollment, quiz grading, challenge evaluation, and role gates.',
                'objectives' => "- Write Feature tests that hit HTTP + Inertia asserts\n- Fake Storage/notifications/queues\n- Cover happy path + authorization denials\n- Keep tests deterministic and fast",
                'expected_outcome' => 'Regressions in progression/XP/challenges fail CI before merge.',
                'estimated_minutes' => 190,
                'difficulty' => LevelDifficulty::Intermediate,
            ],
            13 => [
                'title' => 'Queues, Jobs & Asynchronous Coding Runs',
                'overview' => 'Move expensive work (emails, evaluation, PDFs) off the request thread with durable jobs.',
                'objectives' => "- Dispatch jobs with backoff and uniqueness\n- Configure queues for local Redis/database drivers\n- Observe failed jobs and retries\n- Keep controllers synchronous-thin",
                'expected_outcome' => 'Long tasks never block Inertia responses; failures are observable.',
                'estimated_minutes' => 170,
                'difficulty' => LevelDifficulty::Advanced,
            ],
            14 => [
                'title' => 'Filesystem, Uploads & Media Lifecycle',
                'overview' => 'Store cover images, uploaded videos, and certificates safely with public disks, deletion, and validation.',
                'objectives' => "- Validate mime/size before Storage::put\n- Generate URLs via Resources, not hard-coded paths\n- Delete orphaned files when parents die\n- Link storage and secure private disks when needed",
                'expected_outcome' => 'Media operations are transactional with parent models and never leave orphans.',
                'estimated_minutes' => 160,
                'difficulty' => LevelDifficulty::Advanced,
            ],
            15 => [
                'title' => 'Mail, Notifications & In-App Alerts',
                'overview' => 'Ship transactional email and database notifications for reviews, certificates, and mentor actions.',
                'objectives' => "- Build Mailable/Notification classes\n- Queue notifications\n- Render Inertia unread counts from shared props\n- Prefer markdown mailables for consistency",
                'expected_outcome' => 'Learners and mentors learn about important events without polling the wrong screens.',
                'estimated_minutes' => 150,
                'difficulty' => LevelDifficulty::Advanced,
            ],
            16 => [
                'title' => 'Caching, Indexing & Query Performance',
                'overview' => 'Profile slow pages; add indexes; cache expensive aggregates without stale amplitude.',
                'objectives' => "- Use Cache tags/keys with expiration strategies\n- Add foreign keys/indexes intentionally\n- Redis vs array vs file in environments\n- Invalidate or version cache after writes",
                'expected_outcome' => 'Dashboard/analytics endpoints stay snappy under demo load.',
                'estimated_minutes' => 170,
                'difficulty' => LevelDifficulty::Advanced,
            ],
            17 => [
                'title' => 'Application Security Hardening',
                'overview' => 'Close the OWASP shorts that Laravel apps still miss: CSRF, mass assignment, IDOR, XSS via Inertia, upload bombs.',
                'objectives' => "- Enforce policies on every nested resource id\n- Escape/sanitize rendered markdown carefully\n- Rate-limit auth and challenge submits\n- Rotate secrets and never commit .env",
                'expected_outcome' => 'Penetration-style review finds no open IDOR on path/level/video ids.',
                'estimated_minutes' => 180,
                'difficulty' => LevelDifficulty::Advanced,
            ],
            18 => [
                'title' => 'CI, Config & Production Deployment',
                'overview' => 'Ship Laravel with Vite assets, horizon/workers, migrations, and zero-guess ops runbooks.',
                'objectives' => "- Build assets in CI and version them\n- Run migrate --force safely\n- Configure queue workers and schedulers\n- Use config:cache / route:cache correctly",
                'expected_outcome' => 'You can describe a production deploy checklist that elsewhere teams can repeat.',
                'estimated_minutes' => 180,
                'difficulty' => LevelDifficulty::Advanced,
            ],
            19 => [
                'title' => 'Code Review & Architecture Cadence',
                'overview' => 'Apply DevForge review rubrics: Actions/Repositories, naming, tests, props contracts, and mentor feedback loops.',
                'objectives' => "- Check PRs for layering violations\n- Demand Pest coverage for new rules\n- Flag secret leaks and overfetch\n- Give mentor-quality written feedback",
                'expected_outcome' => 'You reject fat controllers and approve only reviewable, tested changes.',
                'estimated_minutes' => 160,
                'difficulty' => LevelDifficulty::Expert,
            ],
            20 => [
                'title' => 'Capstone Readiness & Full-Stack Synthesis',
                'overview' => 'Synthesize the path into a shippable product mindset: architecture diagram, risks, milestones, and mentor demo.',
                'objectives' => "- Map enrolled product slices to levels learned\n- Draft milestone plan from Capstone templates\n- Defend trade-offs (queues, auth, Inertia contracts)\n- Prepare demo script and acceptance checklist",
                'expected_outcome' => 'You unlock Capstone with a coherent implementation plan and no isolated knowledge gaps.',
                'estimated_minutes' => 200,
                'difficulty' => LevelDifficulty::Expert,
            ],
        ];
    }

    public static function syncPath(): LearningPath
    {
        $attrs = self::pathAttributes();
        $slug = $attrs['slug'];
        unset($attrs['slug']);

        return LearningPath::updateOrCreate(['slug' => $slug], $attrs);
    }

    public static function syncLevels(LearningPath $path): array
    {
        $levels = [];

        foreach (self::levels() as $number => $definition) {
            $levels[$number] = Level::updateOrCreate(
                [
                    'learning_path_id' => $path->id,
                    'number' => $number,
                ],
                [
                    ...$definition,
                    'sort_order' => $number,
                ],
            );
        }

        return $levels;
    }

    /** @param  array<int, Level>  $levels */
    public static function syncAllContent(array $levels, bool $force = false): void
    {
        DB::transaction(function () use ($levels, $force) {
            foreach ($levels as $number => $level) {
                if ($force) {
                    $level->materials()->delete();
                    $level->videos()->delete();
                    if ($quiz = $level->quiz) {
                        $quiz->questions()->each(fn (QuizQuestion $q) => $q->options()->delete());
                        $quiz->questions()->delete();
                        $quiz->delete();
                    }
                    if ($challenge = $level->codingChallenge) {
                        $challenge->testCases()->delete();
                        $challenge->delete();
                    }
                }

                self::seedMaterials($level, $number);
                self::seedVideo($level, $number);
                self::seedQuiz($level, $number);
                self::seedChallenge($level, $number);
            }
        });
    }

    private static function seedMaterials(Level $level, int $number): void
    {
        if ($level->materials()->exists()) {
            return;
        }

        $packs = LaravelInertiaMaterials::forLevel($number);

        foreach ($packs as $index => $material) {
            LearningMaterial::create([
                'level_id' => $level->id,
                'type' => $material['type'],
                'title' => $material['title'],
                'content' => $material['content'],
                'sort_order' => $index + 1,
            ]);
        }
    }

    private static function seedVideo(Level $level, int $number): void
    {
        if ($level->videos()->exists()) {
            return;
        }

        $meta = LaravelInertiaMaterials::videoForLevel($number);

        Video::create([
            'level_id' => $level->id,
            'title' => $meta['title'],
            'provider' => VideoProvider::Youtube,
            'url' => $meta['url'],
            'sort_order' => 1,
        ]);
    }

    private static function seedQuiz(Level $level, int $number): void
    {
        if ($level->quiz()->exists()) {
            return;
        }

        $definition = LaravelInertiaQuizzes::forLevel($number);

        $quiz = Quiz::create([
            'level_id' => $level->id,
            'title' => $definition['title'],
            'passing_score' => $definition['passing_score'],
            'max_attempts' => $definition['max_attempts'],
        ]);

        foreach ($definition['questions'] as $index => $question) {
            $record = QuizQuestion::create([
                'quiz_id' => $quiz->id,
                'type' => $question['type'],
                'question' => $question['question'],
                'points' => $question['points'],
                'correct_answer' => $question['correct_answer'] ?? null,
                'sort_order' => $index + 1,
            ]);

            foreach ($question['options'] ?? [] as $optionIndex => $option) {
                QuizOption::create([
                    'quiz_question_id' => $record->id,
                    'label' => $option['label'],
                    'is_correct' => $option['is_correct'],
                    'sort_order' => $optionIndex + 1,
                ]);
            }
        }
    }

    private static function seedChallenge(Level $level, int $number): void
    {
        if ($level->codingChallenge()->exists()) {
            return;
        }

        $problem = LaravelInertiaChallenges::forLevel($number);
        $language = $problem['language'] ?? ChallengeLanguage::Php;

        $challenge = CodingChallenge::create([
            'level_id' => $level->id,
            'title' => $problem['title'],
            'description' => $problem['description'],
            'constraints' => $problem['constraints'],
            'examples' => $problem['examples'],
            'language' => $language,
            'entry_point' => $problem['entry_point'],
            'starter_code' => LanguageRegistry::defaultStarter($language, $problem['entry_point']),
            'time_limit_ms' => $problem['time_limit_ms'] ?? 2000,
            'memory_limit_mb' => $problem['memory_limit_mb'] ?? 128,
            'max_attempts' => $problem['max_attempts'] ?? 5,
            'requires_mentor_review' => $problem['requires_mentor_review'] ?? false,
            'is_active' => true,
        ]);

        foreach ($problem['cases'] as $index => $case) {
            ChallengeTestCase::create([
                'coding_challenge_id' => $challenge->id,
                'label' => $case['label'],
                'input' => ['args' => $case['args']],
                'expected_output' => $case['expected'],
                'explanation' => $case['explanation'] ?? null,
                'is_sample' => $case['sample'],
                'sort_order' => $index + 1,
            ]);
        }
    }
}
