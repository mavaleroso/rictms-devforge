<?php

namespace App\Http\Resources;

use App\Models\QuizOption;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin QuizOption */
class QuizOptionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'label' => $this->label,
            'is_correct' => $this->when($request->user()?->isAdmin(), (bool) $this->is_correct),
            'sort_order' => $this->sort_order,
        ];
    }
}
