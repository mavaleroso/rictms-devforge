<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\CapstoneTemplate */
class CapstoneTemplateResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'objectives' => $this->objectives,
            'estimated_weeks' => $this->estimated_weeks,
            'is_active' => $this->is_active,
            'milestones_count' => $this->whenCounted('milestones'),
            'tasks_count' => $this->whenCounted('tasks'),
            'milestones' => CapstoneTemplateMilestoneResource::collection($this->whenLoaded('milestones')),
            'tasks' => CapstoneTemplateTaskResource::collection($this->whenLoaded('tasks')),
        ];
    }
}
