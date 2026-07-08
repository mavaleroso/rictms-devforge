<?php

namespace App\Http\Resources;

use App\Models\ChallengeSubmissionResult;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin ChallengeSubmissionResult */
class ChallengeSubmissionResultResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $showDetails = $request->user()?->isAdmin()
            || $request->user()?->isMentor()
            || ($this->relationLoaded('testCase') && $this->testCase?->is_sample);

        return [
            'id' => $this->id,
            'passed' => $this->passed,
            'actual_output' => $this->when($showDetails, $this->actual_output),
            'error_message' => $this->error_message,
            'runtime_ms' => $this->runtime_ms,
            'test_case' => $this->whenLoaded('testCase', fn () => new ChallengeTestCaseResource($this->testCase)),
        ];
    }
}
