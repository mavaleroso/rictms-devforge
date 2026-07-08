<?php

namespace App\Enums;

enum ChallengeLanguage: string
{
    case Php = 'php';
    case Javascript = 'javascript';
    case Python = 'python';

    public function label(): string
    {
        return match ($this) {
            self::Php => 'PHP',
            self::Javascript => 'JavaScript',
            self::Python => 'Python',
        };
    }
}
