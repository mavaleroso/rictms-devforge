<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateChallengeTestCaseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'label' => ['nullable', 'string', 'max:100'],
            'input' => ['required', 'array'],
            'input.args' => ['required', 'array'],
            'expected_output' => ['required', 'string', 'max:10000'],
            'explanation' => ['nullable', 'string', 'max:2000'],
            'is_sample' => ['boolean'],
        ];
    }
}
