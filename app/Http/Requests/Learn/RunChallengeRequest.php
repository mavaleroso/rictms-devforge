<?php

namespace App\Http\Requests\Learn;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RunChallengeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isIntern() ?? false;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'code' => ['nullable', 'string', 'max:50000'],
            'files' => ['nullable', 'array'],
            'files.*' => ['string', 'max:100000'],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            if (! $this->filled('code') && ! $this->filled('files')) {
                $validator->errors()->add('code', 'Provide code or project files to run.');
            }
        });
    }
}
