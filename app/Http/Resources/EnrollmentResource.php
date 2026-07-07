<?php

namespace App\Http\Resources;

use App\Models\Enrollment;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Enrollment */
class EnrollmentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'status' => $this->status?->value,
            'progress_percentage' => $this->progressPercentage(),
            'started_at' => $this->started_at?->toISOString(),
            'completed_at' => $this->completed_at?->toISOString(),
            'user' => $this->whenLoaded('user', fn () => [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'email' => $this->user->email,
            ]),
            'learning_path' => new LearningPathResource($this->whenLoaded('learningPath')),
            'mentor' => $this->whenLoaded('mentor', fn () => $this->mentor ? [
                'id' => $this->mentor->id,
                'name' => $this->mentor->name,
            ] : null),
            'current_level' => $this->when(
                $this->relationLoaded('levelProgress'),
                fn () => $this->currentLevel() ? new LevelResource($this->currentLevel()) : null
            ),
        ];
    }
}
