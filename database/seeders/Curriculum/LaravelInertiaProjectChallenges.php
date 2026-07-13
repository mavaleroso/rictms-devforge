<?php

namespace Database\Seeders\Curriculum;

use App\Enums\ChallengeAssertionType;
use App\Enums\ChallengeEnvironment;
use App\Enums\ChallengeLanguage;
use App\Enums\ChallengeWorkspaceMode;
use App\Models\ChallengeTestCase;
use App\Models\CodingChallenge;
use App\Models\Level;

final class LaravelInertiaProjectChallenges
{
    public static function seedForLevels(iterable $levels): void
    {
        foreach ($levels as $level) {
            if (! $level instanceof Level) {
                continue;
            }

            match ($level->number) {
                1 => self::seedWelcomeHeadline($level),
                3 => self::seedAboutRoute($level),
                8 => self::seedWelcomeCopy($level),
                default => null,
            };
        }
    }

    private static function seedWelcomeHeadline(Level $level): void
    {
        self::upsertProjectChallenge($level, [
            'title' => 'Sandbox: Update the welcome headline',
            'slug' => 'sandbox-welcome-tagline',
            'description' => '<p>Open the installed <strong>Laravel + Inertia + React</strong> starter kit. Navigate to <code>resources/js/pages/welcome.tsx</code> and change the headline from <code>Let\'s get started</code> to <code>Start building</code>.</p><p>Use <strong>Run</strong> to sync files into the template. Serve it with <code>php artisan challenge:serve-template</code> so Simple Browser shows the live app.</p>',
            'constraints' => "Edit only the highlighted task files.\nKeep the existing Inertia Head and auth nav.",
            'target_files' => [
                'resources/js/pages/welcome.tsx',
            ],
            'sort_order' => 2,
            'cases' => [
                [
                    'label' => 'Welcome headline updated',
                    'assertion_type' => ChallengeAssertionType::FileContains,
                    'target_path' => 'resources/js/pages/welcome.tsx',
                    'expected' => 'Start building',
                    'sample' => true,
                ],
                [
                    'label' => 'Still uses Inertia Head',
                    'assertion_type' => ChallengeAssertionType::FileContains,
                    'target_path' => 'resources/js/pages/welcome.tsx',
                    'expected' => 'Head title="Welcome"',
                    'sample' => false,
                ],
            ],
        ]);
    }

    private static function seedAboutRoute(Level $level): void
    {
        self::upsertProjectChallenge($level, [
            'title' => 'Sandbox: Add a public about route',
            'slug' => 'sandbox-named-dashboard-route',
            'description' => '<p>In the starter kit <code>routes/web.php</code>, add a public named route <code>about</code> for path <code>/about</code> that renders the Inertia <code>welcome</code> page.</p>',
            'constraints' => "Keep the existing home and dashboard routes.\nUse ->name('about').",
            'target_files' => ['routes/web.php'],
            'sort_order' => 2,
            'cases' => [
                [
                    'label' => 'About path exists',
                    'assertion_type' => ChallengeAssertionType::FileContains,
                    'target_path' => 'routes/web.php',
                    'expected' => '/about',
                    'sample' => true,
                ],
                [
                    'label' => 'Named about route',
                    'assertion_type' => ChallengeAssertionType::FileRegex,
                    'target_path' => 'routes/web.php',
                    'expected' => "name\\(['\"]about['\"]\\)",
                    'sample' => true,
                ],
                [
                    'label' => 'Home route preserved',
                    'assertion_type' => ChallengeAssertionType::FileContains,
                    'target_path' => 'routes/web.php',
                    'expected' => "->name('home')",
                    'sample' => false,
                ],
            ],
        ]);
    }

    private static function seedWelcomeCopy(Level $level): void
    {
        self::upsertProjectChallenge($level, [
            'title' => 'Sandbox: Update welcome ecosystem copy',
            'slug' => 'sandbox-welcome-props',
            'description' => '<p>In <code>resources/js/pages/welcome.tsx</code>, change <code>Laravel has an incredibly rich ecosystem.</code> to <code>Laravel, Inertia, and React work great together.</code></p>',
            'constraints' => 'Do not remove the Documentation / Laracasts list items.',
            'target_files' => [
                'resources/js/pages/welcome.tsx',
            ],
            'sort_order' => 2,
            'cases' => [
                [
                    'label' => 'New ecosystem copy present',
                    'assertion_type' => ChallengeAssertionType::FileContains,
                    'target_path' => 'resources/js/pages/welcome.tsx',
                    'expected' => 'Laravel, Inertia, and React work great together.',
                    'sample' => true,
                ],
                [
                    'label' => 'Documentation link retained',
                    'assertion_type' => ChallengeAssertionType::FileContains,
                    'target_path' => 'resources/js/pages/welcome.tsx',
                    'expected' => 'Documentation',
                    'sample' => true,
                ],
                [
                    'label' => 'Still an Inertia page',
                    'assertion_type' => ChallengeAssertionType::FileContains,
                    'target_path' => 'resources/js/pages/welcome.tsx',
                    'expected' => '@inertiajs/react',
                    'sample' => false,
                ],
            ],
        ]);
    }

    /**
     * @param  array{
     *   title: string,
     *   slug: string,
     *   description: string,
     *   constraints: string,
     *   target_files: list<string>,
     *   sort_order: int,
     *   cases: list<array{label: string, assertion_type: ChallengeAssertionType, target_path: string, expected: string, sample: bool}>
     * }  $data
     */
    private static function upsertProjectChallenge(Level $level, array $data): void
    {
        $challenge = CodingChallenge::query()->updateOrCreate(
            [
                'level_id' => $level->id,
                'slug' => $data['slug'],
            ],
            [
                'title' => $data['title'],
                'description' => $data['description'],
                'constraints' => $data['constraints'],
                'examples' => [],
                'language' => ChallengeLanguage::Php,
                'environment' => ChallengeEnvironment::LaravelInertiaReact,
                'workspace_mode' => ChallengeWorkspaceMode::Project,
                'template_key' => 'laravel-inertia-react-template',
                'target_files' => $data['target_files'],
                'entry_point' => 'solution',
                'starter_code' => '// Project workspace — edit files in the starter kit tree',
                'time_limit_ms' => 2000,
                'memory_limit_mb' => 128,
                'max_attempts' => 8,
                'requires_mentor_review' => false,
                'is_active' => true,
                'sort_order' => $data['sort_order'],
            ],
        );

        $challenge->testCases()->delete();

        foreach ($data['cases'] as $index => $case) {
            ChallengeTestCase::create([
                'coding_challenge_id' => $challenge->id,
                'label' => $case['label'],
                'assertion_type' => $case['assertion_type'],
                'target_path' => $case['target_path'],
                'input' => ['args' => []],
                'expected_output' => $case['expected'],
                'is_sample' => $case['sample'],
                'sort_order' => $index + 1,
            ]);
        }
    }
}
