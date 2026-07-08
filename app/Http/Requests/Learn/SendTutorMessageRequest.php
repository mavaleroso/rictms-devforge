<?php

namespace App\Http\Requests\Learn;

use Illuminate\Foundation\Http\FormRequest;

class SendTutorMessageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isIntern() ?? false;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'context_type' => ['required', 'string', 'max:50'],
            'context_id' => ['nullable', 'integer'],
            'level_id' => ['nullable', 'integer', 'exists:levels,id'],
            'title' => ['required', 'string', 'max:255'],
            'message' => ['required', 'string', 'max:2000'],
        ];
    }
}
