<?php

namespace App\Enums;

enum ChallengeWorkspaceMode: string
{
    case SingleFile = 'single_file';
    case Project = 'project';

    public function label(): string
    {
        return match ($this) {
            self::SingleFile => 'Single file',
            self::Project => 'Project workspace',
        };
    }
}
