<?php

namespace App\Http\Resources;

use App\Models\Level;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Level */
class LevelResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'learning_path_id' => $this->learning_path_id,
            'number' => $this->number,
            'title' => $this->title,
            'overview' => $this->overview,
            'objectives' => $this->objectives,
            'expected_outcome' => $this->expected_outcome,
            'estimated_minutes' => $this->estimated_minutes,
            'difficulty' => $this->difficulty?->value,
            'materials_count' => $this->whenCounted('materials'),
            'videos_count' => $this->whenCounted('videos'),
            'materials' => LearningMaterialResource::collection($this->whenLoaded('materials')),
            'videos' => VideoResource::collection($this->whenLoaded('videos')),
            'quiz' => new QuizResource($this->whenLoaded('quiz')),
            'coding_challenges' => CodingChallengeResource::collection($this->whenLoaded('codingChallenges')),
            'progress_status' => $this->when(isset($this->progress_status), $this->progress_status),
        ];
    }
}
