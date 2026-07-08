<?php

namespace App\Library\CodingChallenge;

final readonly class LanguageDefinition
{
    public function __construct(
        public string $id,
        public string $label,
        public string $monacoId,
        public string $binary,
        public string $fileExtension,
        public string $starterTemplate,
    ) {}
}
