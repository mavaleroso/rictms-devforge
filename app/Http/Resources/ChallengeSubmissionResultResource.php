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
        $isSample = $this->relationLoaded('testCase') && (bool) $this->testCase?->is_sample;
        $showDetails = $request->user()?->isAdmin()
            || $request->user()?->isMentor()
            || $isSample;

        return [
            'id' => $this->id,
            'passed' => $this->passed,
            'actual_output' => $this->when($showDetails, $this->actual_output),
            // Generic message for hidden failures — do not leak expected/actual output.
            'error_message' => $showDetails
                ? $this->error_message
                : ($this->passed ? null : 'Hidden test failed.'),
            'runtime_ms' => $this->runtime_ms,
            'test_case' => $this->whenLoaded('testCase', fn () => new ChallengeTestCaseResource($this->testCase)),
        ];
    }
}
