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
        return [
            'id' => $this->id,
            'label' => $this->label,
            'input' => $this->input,
            'expected_output' => $this->when(
                $request->user()?->isAdmin() || $this->is_sample,
                $this->expected_output,
            ),
            'explanation' => $this->explanation,
            'is_sample' => $this->is_sample,
            'sort_order' => $this->sort_order,
        ];
    }
}
