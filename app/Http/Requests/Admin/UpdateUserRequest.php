<?php

namespace App\Http\Requests\Admin;

use App\Http\Requests\Concerns\UserProfileRules;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class UpdateUserRequest extends FormRequest
{
    use UserProfileRules;

    public function authorize(): bool
    {
        $user = $this->route('user');

        return $user && ($this->user()?->can('update', $user) ?? false);
    }

    public function rules(): array
    {
        return $this->profileRules($this->route('user')?->id) + [
            'password' => ['nullable', 'confirmed', Password::defaults()],
            'role' => ['required', 'string', Rule::in(['admin', 'mentor', 'intern'])],
            'avatar' => ['nullable', 'image', 'max:2048'],
            'remove_avatar' => ['boolean'],
        ];
    }

    public function messages(): array
    {
        return $this->profileMessages() + [
            'password.confirmed' => 'The password confirmation does not match.',
            'role.required' => 'Select a role for this user.',
            'role.in' => 'The selected role is invalid.',
            'avatar.image' => 'The avatar must be a valid image file.',
            'avatar.max' => 'The avatar may not be larger than 2 MB.',
        ];
    }
}
