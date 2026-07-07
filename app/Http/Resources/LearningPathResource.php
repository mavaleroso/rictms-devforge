<?php

namespace App\Http\Resources;

use App\Models\LearningPath;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin LearningPath */
class LearningPathResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'icon' => $this->icon,
            'cover_image_url' => $this->cover_image
                ? Storage::disk('public')->url($this->cover_image).'?v='.$this->updated_at?->timestamp
                : null,
            'is_active' => $this->is_active,
            'sort_order' => $this->sort_order,
            'levels_count' => $this->whenCounted('levels'),
            'enrollments_count' => $this->whenCounted('enrollments'),
            'total_estimated_minutes' => (int) (
                $this->relationLoaded('levels')
                    ? $this->levels->sum('estimated_minutes')
                    : ($this->total_estimated_minutes ?? 0)
            ),
            'levels' => LevelResource::collection($this->whenLoaded('levels')),
        ];
    }
}
