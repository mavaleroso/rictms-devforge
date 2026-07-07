<?php

namespace App\Repositories\Contracts;

use App\Models\LearningPath;
use App\Models\Level;
use Illuminate\Support\Collection;

interface LevelRepository
{
    /** @return Collection<int, Level> */
    public function orderedForPath(LearningPath|int $path): Collection;

    public function findNext(Level $level): ?Level;

    public function loadWithContent(Level $level): Level;

    public function update(Level $level, array $attributes): void;

    /** @return Collection<int, int> */
    public function materialIds(Level $level): Collection;

    /** @return Collection<int, int> */
    public function videoIds(Level $level): Collection;
}
