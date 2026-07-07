<?php

namespace App\Actions\Admin;

use App\Models\LearningPath;
use App\Services\Admin\LearningPathService;
use Illuminate\Http\UploadedFile;

final class CreateLearningPath
{
    public function __construct(
        private readonly LearningPathService $learningPaths,
    ) {}

    public function execute(array $attributes, ?UploadedFile $cover = null): LearningPath
    {
        return $this->learningPaths->create($attributes, $cover);
    }
}
