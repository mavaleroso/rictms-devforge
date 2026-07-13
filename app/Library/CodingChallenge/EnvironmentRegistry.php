<?php

namespace App\Library\CodingChallenge;

use App\Enums\ChallengeEnvironment;
use App\Enums\ChallengeLanguage;

final class EnvironmentRegistry
{
    /** @return list<array{id: string, label: string, short_label: string, description: string, stack: list<string>, default_language: string}> */
    public static function all(): array
    {
        return array_map(
            fn (ChallengeEnvironment $environment) => self::toArray($environment),
            ChallengeEnvironment::cases(),
        );
    }

    /** @return array{id: string, label: string, short_label: string, description: string, stack: list<string>, default_language: string} */
    public static function toArray(ChallengeEnvironment $environment): array
    {
        return [
            'id' => $environment->value,
            'label' => $environment->label(),
            'short_label' => $environment->shortLabel(),
            'description' => $environment->description(),
            'stack' => $environment->stack(),
            'default_language' => $environment->defaultLanguage()->value,
        ];
    }

    public static function get(ChallengeEnvironment|string $environment): ChallengeEnvironment
    {
        if ($environment instanceof ChallengeEnvironment) {
            return $environment;
        }

        return ChallengeEnvironment::from($environment);
    }

    public static function defaultStarter(
        ChallengeEnvironment $environment,
        ChallengeLanguage $language,
        string $entryPoint,
    ): string {
        $base = LanguageRegistry::defaultStarter($language, $entryPoint);

        if ($environment !== ChallengeEnvironment::LaravelInertiaReact) {
            return $base;
        }

        return match ($language) {
            ChallengeLanguage::Php => str_replace(
                'function '.$entryPoint,
                "/**\n * Laravel + Inertia + React academy challenge.\n * Keep this helper pure and testable — same discipline as Actions.\n */\nfunction ".$entryPoint,
                $base,
            ),
            ChallengeLanguage::Javascript => str_replace(
                "/**\n * @param {...any} args\n * @returns {any}\n */\nfunction ".$entryPoint,
                "/**\n * Frontend helper for the Laravel + Inertia + React stack.\n * Prefer pure logic you could later move into a React util or Inertia transform.\n *\n * @param {...any} args\n * @returns {any}\n */\nfunction ".$entryPoint,
                $base,
            ),
            ChallengeLanguage::Python => "# Laravel + Inertia + React academy challenge\n# Keep helpers pure — mirror Action / service discipline\n\n".$base,
        };
    }
}
