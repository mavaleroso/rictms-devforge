<?php

namespace Database\Seeders\Curriculum;

use App\Enums\MaterialType;

final class LaravelInertiaMaterials
{
    /** @return list<array{type: MaterialType, title: string, content: string}> */
    public static function forLevel(int $number): array
    {
        $packs = [
            1 => [
                [
                    'type' => MaterialType::Markdown,
                    'title' => 'Environment Bootstrap Contract',
                    'content' => <<<'MD'
# Environment Bootstrap Contract

DevForge apps run on **PHP 8.3+**, **Composer 2**, **Node 20+**, and Laravel **12**. LocalOS may be Laragon (Windows) or WSL2.

## Non-negotiables
1. Never commit `.env` — only `.env.example`.
2. `APP_KEY` must exist before first request (`php artisan key:generate`).
3. Vite + `@vite` must load; do not ship unbuilt assets in production.
4. Database credentials must allow migrate + session/queue drivers you enable.

## Directory map (memorize)
| Path | Responsibility |
|---|---|
| `app/Http/Controllers` | Thin HTTP adapters |
| `app/Actions` | Use-case orchestration |
| `app/Services` | Domain services |
| `app/Repositories` | Persistence contracts |
| `resources/js/pages` | Inertia page components |
| `routes/*.php` | Named HTTP surface |

## First commands
```bash
composer create-project laravel/laravel app
cp .env.example .env && php artisan key:generate
php artisan migrate
npm install && npm run dev
```

Fail the lesson if any step requires guessing secrets.
MD,
                ],
                [
                    'type' => MaterialType::Standard,
                    'title' => 'DevForge Local Checklist',
                    'content' => "☐ PHP >= 8.3\n☐ Composer authenticated to packagist\n☐ MySQL/Postgres reachable\n☐ `storage:link` if public disks used\n☐ Pest smoke test green\n☐ Queue driver = sync locally unless Redis running",
                ],
                [
                    'type' => MaterialType::Snippet,
                    'title' => 'Minimal .env expectations',
                    'content' => "APP_NAME=DevForge\nAPP_ENV=local\nAPP_DEBUG=true\nAPP_URL=http://localhost\n\nDB_CONNECTION=mysql\nSESSION_DRIVER=database\nQUEUE_CONNECTION=sync",
                ],
            ],
            2 => [
                [
                    'type' => MaterialType::Markdown,
                    'title' => 'Typed PHP for Laravel Surfaces',
                    'content' => <<<'MD'
# Typed PHP for Laravel Surfaces

Laravel 12 assumes modern PHP. Prefer:

```php
declare(strict_types=1);

final class CreateLearningPath
{
    public function __construct(
        private readonly LearningPathService $paths,
    ) {}

    public function execute(array $attributes): LearningPath
    {
        return $this->paths->create($attributes);
    }
}
```

## Rules
- Constructor promotion for DI
- `final` Actions/Services by default
- Enums for status fields (`LevelDifficulty`, roles as Spatie but domain statuses as enums)
- `match` over nested ternaries
- No `@`-silenced errors

## Anti-patterns
- Untyped `$data` arrays mutating globally
- Business rules inside Blade/React
- Catching `\Throwable` and ignoring
MD,
                ],
                [
                    'type' => MaterialType::Standard,
                    'title' => 'PSR-12 Microsheet',
                    'content' => "4-space indent · opening braces on same line for methods · one blank line between methods · imports alphabetized · no unused imports.",
                ],
            ],
            3 => [
                [
                    'type' => MaterialType::Markdown,
                    'title' => 'Thin Controllers Doctrine',
                    'content' => <<<'MD'
# Thin Controllers Doctrine

A controller method may:
1. Authorize (or rely on Form Request)
2. Call one Action
3. Return redirect / Inertia / JSON

It may **not**:
- Run Eloquent queries
- Format emails
- Compute XP
- Touch Storage disks

```php
public function store(StoreVideoRequest $request, Level $level, ManageLevelContent $action): RedirectResponse
{
    $action->storeVideo($level, $request->safe()->except('file'), $request->file('file'));
    return back();
}
```

Named routes are mandatory: `route('admin.videos.store', [$path, $level])`.
MD,
                ],
                [
                    'type' => MaterialType::Snippet,
                    'title' => 'Route example',
                    'content' => "Route::middleware(['auth','role:admin'])->prefix('admin')->name('admin.')->group(function () {\n    Route::post('paths/{path}/levels/{level}/videos', [LevelContentController::class, 'storeVideo'])->name('videos.store');\n});",
                ],
            ],
            4 => [
                [
                    'type' => MaterialType::Markdown,
                    'title' => 'Eloquent Relationships Without N+1',
                    'content' => <<<'MD'
# Eloquent Relationships Without N+1

Always decide *when* relations load:

```php
$path->load([
    'levels.materials',
    'levels.videos',
    'levels.quiz.questions.options',
]);
```

## Casts
```php
protected function casts(): array
{
    return [
        'is_active' => 'boolean',
        'difficulty' => LevelDifficulty::class,
        'examples' => 'array',
    ];
}
```

## Scopes
Prefer `scopeActive(Builder $q)` over repeating `where('is_active', true)`.

Challenge: open Telescope / Debugbar on Learn path index—if queries grow with levels, you failed.
MD,
                ],
                [
                    'type' => MaterialType::Standard,
                    'title' => 'N+1 Review Rubric',
                    'content' => 'Reject PRs that loop `$models as $m` then call `$m->relation` without eager load. Accept select + withCount alternatives when listing.',
                ],
            ],
            5 => [
                [
                    'type' => MaterialType::Markdown,
                    'title' => 'Migrations as Product Contracts',
                    'content' => <<<'MD'
# Migrations as Product Contracts

Rules:
1. Every FK declares `cascadeOnDelete` / `nullOnDelete` / `restrictOnDelete` **intentionally**.
2. Prefer additive migrations over rewriting old ones after deploy.
3. Seeders must be idempotent (`firstOrCreate` / `updateOrCreate`).
4. Factories exist for entities under test pressure.

```php
$table->foreignId('level_id')->constrained()->cascadeOnDelete();
$table->unique(['learning_path_id', 'number']);
```

Certificates use `restrictOnDelete` on `learning_path_id` until soft orchestration deletes them first—know why.
MD,
                ],
            ],
            6 => [
                [
                    'type' => MaterialType::Markdown,
                    'title' => 'Form Request Hardening',
                    'content' => <<<'MD'
# Form Request Hardening

```php
public function authorize(): bool
{
    return $this->user()?->isAdmin() ?? false;
}

public function rules(): array
{
    return [
        'provider' => ['required', Rule::enum(VideoProvider::class)],
        'url' => [Rule::requiredIf(...), 'nullable', 'string', 'max:500'],
        'file' => [Rule::requiredIf(...), 'file', 'mimetypes:video/mp4,...', 'max:102400'],
    ];
}
```

Pass `$request->safe()->except('file')` into Actions; never pass the Request object deep.
MD,
                ],
            ],
            7 => [
                [
                    'type' => MaterialType::Markdown,
                    'title' => 'Policies over Ad-hoc Role Checks',
                    'content' => <<<'MD'
# Policies over Ad-hoc Role Checks

Use Spatie roles **and** Laravel Policies:

```php
public function delete(User $user, LearningPath $path): bool
{
    return $user->isAdmin();
}
```

Controllers call `$this->authorize('delete', $path)`.

Intern cannot hit `/admin/*`. Mentor cannot mutate path curriculum. Interns may only progress on enrolled paths.

Mentors review submissions / milestones—never rewrite level content.
MD,
                ],
                [
                    'type' => MaterialType::Standard,
                    'title' => 'Role Matrix',
                    'content' => "admin: everything\nmentor: reviews, mentor dashboards\nintern: learn/*, settings, capstone when unlocked",
                ],
            ],
            8 => [
                [
                    'type' => MaterialType::Markdown,
                    'title' => 'Inertia as Transport',
                    'content' => <<<'MD'
# Inertia as Transport

```php
return Inertia::render('admin/paths/edit', [
    'path' => new LearningPathResource($path),
]);
```

Shared props (`HandleInertiaRequests`) expose auth, flash awards, gamification, capstone unlock flags.

Partial reloads: `router.reload({ only: ['project'] })`.

Never put Eloquent models directly into React without Resources.
MD,
                ],
            ],
            9 => [
                [
                    'type' => MaterialType::Markdown,
                    'title' => 'Catalyst Composition Guide',
                    'content' => <<<'MD'
# Catalyst Composition Guide

Prefer:
- `Button`, `Input`, `Fieldset`, `Dialog`, `Table`, `Badge`
- SidebarLayout for app chrome
- Shared `surfaces` / `accent` theme helpers

Do not invent one-off modal CSS. Accessibility (`aria-*`, focus traps) ships with Catalyst—keep it.
MD,
                ],
            ],
            10 => [
                [
                    'type' => MaterialType::Markdown,
                    'title' => 'useValidatedForm & Multipart Reality',
                    'content' => <<<'MD'
# useValidatedForm & Multipart Reality

PHP will not parse files on real PATCH. Use POST + `_method=patch` (`submitMultipartPatch`).

Validation errors → toast via `showValidationErrors` **and** inline `FormField`.

Server persists enrollment/completion; client never invents `completed` progress.
MD,
                ],
            ],
            11 => [
                [
                    'type' => MaterialType::Markdown,
                    'title' => 'JsonResource Contracts',
                    'content' => <<<'MD'
# JsonResource Contracts

```php
'file_path' => $this->file_path
    ? Storage::disk('public')->url($this->file_path).'?v='.$this->updated_at?->timestamp
    : null,
```

Keep TS interfaces in `resources/js/types` synchronized. Breaking props = failing Feature Inertia assertions.
MD,
                ],
            ],
            12 => [
                [
                    'type' => MaterialType::Markdown,
                    'title' => 'Pest Feature Testing Playbook',
                    'content' => <<<'MD'
# Pest Feature Testing Playbook

```php
$this->actingAs($admin)
    ->delete(route('admin.paths.destroy', $path))
    ->assertRedirect(route('admin.paths.index'));
```

Use `Storage::fake()`, `assertInertia`, role helpers `userWithRole('admin')`.

Every new authorization branch needs a complementary forbidden test.
MD,
                ],
            ],
            13 => [
                [
                    'type' => MaterialType::Markdown,
                    'title' => 'Jobs for Slow Work',
                    'content' => <<<'MD'
# Jobs for Slow Work

UseCases for queues:
- Certificate PDF rendering
- Challenge evaluation in sandboxes
- Bulk mail

```php
GenerateCertificatePdf::dispatch($certificate)->onQueue('certificates');
```

Configure Horizon/workers in prod. Locally `QUEUE_CONNECTION=sync` is OK until you need fidelity.
MD,
                ],
            ],
            14 => [
                [
                    'type' => MaterialType::Markdown,
                    'title' => 'Storage Lifecycle',
                    'content' => <<<'MD'
# Storage Lifecycle

Upload path convention:
`learning-paths/{pathId}/levels/{levelId}/videos/{hash}.mp4`

On parent delete, delete files **before** cascading DB rows (see `LearningPathService::delete`).

Always `Storage::disk('public')->assertExists` in tests when uploading.
MD,
                ],
            ],
            15 => [
                [
                    'type' => MaterialType::Markdown,
                    'title' => 'Notifications Architecture',
                    'content' => <<<'MD'
# Notifications Architecture

Implement `via()` returning `['mail','database']` when mentors must act.

Shared prop `notifications.unread_count` keeps the UI honest.

Do not spam—batch digest jobs for XP awards when volume grows.
MD,
                ],
            ],
            16 => [
                [
                    'type' => MaterialType::Markdown,
                    'title' => 'Caching Strategy',
                    'content' => <<<'MD'
# Caching Strategy

Cache keys include tenant/path ids and schema versions:

`analytics:path:{id}:v{updated_at}`

Prefer explicit invalidation after admin mutations over very long TTLs.

Add DB indexes for foreign keys used in filters (`enrollment_id`, `learning_path_id`).
MD,
                ],
            ],
            17 => [
                [
                    'type' => MaterialType::Markdown,
                    'title' => 'Security Review Sheet',
                    'content' => <<<'MD'
# Security Review Sheet

Checklist:
1. Nested `{path}/{level}` IDs verified belonging (`abort_unless`)
2. Policies on destroy/update
3. Rate limits on login + challenge submit
4. CSP-friendly Inertia (no inline secret scripts)
5. Upload mime + size validation
6. No debug `APP_DEBUG=true` in production
MD,
                ],
                [
                    'type' => MaterialType::Standard,
                    'title' => 'IDOR Drill',
                    'content' => "Swap level ids across paths in HTTP calls—must 404/403. Mentors must not wipe curriculum.",
                ],
            ],
            18 => [
                [
                    'type' => MaterialType::Markdown,
                    'title' => 'Production Deploy Runbook',
                    'content' => <<<'MD'
# Production Deploy Runbook

1. `npm ci && npm run build`
2. `php artisan down` (or zero-downtime platform)
3. `php artisan migrate --force`
4. `php artisan config:cache && route:cache && view:cache`
5. Restart PHP-FPM + queue workers
6. `php artisan up`
7. Hit `/up` health endpoint

Assets must be built **before** traffic; missing Vite manifests = blank Inertia pages.
MD,
                ],
            ],
            19 => [
                [
                    'type' => MaterialType::Markdown,
                    'title' => 'Architecture Review Rubric',
                    'content' => <<<'MD'
# Architecture Review Rubric

Reject when:
- Controllers contain Eloquent
- Secrets in repo
- Missing Pest coverage for authz
- Resources leaking password hashes
- Chaos commits mixing refactors + features

Approve when Actions + Repositories + Policies + tests read like documentation.
MD,
                ],
            ],
            20 => [
                [
                    'type' => MaterialType::Markdown,
                    'title' => 'Capstone Synthesis Brief',
                    'content' => <<<'MD'
# Capstone Synthesis Brief

You are ready when you can:
1. Explain unlock rule: level 20 not locked
2. Choose a Capstone template and justify milestones
3. Diagram Actions → Services → Repositories for your feature
4. List secure upload + queue + notification touchpoints
5. Demo mentor review flow

Capstone templates are blueprints; your project is the clone. Ship weekly milestones with mentor sign-off.
MD,
                ],
                [
                    'type' => MaterialType::Standard,
                    'title' => 'Demo Script Template',
                    'content' => "1. Problem statement\n2. Architecture walk\n3. Security model\n4. Test evidence\n5. Risks & next iteration",
                ],
            ],
        ];

        if (! isset($packs[$number])) {
            throw new \InvalidArgumentException("No materials for level {$number}");
        }

        return $packs[$number];
    }

    /** @return array{title: string, url: string} */
    public static function videoForLevel(int $number): array
    {
        // Stable educational Laravel / modern PHP / Inertia-related YouTube targets (seed placeholders).
        $videos = [
            1 => ['title' => 'Laravel installer & app structure', 'url' => 'https://www.youtube.com/watch?v=c7xp1Kh9XyE'],
            2 => ['title' => 'Modern PHP features crash course', 'url' => 'https://www.youtube.com/watch?v=OK_JCtrrv-c'],
            3 => ['title' => 'Laravel routing deep dive', 'url' => 'https://www.youtube.com/watch?v=MYyJ4PuL4pY'],
            4 => ['title' => 'Eloquent relationships explained', 'url' => 'https://www.youtube.com/watch?v=CIT5ywehY1k'],
            5 => ['title' => 'Migrations & seeders in practice', 'url' => 'https://www.youtube.com/watch?v=JPR-gqZzkeE'],
            6 => ['title' => 'Laravel validation & Form Requests', 'url' => 'https://www.youtube.com/watch?v=AjdJlRrQSao'],
            7 => ['title' => 'Authorization policies in Laravel', 'url' => 'https://www.youtube.com/watch?v=TFXzVm5XCWM'],
            8 => ['title' => 'Inertia.js grounded introduction', 'url' => 'https://www.youtube.com/watch?v=JS621AU1Msg'],
            9 => ['title' => 'Building UI systems with React', 'url' => 'https://www.youtube.com/watch?v=Tn6-PIqc4UM'],
            10 => ['title' => 'Forms UX and optimistic UI patterns', 'url' => 'https://www.youtube.com/watch?v=7c68zHquRi4'],
            11 => ['title' => 'API resources & transformers', 'url' => 'https://www.youtube.com/watch?v=D1VBST1bQkA'],
            12 => ['title' => 'Testing Laravel applications', 'url' => 'https://www.youtube.com/watch?v=uQn_8RzZ5wc'],
            13 => ['title' => 'Queues and background jobs', 'url' => 'https://www.youtube.com/watch?v=u0Jt9oJtXqw'],
            14 => ['title' => 'File uploads & storage disks', 'url' => 'https://www.youtube.com/watch?v=3X8r2C2rJ5o'],
            15 => ['title' => 'Laravel notifications & mail', 'url' => 'https://www.youtube.com/watch?v=9AO2hWMWmZg'],
            16 => ['title' => 'Caching strategies for Laravel', 'url' => 'https://www.youtube.com/watch?v=Pz2vjRu_t7Q'],
            17 => ['title' => 'Web application security basics', 'url' => 'https://www.youtube.com/watch?v=2OPVViV-2s4'],
            18 => ['title' => 'Deploying Laravel apps', 'url' => 'https://www.youtube.com/watch?v=mx1dcLkQmNY'],
            19 => ['title' => 'Effective code reviews', 'url' => 'https://www.youtube.com/watch?v=PJjmw9TRF7M'],
            20 => ['title' => 'Shipping a full-stack demo', 'url' => 'https://www.youtube.com/watch?v=Ke90Tje7VS0'],
        ];

        return $videos[$number];
    }
}
