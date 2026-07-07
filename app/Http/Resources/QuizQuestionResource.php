<?php

namespace App\Http\Resources;

use App\Models\QuizQuestion;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin QuizQuestion */
class QuizQuestionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'type' => $this->type?->value,
            'question' => $this->question,
            'points' => $this->points,
            'sort_order' => $this->sort_order,
            'options' => QuizOptionResource::collection($this->whenLoaded('options')),
            'correct_answer' => $this->when($request->user()?->isAdmin(), $this->correct_answer),
        ];
    }
}
