<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\CapstoneProjectMilestone */
class CapstoneProjectMilestoneResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'status' => $this->status->value,
            'sort_order' => $this->sort_order,
            'submitted_at' => $this->submitted_at?->toIso8601String(),
            'reviewed_at' => $this->reviewed_at?->toIso8601String(),
            'mentor_feedback' => $this->mentor_feedback,
            'mentor_score' => $this->mentor_score,
            'reviewer' => $this->whenLoaded('reviewer', fn () => $this->reviewer ? [
                'id' => $this->reviewer->id,
                'name' => $this->reviewer->name,
            ] : null),
            'project' => $this->whenLoaded('project', fn () => [
                'id' => $this->project->id,
                'title' => $this->project->title,
                'enrollment' => $this->project->relationLoaded('enrollment') ? [
                    'user' => $this->project->enrollment->relationLoaded('user') ? [
                        'id' => $this->project->enrollment->user->id,
                        'name' => $this->project->enrollment->user->name,
                    ] : null,
                ] : null,
            ]),
            'tasks' => CapstoneTaskResource::collection($this->whenLoaded('tasks')),
        ];
    }
}
