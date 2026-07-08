<?php

namespace App\Library\Gamification;

final readonly class XpTier
{
    public function __construct(
        public string $slug,
        public string $label,
        public int $minXp,
        public string $color,
    ) {}
}
