<?php

namespace App\Actions\Admin;

use App\Models\Level;
use App\Repositories\Contracts\LevelRepository;

final class UpdateLevel
{
    public function __construct(
        private readonly LevelRepository $levels,
    ) {}

    public function execute(Level $level, array $attributes): void
    {
        $this->levels->update($level, $attributes);
    }
}
