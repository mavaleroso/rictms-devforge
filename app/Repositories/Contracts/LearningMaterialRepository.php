<?php

namespace App\Repositories\Contracts;

use App\Models\LearningMaterial;
use App\Models\Level;

interface LearningMaterialRepository
{
    public function createForLevel(Level $level, array $attributes): LearningMaterial;

    public function update(LearningMaterial $material, array $attributes): void;

    public function delete(LearningMaterial $material): void;
}
