<?php

namespace App\Services\Gamification;

final readonly class GamificationAward
{
    /**
     * @param  list<array{slug: string, name: string, icon: string, xp_bonus: int}>  $badges
     */
    public function __construct(
        public int $xp,
        public string $reason,
        public array $badges = [],
        public ?int $streak = null,
    ) {}

    /** @return array<string, mixed> */
    public function toArray(): array
    {
        return [
            'xp' => $this->xp,
            'reason' => $this->reason,
            'badges' => $this->badges,
            'streak' => $this->streak,
        ];
    }
}
