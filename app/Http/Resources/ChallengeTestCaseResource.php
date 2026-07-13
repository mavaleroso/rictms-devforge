<?php

namespace App\Http\Resources;

use App\Models\ChallengeTestCase;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin ChallengeTestCase */
class ChallengeTestCaseResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $canViewDetails = $request->user()?->isAdmin()
            || $request->user()?->isMentor()
            || $this->is_sample;

        return [
            'id' => $this->id,
            'label' => $canViewDetails ? $this->label : 'Hidden test',
            'assertion_type' => $this->assertion_type?->value ?? 'function_output',
            'target_path' => $this->when($canViewDetails, $this->target_path),
            'input' => $this->when($canViewDetails, $this->input),
            'expected_output' => $this->when($canViewDetails, $this->expected_output),
            'explanation' => $this->when($canViewDetails, $this->explanation),
            'is_sample' => $this->is_sample,
            'sort_order' => $this->sort_order,
        ];
    }
}
