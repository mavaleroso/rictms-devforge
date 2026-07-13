<?php

namespace App\Http\Requests\Admin;

use App\Enums\ChallengeEnvironment;
use App\Enums\ChallengeLanguage;
use App\Enums\ChallengeWorkspaceMode;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCodingChallengeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['sometimes', 'required', 'string'],
            'constraints' => ['nullable', 'string'],
            'examples' => ['nullable', 'array'],
            'examples.*.input' => ['required', 'string'],
            'examples.*.output' => ['required', 'string'],
            'examples.*.explanation' => ['nullable', 'string'],
            'language' => ['sometimes', 'required', Rule::enum(ChallengeLanguage::class)],
            'environment' => ['sometimes', 'required', Rule::enum(ChallengeEnvironment::class)],
            'workspace_mode' => ['sometimes', 'required', Rule::enum(ChallengeWorkspaceMode::class)],
            'template_key' => ['nullable', 'string', 'max:100'],
            'target_files' => ['nullable', 'array'],
            'target_files.*' => ['string', 'max:255'],
            'entry_point' => ['sometimes', 'required', 'string', 'max:100', 'regex:/^[a-zA-Z_][a-zA-Z0-9_]*$/'],
            'starter_code' => ['nullable', 'string', 'max:50000'],
            'time_limit_ms' => ['sometimes', 'required', 'integer', 'min:500', 'max:30000'],
            'memory_limit_mb' => ['sometimes', 'required', 'integer', 'min:16', 'max:512'],
            'max_attempts' => ['sometimes', 'required', 'integer', 'min:1', 'max:20'],
            'requires_mentor_review' => ['boolean'],
            'is_active' => ['boolean'],
            'sort_order' => ['integer', 'min:0'],
        ];
    }
}
