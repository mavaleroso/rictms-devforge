<?php

namespace App\Http\Resources;

use App\Models\Quiz;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Quiz */
class QuizResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'passing_score' => $this->passing_score,
            'max_attempts' => $this->max_attempts,
            'questions_count' => $this->whenCounted('questions'),
            'questions' => QuizQuestionResource::collection($this->whenLoaded('questions')),
            'attempts_used' => $this->when(isset($this->attempts_used), $this->attempts_used),
            'best_score' => $this->when(isset($this->best_score), $this->best_score),
            'passed' => $this->when(isset($this->passed), (bool) $this->passed),
        ];
    }
}
