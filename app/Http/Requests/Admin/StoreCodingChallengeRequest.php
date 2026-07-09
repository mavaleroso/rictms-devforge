<?php

namespace App\Http\Requests\Admin;

use App\Enums\ChallengeLanguage;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCodingChallengeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'constraints' => ['nullable', 'string'],
            'examples' => ['nullable', 'array'],
            'examples.*.input' => ['required', 'string'],
            'examples.*.output' => ['required', 'string'],
            'examples.*.explanation' => ['nullable', 'string'],
            'language' => ['required', Rule::enum(ChallengeLanguage::class)],
            'entry_point' => ['required', 'string', 'max:100', 'regex:/^[a-zA-Z_][a-zA-Z0-9_]*$/'],
            'starter_code' => ['nullable', 'string', 'max:50000'],
            'time_limit_ms' => ['required', 'integer', 'min:500', 'max:30000'],
            'memory_limit_mb' => ['required', 'integer', 'min:16', 'max:512'],
            'max_attempts' => ['required', 'integer', 'min:1', 'max:20'],
            'requires_mentor_review' => ['boolean'],
            'is_active' => ['boolean'],
            'sort_order' => ['integer', 'min:0'],
        ];
    }
}
