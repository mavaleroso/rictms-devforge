<?php

namespace App\Repositories\Contracts;

use App\Models\LearningPath;
use Illuminate\Support\Collection;

interface LearningPathRepository
{
    /** @return Collection<int, LearningPath> */
    public function listWithLevelCount(): Collection;

    /** @return Collection<int, LearningPath> */
    public function activeWithLevelCount(): Collection;

    /** @return Collection<int, LearningPath> */
    public function activeList(array $columns = ['*']): Collection;

    public function activeCount(): int;

    public function create(array $attributes): LearningPath;

    public function update(LearningPath $path, array $attributes): void;

    public function loadWithOrderedLevels(LearningPath $path): LearningPath;

    public function findById(int $id): LearningPath;

    public function delete(LearningPath $path): void;
}
