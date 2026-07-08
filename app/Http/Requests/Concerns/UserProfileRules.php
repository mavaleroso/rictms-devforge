<?php

namespace App\Http\Requests\Concerns;

use App\Enums\Sex;
use Illuminate\Validation\Rule;

trait UserProfileRules
{
    /**
     * @return array<string, mixed>
     */
    protected function profileRules(?int $ignoreUserId = null): array
    {
        return [
            'first_name' => ['required', 'string', 'max:100'],
            'middle_name' => ['nullable', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($ignoreUserId),
            ],
            'phone' => ['nullable', 'string', 'max:30'],
            'sex' => ['nullable', 'string', Rule::enum(Sex::class)],
            'birthdate' => ['nullable', 'date', 'before:today'],
            'address' => ['nullable', 'string', 'max:500'],
            'occupation' => ['nullable', 'string', 'max:150'],
            'bio' => ['nullable', 'string', 'max:1000'],
        ];
    }

    /**
     * @return array<string, string>
     */
    protected function profileMessages(): array
    {
        return [
            'first_name.required' => 'Please enter your first name.',
            'last_name.required' => 'Please enter your last name.',
            'email.required' => 'An email address is required.',
            'email.unique' => 'This email address is already registered.',
            'sex.in' => 'Please select a valid sex value.',
            'birthdate.before' => 'Birthdate must be in the past.',
        ];
    }
}
