<?php

namespace App\Actions\Admin;

use App\Models\LearningPath;
use App\Models\Level;
use App\Services\Admin\LevelService;

final class CreateLevel
{
    public function __construct(
        private readonly LevelService $levels,
    ) {}

    public function execute(LearningPath $path, array $attributes): Level
    {
        return $this->levels->createForPath($path, $attributes);
    }
}
