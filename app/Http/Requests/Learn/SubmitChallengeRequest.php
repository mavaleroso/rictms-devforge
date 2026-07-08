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
            'code' => [Rule::requiredIf($source === 'editor'), 'nullable', 'string', 'max:50000'],
            'github_owner' => [Rule::requiredIf($source === 'github'), 'nullable', 'string', 'max:100'],
            'github_repo' => [Rule::requiredIf($source === 'github'), 'nullable', 'string', 'max:100'],
            'github_ref' => ['nullable', 'string', 'max:100'],
            'github_path' => [Rule::requiredIf($source === 'github'), 'nullable', 'string', 'max:255'],
        ];
    }
}
