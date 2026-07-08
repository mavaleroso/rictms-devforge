<?php

namespace App\Http\Requests\Settings;

use App\Http\Requests\Concerns\UserProfileRules;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ProfileUpdateRequest extends FormRequest
{
    use UserProfileRules;

    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return $this->profileRules($this->user()->id) + [
            'avatar' => ['nullable', 'image', 'max:2048'],
            'remove_avatar' => ['boolean'],
        ];
    }

    public function messages(): array
    {
        return $this->profileMessages() + [
            'avatar.image' => 'The avatar must be a valid image file.',
            'avatar.max' => 'The avatar may not be larger than 2 MB.',
        ];
    }
}
