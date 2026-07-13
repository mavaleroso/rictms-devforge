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
            'requires_mentor_signoff' => (bool) $this->requires_mentor_signoff,
            'allows_parallel' => (bool) $this->allows_parallel,
            'is_final_showcase' => (bool) $this->is_final_showcase,
            'submitted_at' => $this->submitted_at?->toIso8601String(),
            'reviewed_at' => $this->reviewed_at?->toIso8601String(),
            'submission_notes' => $this->submission_notes,
            'resubmission_notes' => $this->resubmission_notes,
            'deliverable_url' => $this->deliverable_url,
            'repo_url' => $this->repo_url,
            'demo_url' => $this->demo_url,
            'mentor_feedback' => $this->mentor_feedback,
            'mentor_score' => $this->mentor_score,
            'reviewer' => $this->whenLoaded('reviewer', fn () => $this->reviewer ? [
                'id' => $this->reviewer->id,
                'name' => $this->reviewer->name,
            ] : null),
            'project' => $this->whenLoaded('project', fn () => [
                'id' => $this->project->id,
                'title' => $this->project->title,
                'status' => $this->project->status->value,
                'enrollment' => $this->project->relationLoaded('enrollment') ? [
                    'user' => $this->project->enrollment->relationLoaded('user') ? [
                        'id' => $this->project->enrollment->user->id,
                        'name' => $this->project->enrollment->user->name,
                    ] : null,
                    'mentor' => $this->project->enrollment->mentor ? [
                        'id' => $this->project->enrollment->mentor->id,
                        'name' => $this->project->enrollment->mentor->name,
                    ] : null,
                ] : null,
            ]),
            'tasks' => CapstoneTaskResource::collection($this->whenLoaded('tasks')),
            'attachments' => CapstoneMilestoneAttachmentResource::collection($this->whenLoaded('attachments')),
        ];
    }
}
