<?php

namespace App\Repositories\Eloquent;

use App\Models\LearningMaterial;
use App\Models\Level;
use App\Repositories\Contracts\LearningMaterialRepository;

final class EloquentLearningMaterialRepository implements LearningMaterialRepository
{
    public function createForLevel(Level $level, array $attributes): LearningMaterial
    {
        return $level->materials()->create($attributes);
    }

    public function update(LearningMaterial $material, array $attributes): void
    {
        $material->update($attributes);
    }

    public function delete(LearningMaterial $material): void
    {
        $material->delete();
    }
}
