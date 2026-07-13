<?php

namespace App\Http\Requests\Learn;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SubmitChallengeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isIntern() ?? false;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        $source = $this->input('source', 'editor');

        return [
            'source' => ['sometimes', Rule::in(['editor', 'github'])],
            'code' => ['nullable', 'string', 'max:50000'],
            'files' => ['nullable', 'array'],
            'files.*' => ['string', 'max:100000'],
            'github_owner' => [Rule::requiredIf($source === 'github'), 'nullable', 'string', 'max:100'],
            'github_repo' => [Rule::requiredIf($source === 'github'), 'nullable', 'string', 'max:100'],
            'github_ref' => ['nullable', 'string', 'max:100'],
            'github_path' => [Rule::requiredIf($source === 'github'), 'nullable', 'string', 'max:255'],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $source = $this->input('source', 'editor');

            if ($source === 'editor' && ! $this->filled('code') && ! $this->filled('files')) {
                $validator->errors()->add('code', 'Provide code or project files to submit.');
            }
        });
    }
}
