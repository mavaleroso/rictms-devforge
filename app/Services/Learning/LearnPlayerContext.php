<?php

namespace App\Services\Learning;

use App\Http\Resources\EnrollmentResource;
use App\Http\Resources\LearningMaterialResource;
use App\Http\Resources\LearningPathResource;
use App\Http\Resources\LevelResource;
use App\Http\Resources\VideoResource;
use App\Models\LearningMaterial;
use App\Models\LearningPath;
use App\Models\Level;
use App\Models\User;
use App\Models\Video;

final class LearnPlayerContext
{
    public function __construct(
        private readonly LearnPresentationService $presentation,
    ) {}

    /** @return array<string, mixed> */
    public function forLevel(LearningPath $path, Level $level, User $user): array
    {
        return [
            'path' => new LearningPathResource($this->presentation->pathWithProgress($path, $user)),
            'level' => new LevelResource($this->presentation->levelForPlayer($path, $level, $user)),
            'enrollment' => ($enrollment = $this->presentation->enrollmentForPath($user, $path))
                ? new EnrollmentResource($enrollment)
                : null,
        ];
    }

    /** @return array<string, mixed> */
    public function forMaterial(LearningMaterial $material, User $user): array
    {
        $material->loadMissing('files', 'level.learningPath');
        $level = $material->level;
        $path = $level->learningPath;

        $data = $this->forLevel($path, $level, $user);
        $data['material'] = new LearningMaterialResource(
            $this->presentation->materialForPlayer($material, $user),
        );

        return $data;
    }

    /** @return array<string, mixed> */
    public function forVideo(Video $video, User $user): array
    {
        $video->loadMissing('level.learningPath');
        $level = $video->level;
        $path = $level->learningPath;

        $data = $this->forLevel($path, $level, $user);
        $data['video'] = new VideoResource(
            $this->presentation->videoForPlayer($video, $user),
        );

        return $data;
    }
}
