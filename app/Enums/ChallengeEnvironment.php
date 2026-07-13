<?php

namespace App\Enums;

enum ChallengeEnvironment: string
{
    case LaravelInertiaReact = 'laravel_inertia_react';

    public function label(): string
    {
        return match ($this) {
            self::LaravelInertiaReact => 'Laravel + Inertia + React',
        };
    }

    public function shortLabel(): string
    {
        return match ($this) {
            self::LaravelInertiaReact => 'Laravel / Inertia / React',
        };
    }

    public function description(): string
    {
        return match ($this) {
            self::LaravelInertiaReact => 'Full-stack DevForge stack used at every level: Laravel 12, Inertia.js, React, and Catalyst UI.',
        };
    }

    /** @return list<string> */
    public function stack(): array
    {
        return match ($this) {
            self::LaravelInertiaReact => [
                'Laravel 12',
                'Inertia.js',
                'React',
                'Catalyst UI',
                'PHP 8.3',
                'Vite',
            ],
        };
    }

    public function defaultLanguage(): ChallengeLanguage
    {
        return match ($this) {
            self::LaravelInertiaReact => ChallengeLanguage::Php,
        };
    }
}
