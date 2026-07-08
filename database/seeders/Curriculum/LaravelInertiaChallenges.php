<?php

namespace Database\Seeders\Curriculum;

use App\Enums\ChallengeLanguage;

final class LaravelInertiaChallenges
{
    /** @return array<string, mixed> */
    public static function forLevel(int $number): array
    {
        return match ($number) {
            1 => [
                'title' => 'Normalize App Key Fragment',
                'entry_point' => 'normalizeKeyFragment',
                'description' => <<<'MD'
Given a string `fragment` representing a candidate APP_KEY segment, return it trimmed and uppercased.

Use the same whitespace rules as PHP `trim()` / `ctype_space()`: spaces, tabs (`\t`), newlines (`\n`), carriage returns (`\r`), vertical tabs (`\v`), and form feeds (`\f`) must all be removed from both ends.

Empty or whitespace-only fragments must become an empty string `""`.
MD,
                'constraints' => "0 <= fragment.length <= 64",
                'examples' => [
                    ['input' => 'fragment = "  ab12  "', 'output' => '"AB12"', 'explanation' => 'Trim then uppercase.'],
                    ['input' => 'fragment = "   "', 'output' => '""', 'explanation' => 'Spaces-only becomes empty.'],
                    ['input' => 'fragment = "  \\t KEY \\n "', 'output' => '"KEY"', 'explanation' => 'Tabs/newlines trim like PHP trim().'],
                ],
                'cases' => [
                    ['label' => 'Trim + upper', 'args' => ['  ab12  '], 'expected' => '"AB12"', 'sample' => true],
                    ['label' => 'Already upper', 'args' => ['KEY'], 'expected' => '"KEY"', 'sample' => true],
                    ['label' => 'Spaces only', 'args' => ['   '], 'expected' => '""', 'sample' => true],
                    ['label' => 'Tab + spaces', 'args' => ["  \t  "], 'expected' => '""', 'sample' => false],
                    ['label' => 'Mixed case', 'args' => ['DevForge'], 'expected' => '"DEVFORGE"', 'sample' => false],
                    ['label' => 'Tab edges', 'args' => ["\tkey\n"], 'expected' => '"KEY"', 'sample' => false],
                ],
            ],
            2 => [
                'title' => 'Score PHP Type Safety',
                'entry_point' => 'typeSafetyScore',
                'description' => <<<'MD'
Score a list of boolean flags describing whether a PHP function uses:

1. Parameter types
2. Return type
3. Strict types declare

Return `2 * typedParams + 3 * returnType + 5 * strictTypes` where each flag is `true`/`false`.
MD,
                'constraints' => 'Flags are booleans only.',
                'examples' => [
                    ['input' => 'true, true, false', 'output' => '5'],
                    ['input' => 'false, false, true', 'output' => '5'],
                ],
                'cases' => [
                    ['label' => 'Params + return', 'args' => [true, true, false], 'expected' => '5', 'sample' => true],
                    ['label' => 'Strict only', 'args' => [false, false, true], 'expected' => '5', 'sample' => true],
                    ['label' => 'All on', 'args' => [true, true, true], 'expected' => '10', 'sample' => false],
                    ['label' => 'None', 'args' => [false, false, false], 'expected' => '0', 'sample' => false],
                ],
            ],
            3 => [
                'title' => 'Route Name Hasher',
                'entry_point' => 'routeSlug',
                'description' => <<<'MD'
Convert a controller action label into a route-name segment.

Rules:
- Lowercase
- Replace spaces with `.`
- Collapse multiple spaces
- Trim edges

Example: `"Admin Paths Index"` → `"admin.paths.index"`.
MD,
                'constraints' => '1 <= label.length <= 120; letters/spaces only in samples.',
                'examples' => [
                    ['input' => '"Admin Paths Index"', 'output' => '"admin.paths.index"'],
                ],
                'cases' => [
                    ['label' => 'Example', 'args' => ['Admin Paths Index'], 'expected' => '"admin.paths.index"', 'sample' => true],
                    ['label' => 'Collapse spaces', 'args' => ['Learn  Levels Show'], 'expected' => '"learn.levels.show"', 'sample' => true],
                    ['label' => 'Hidden trim', 'args' => ['  Mentor Reviews  '], 'expected' => '"mentor.reviews"', 'sample' => false],
                ],
            ],
            4 => [
                'title' => 'Detect Eager Load Save',
                'entry_point' => 'needsEagerLoad',
                'description' => <<<'MD'
Given integers `queries` (SQL count observed) and `models` (Eloquent models hydrated), return `true` if the query count exceeds `models + 1` (classic N+1 smell); otherwise `false`.
MD,
                'constraints' => '0 <= queries, models <= 100000',
                'examples' => [
                    ['input' => 'queries=25, models=10', 'output' => 'true'],
                    ['input' => 'queries=3, models=10', 'output' => 'false'],
                ],
                'cases' => [
                    ['label' => 'N+1', 'args' => [25, 10], 'expected' => 'true', 'sample' => true],
                    ['label' => 'Healthy', 'args' => [3, 10], 'expected' => 'false', 'sample' => true],
                    ['label' => 'Boundary equal', 'args' => [11, 10], 'expected' => 'false', 'sample' => false],
                    ['label' => 'Boundary above', 'args' => [12, 10], 'expected' => 'true', 'sample' => false],
                ],
            ],
            5 => [
                'title' => 'Migration Version Token',
                'entry_point' => 'migrationToken',
                'description' => <<<'MD'
Build a fake migration filename stem: `YmdHis` concatenated with `"_"`, then a snake_case `action`.

Given `stamp` like `"20260708120500"` and `action` like `"Add Cover Image"`, return `"20260708120500_add_cover_image"`.
MD,
                'constraints' => 'stamp is 14 digits; action is words',
                'examples' => [
                    ['input' => 'stamp, "Create Videos Table"', 'output' => '"20260708120500_create_videos_table"'],
                ],
                'cases' => [
                    ['label' => 'Example', 'args' => ['20260708120500', 'Create Videos Table'], 'expected' => '"20260708120500_create_videos_table"', 'sample' => true],
                    ['label' => 'Single word', 'args' => ['20260101000000', 'Init'], 'expected' => '"20260101000000_init"', 'sample' => false],
                    ['label' => 'Hidden', 'args' => ['20261231235959', 'Drop Temp Indexes'], 'expected' => '"20261231235959_drop_temp_indexes"', 'sample' => false],
                ],
            ],
            6 => [
                'title' => 'Password Policy Gate',
                'entry_point' => 'passwordPasses',
                'description' => <<<'MD'
Return `true` if a password:

- Length >= 8
- Contains at least one digit
- Contains at least one uppercase letter
MD,
                'constraints' => '1 <= password.length <= 100',
                'examples' => [
                    ['input' => '"Secret1"', 'output' => 'true'],
                    ['input' => '"secret"', 'output' => 'false'],
                ],
                'cases' => [
                    ['label' => 'Valid', 'args' => ['Secret1'], 'expected' => 'true', 'sample' => true],
                    ['label' => 'No digit', 'args' => ['SecretSecret'], 'expected' => 'false', 'sample' => true],
                    ['label' => 'Short', 'args' => ['Ab1'], 'expected' => 'false', 'sample' => false],
                    ['label' => 'Hidden ok', 'args' => ['DevForge9'], 'expected' => 'true', 'sample' => false],
                ],
            ],
            7 => [
                'title' => 'Role Gate',
                'entry_point' => 'canManagePaths',
                'description' => <<<'MD'
Given a role string, return `true` only for `"admin"`. Mentors and interns cannot manage paths.
MD,
                'constraints' => 'role is a lowercase string',
                'examples' => [
                    ['input' => '"admin"', 'output' => 'true'],
                    ['input' => '"mentor"', 'output' => 'false'],
                ],
                'cases' => [
                    ['label' => 'Admin', 'args' => ['admin'], 'expected' => 'true', 'sample' => true],
                    ['label' => 'Mentor', 'args' => ['mentor'], 'expected' => 'false', 'sample' => true],
                    ['label' => 'Intern', 'args' => ['intern'], 'expected' => 'false', 'sample' => false],
                ],
            ],
            8 => [
                'title' => 'Inertia Only Props Filter',
                'entry_point' => 'filterOnlyProps',
                'description' => <<<'MD'
Given an object/map of props as parallel arrays `keys` and `values`, and an allow-list `only`, return the list of values whose keys appear in `only`, preserving key order from `keys`.
MD,
                'constraints' => 'lengths of keys/values match; only contains unique strings',
                'examples' => [
                    ['input' => 'keys=["auth","paths","flash"], values=[1,2,3], only=["paths","flash"]', 'output' => '[2,3]'],
                ],
                'cases' => [
                    ['label' => 'Example', 'args' => [['auth', 'paths', 'flash'], [1, 2, 3], ['paths', 'flash']], 'expected' => '[2,3]', 'sample' => true],
                    ['label' => 'None', 'args' => [['a'], [9], ['b']], 'expected' => '[]', 'sample' => false],
                    ['label' => 'Hidden order', 'args' => [['z', 'a', 'm'], [7, 8, 9], ['m', 'z']], 'expected' => '[7,9]', 'sample' => false],
                ],
            ],
            9 => [
                'title' => 'Button Variant Resolver',
                'entry_point' => 'buttonVariant',
                'description' => <<<'MD'
Map an intent to Catalyst button color token:

- `"primary"` → `"dark/zinc"`
- `"danger"` → `"red"`
- anything else → `"zinc"`
MD,
                'constraints' => 'intent is non-empty string',
                'examples' => [
                    ['input' => '"primary"', 'output' => '"dark/zinc"'],
                    ['input' => '"danger"', 'output' => '"red"'],
                ],
                'cases' => [
                    ['label' => 'Primary', 'args' => ['primary'], 'expected' => '"dark/zinc"', 'sample' => true],
                    ['label' => 'Danger', 'args' => ['danger'], 'expected' => '"red"', 'sample' => true],
                    ['label' => 'Fallback', 'args' => ['ghost'], 'expected' => '"zinc"', 'sample' => false],
                ],
            ],
            10 => [
                'title' => 'Validation Error Count',
                'entry_point' => 'countFieldErrors',
                'description' => <<<'MD'
Given arrays `fields` and parallel `messages` (possibly empty strings meaning no error), return how many messages are non-empty after trim.
MD,
                'constraints' => 'arrays same length',
                'examples' => [
                    ['input' => '["email","password"], ["Required",""]', 'output' => '1'],
                ],
                'cases' => [
                    ['label' => 'One error', 'args' => [['email', 'password'], ['Required', '']], 'expected' => '1', 'sample' => true],
                    ['label' => 'Whitespace message', 'args' => [['name'], ['  ']], 'expected' => '0', 'sample' => false],
                    ['label' => 'All', 'args' => [['a', 'b'], ['x', 'y']], 'expected' => '2', 'sample' => false],
                ],
            ],
            11 => [
                'title' => 'Resource Cache Bust',
                'entry_point' => 'avatarUrl',
                'description' => <<<'MD'
Given `path` (storage path or empty) and `version` integer, return:

- `null` encoded as JSON `null` when path is empty/whitespace
- otherwise `"/storage/" + trimmedPath + "?v=" + version`
MD,
                'constraints' => 'version >= 0',
                'examples' => [
                    ['input' => '"avatars/1.png", 42', 'output' => '"/storage/avatars/1.png?v=42"'],
                    ['input' => '"", 1', 'output' => 'null'],
                ],
                'cases' => [
                    ['label' => 'With path', 'args' => ['avatars/1.png', 42], 'expected' => '"/storage/avatars/1.png?v=42"', 'sample' => true],
                    ['label' => 'Empty', 'args' => ['', 1], 'expected' => 'null', 'sample' => true],
                    ['label' => 'Trim', 'args' => [' covers/a.jpg ', 9], 'expected' => '"/storage/covers/a.jpg?v=9"', 'sample' => false],
                ],
            ],
            12 => [
                'title' => 'Pest Coverage Gate',
                'entry_point' => 'coveragePasses',
                'description' => <<<'MD'
Return `true` if `coveredLines / totalLines >= threshold` (threshold is a percentage 0–100). If `totalLines` is 0, return `false`.
MD,
                'constraints' => '0 <= coveredLines <= totalLines <= 100000; 0 <= threshold <= 100',
                'examples' => [
                    ['input' => '80,100,80', 'output' => 'true'],
                    ['input' => '79,100,80', 'output' => 'false'],
                ],
                'cases' => [
                    ['label' => 'Exact', 'args' => [80, 100, 80], 'expected' => 'true', 'sample' => true],
                    ['label' => 'Below', 'args' => [79, 100, 80], 'expected' => 'false', 'sample' => true],
                    ['label' => 'Zero total', 'args' => [0, 0, 50], 'expected' => 'false', 'sample' => false],
                    ['label' => 'Hidden', 'args' => [45, 50, 90], 'expected' => 'true', 'sample' => false],
                ],
            ],
            13 => [
                'title' => 'Job Backoff Delay',
                'entry_point' => 'backoffSeconds',
                'description' => <<<'MD'
Exponential backoff: `min(cap, base * 2^(attempt-1))` for attempt starting at 1.

All values are integers.
MD,
                'constraints' => '1 <= attempt <= 20; 1 <= base,cap <= 10000',
                'examples' => [
                    ['input' => 'attempt=1,base=5,cap=60', 'output' => '5'],
                    ['input' => 'attempt=5,base=5,cap=60', 'output' => '60'],
                ],
                'cases' => [
                    ['label' => 'First', 'args' => [1, 5, 60], 'expected' => '5', 'sample' => true],
                    ['label' => 'Capped', 'args' => [5, 5, 60], 'expected' => '60', 'sample' => true],
                    ['label' => 'Hidden mid', 'args' => [3, 5, 100], 'expected' => '20', 'sample' => false],
                ],
            ],
            14 => [
                'title' => 'Upload Size Gate',
                'entry_point' => 'uploadAllowed',
                'description' => <<<'MD'
Return `true` if `bytes <= maxMb * 1024 * 1024`.
MD,
                'constraints' => 'bytes >= 0; maxMb >= 1',
                'examples' => [
                    ['input' => 'bytes=1048576, maxMb=1', 'output' => 'true'],
                    ['input' => 'bytes=1048577, maxMb=1', 'output' => 'false'],
                ],
                'cases' => [
                    ['label' => 'Exact MB', 'args' => [1048576, 1], 'expected' => 'true', 'sample' => true],
                    ['label' => 'Over', 'args' => [1048577, 1], 'expected' => 'false', 'sample' => true],
                    ['label' => 'Hidden 100MB', 'args' => [104857600, 100], 'expected' => 'true', 'sample' => false],
                ],
            ],
            15 => [
                'title' => 'Notification Digest',
                'entry_point' => 'digestLabel',
                'description' => <<<'MD'
Given unread count `n`, return:

- `"All caught up"` when n == 0
- `"1 notification"` when n == 1
- `"{n} notifications"` otherwise
MD,
                'constraints' => '0 <= n <= 10000',
                'examples' => [
                    ['input' => '0', 'output' => '"All caught up"'],
                    ['input' => '2', 'output' => '"2 notifications"'],
                ],
                'cases' => [
                    ['label' => 'Zero', 'args' => [0], 'expected' => '"All caught up"', 'sample' => true],
                    ['label' => 'One', 'args' => [1], 'expected' => '"1 notification"', 'sample' => true],
                    ['label' => 'Many', 'args' => [12], 'expected' => '"12 notifications"', 'sample' => false],
                ],
            ],
            16 => [
                'title' => 'Cache Hit Ratio',
                'entry_point' => 'hitRatioPercent',
                'description' => <<<'MD'
Return the integer percent `floor(hits * 100 / (hits + misses))`. If both are 0, return 0.
MD,
                'constraints' => '0 <= hits,misses <= 1e9',
                'examples' => [
                    ['input' => '80,20', 'output' => '80'],
                    ['input' => '0,0', 'output' => '0'],
                ],
                'cases' => [
                    ['label' => '80%', 'args' => [80, 20], 'expected' => '80', 'sample' => true],
                    ['label' => 'Floor', 'args' => [1, 2], 'expected' => '33', 'sample' => true],
                    ['label' => 'Empty', 'args' => [0, 0], 'expected' => '0', 'sample' => false],
                ],
            ],
            17 => [
                'title' => 'IDOR Guard',
                'entry_point' => 'sameOwner',
                'description' => <<<'MD'
Return `true` only when `actorId === resourceOwnerId`.
MD,
                'constraints' => 'ids are positive integers',
                'examples' => [
                    ['input' => '5,5', 'output' => 'true'],
                    ['input' => '5,9', 'output' => 'false'],
                ],
                'cases' => [
                    ['label' => 'Match', 'args' => [5, 5], 'expected' => 'true', 'sample' => true],
                    ['label' => 'Mismatch', 'args' => [5, 9], 'expected' => 'false', 'sample' => true],
                    ['label' => 'Hidden', 'args' => [100, 100], 'expected' => 'true', 'sample' => false],
                ],
            ],
            18 => [
                'title' => 'Release Checklist Score',
                'entry_point' => 'releaseReady',
                'description' => <<<'MD'
Given flags for migrations, assetsBuilt, workers, and healthCheck, return `true` only if all four are true.
MD,
                'constraints' => 'all booleans',
                'examples' => [
                    ['input' => 'true,true,true,true', 'output' => 'true'],
                    ['input' => 'true,true,false,true', 'output' => 'false'],
                ],
                'cases' => [
                    ['label' => 'Ready', 'args' => [true, true, true, true], 'expected' => 'true', 'sample' => true],
                    ['label' => 'Workers down', 'args' => [true, true, false, true], 'expected' => 'false', 'sample' => true],
                    ['label' => 'Hidden', 'args' => [true, false, true, true], 'expected' => 'false', 'sample' => false],
                ],
            ],
            19 => [
                'title' => 'Review Severity Rank',
                'entry_point' => 'severityRank',
                'description' => <<<'MD'
Map review findings to ranks: `"blocker"=3`, `"major"=2`, `"nit"=1`, anything else `0`. Return the rank.
MD,
                'constraints' => 'finding is lowercase string',
                'examples' => [
                    ['input' => '"blocker"', 'output' => '3'],
                    ['input' => '"nit"', 'output' => '1'],
                ],
                'cases' => [
                    ['label' => 'Blocker', 'args' => ['blocker'], 'expected' => '3', 'sample' => true],
                    ['label' => 'Nit', 'args' => ['nit'], 'expected' => '1', 'sample' => true],
                    ['label' => 'Unknown', 'args' => ['praise'], 'expected' => '0', 'sample' => false],
                    ['label' => 'Major', 'args' => ['major'], 'expected' => '2', 'sample' => false],
                ],
                'requires_mentor_review' => true,
            ],
            20 => [
                'title' => 'Capstone Milestone Progress',
                'entry_point' => 'milestoneProgress',
                'description' => <<<'MD'
Given `approved` and `total` milestone counts, return the integer percent rounded via standard half-up (`round(approved/total*100)`). If total is 0, return 0.
MD,
                'constraints' => '0 <= approved <= total <= 1000',
                'examples' => [
                    ['input' => '1,2', 'output' => '50'],
                    ['input' => '2,3', 'output' => '67'],
                ],
                'cases' => [
                    ['label' => 'Half', 'args' => [1, 2], 'expected' => '50', 'sample' => true],
                    ['label' => 'Round', 'args' => [2, 3], 'expected' => '67', 'sample' => true],
                    ['label' => 'Empty', 'args' => [0, 0], 'expected' => '0', 'sample' => false],
                    ['label' => 'Complete', 'args' => [4, 4], 'expected' => '100', 'sample' => false],
                ],
                'requires_mentor_review' => true,
                'max_attempts' => 4,
                'time_limit_ms' => 2500,
            ],
            default => throw new \InvalidArgumentException("No challenge for level {$number}"),
        };
    }
}
