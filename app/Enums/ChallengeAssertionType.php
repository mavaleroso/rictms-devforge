<?php

namespace App\Enums;

enum ChallengeAssertionType: string
{
    case FunctionOutput = 'function_output';
    case FileContains = 'file_contains';
    case FileRegex = 'file_regex';
    case FileExists = 'file_exists';
    case FileEquals = 'file_equals';

    public function label(): string
    {
        return match ($this) {
            self::FunctionOutput => 'Function output',
            self::FileContains => 'File contains',
            self::FileRegex => 'File matches regex',
            self::FileExists => 'File exists',
            self::FileEquals => 'File equals',
        };
    }
}
