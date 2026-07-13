<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\JournalEntry */
class JournalEntryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'entry_date' => $this->entry_date->toDateString(),
            'content' => $this->content,
            'mood' => $this->mood?->value,
            'hours_spent' => $this->hours_spent,
            'milestone_id' => $this->capstone_project_milestone_id,
            'milestone' => $this->whenLoaded('milestone', fn () => $this->milestone ? [
                'id' => $this->milestone->id,
                'title' => $this->milestone->title,
            ] : null),
            'user' => $this->whenLoaded('user', fn () => [
                'id' => $this->user->id,
                'name' => $this->user->name,
            ]),
        ];
    }
}
