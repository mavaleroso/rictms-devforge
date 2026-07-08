<?php

namespace App\Http\Requests\Settings;

use Illuminate\Foundation\Http\FormRequest;

class UpdateGitHubIntegrationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'github_username' => ['required', 'string', 'max:100'],
            'github_token' => ['required', 'string', 'max:500'],
        ];
    }
}
