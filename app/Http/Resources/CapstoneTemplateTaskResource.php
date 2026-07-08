<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\CapstoneTemplateTask */
class CapstoneTemplateTaskResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'default_status' => $this->default_status?->value,
            'priority' => $this->priority?->value,
            'capstone_template_milestone_id' => $this->capstone_template_milestone_id,
            'sort_order' => $this->sort_order,
        ];
    }
}
