<?php

namespace App\Http\Resources;

use App\Models\LearningMaterial;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin LearningMaterial */
class LearningMaterialResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'type' => $this->type?->value,
            'title' => $this->title,
            'content' => $this->content,
            'files' => LearningMaterialFileResource::collection($this->whenLoaded('files')),
            'sort_order' => $this->sort_order,
            'completed' => $this->when(isset($this->completed), (bool) $this->completed),
        ];
    }
}
