<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\CapstoneProject */
class CapstoneProjectResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'status' => $this->status->value,
            'started_at' => $this->started_at?->toIso8601String(),
            'completed_at' => $this->completed_at?->toIso8601String(),
            'template' => new CapstoneTemplateResource($this->whenLoaded('template')),
            'milestones' => CapstoneProjectMilestoneResource::collection($this->whenLoaded('milestones')),
            'tasks' => CapstoneTaskResource::collection($this->whenLoaded('tasks')),
            'enrollment' => $this->whenLoaded('enrollment', fn () => [
                'id' => $this->enrollment->id,
                'mentor' => $this->enrollment->mentor ? [
                    'id' => $this->enrollment->mentor->id,
                    'name' => $this->enrollment->mentor->name,
                ] : null,
            ]),
            'stats' => $this->when(isset($this->stats), fn () => $this->stats),
        ];
    }
}