<?php

namespace App\Actions\Admin;

use App\Models\LearningPath;
use App\Services\Admin\LearningPathService;
use Illuminate\Http\UploadedFile;

final class UpdateLearningPath
{
    public function __construct(
        private readonly LearningPathService $learningPaths,
    ) {}

    public function execute(
        LearningPath $path,
        array $attributes,
        ?UploadedFile $cover = null,
        bool $removeCover = false,
    ): void {
        $this->learningPaths->update($path, $attributes, $cover, $removeCover);
    }
}
