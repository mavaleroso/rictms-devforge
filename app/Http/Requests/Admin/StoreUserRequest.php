<?php

namespace App\Http\Requests\Admin;

use App\Http\Requests\Admin\Concerns\UserProfileRules;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class StoreUserRequest extends FormRequest
{
    use UserProfileRules;

    public function authorize(): bool
    {
        return $this->user()?->can('create', \App\Models\User::class) ?? false;
    }

    public function rules(): array
    {
        return $this->profileRules() + [
            'password' => ['required', 'confirmed', Password::defaults()],
            'role' => ['required', 'string', Rule::in(['admin', 'mentor', 'intern'])],
            'avatar' => ['nullable', 'image', 'max:2048'],
        ];
    }

    public function messages(): array
    {
        return $this->profileMessages() + [
            'password.required' => 'Set an initial password for this account.',
            'password.confirmed' => 'The password confirmation does not match.',
            'role.required' => 'Select a role for this user.',
            'role.in' => 'The selected role is invalid.',
            'avatar.image' => 'The avatar must be a valid image file.',
            'avatar.max' => 'The avatar may not be larger than 2 MB.',
        ];
    }
}
