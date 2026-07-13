<?php

namespace App\Http\Requests\Mentor;

use Illuminate\Foundation\Http\FormRequest;

class ReviewCapstoneMilestoneRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isMentor() === true;
    }

    public function rules(): array
    {
        return [
            'status' => ['required', 'in:approved,rejected'],
            'mentor_feedback' => ['nullable', 'string', 'max:5000'],
            'mentor_score' => ['nullable', 'integer', 'min:0', 'max:100'],
        ];
    }
}
