<?php

namespace App\Http\Requests\Mentor;

use App\Enums\SubmissionStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ReviewChallengeSubmissionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isMentor() ?? false;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'status' => ['required', Rule::in([SubmissionStatus::Approved->value, SubmissionStatus::Rejected->value])],
            'mentor_feedback' => ['nullable', 'string', 'max:5000'],
            'mentor_score' => ['nullable', 'integer', 'min:0', 'max:100'],
        ];
    }
}
