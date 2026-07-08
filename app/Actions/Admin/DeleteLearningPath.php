<?php

namespace App\Actions\Admin;

use App\Models\LearningPath;
use App\Services\Admin\LearningPathService;

final class DeleteLearningPath
{
    public function __construct(
        private readonly LearningPathService $learningPaths,
    ) {}

    public function execute(LearningPath $path): void
    {
        $this->learningPaths->delete($path);
    }
}
