<?php

namespace App\Http\Resources;

use App\Models\CodingChallenge;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin CodingChallenge */
class CodingChallengeResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'level_id' => $this->level_id,
            'title' => $this->title,
            'slug' => $this->slug,
            'description' => $this->description,
            'constraints' => $this->constraints,
            'examples' => $this->examples ?? [],
            'language' => $this->language?->value,
            'entry_point' => $this->entry_point,
            'starter_code' => $this->starter_code,
            'time_limit_ms' => $this->time_limit_ms,
            'memory_limit_mb' => $this->memory_limit_mb,
            'max_attempts' => $this->max_attempts,
            'requires_mentor_review' => $this->requires_mentor_review,
            'is_active' => $this->is_active,
            'test_cases_count' => $this->whenCounted('testCases'),
            'test_cases' => ChallengeTestCaseResource::collection($this->whenLoaded('testCases')),
            'attempts_used' => $this->when(isset($this->attempts_used), $this->attempts_used),
            'tests_passed' => $this->when(isset($this->tests_passed), $this->tests_passed),
            'tests_total' => $this->when(isset($this->tests_total), $this->tests_total),
            'passed' => $this->when(isset($this->passed), $this->passed),
            'status' => $this->when(isset($this->status), $this->status),
        ];
    }
}
