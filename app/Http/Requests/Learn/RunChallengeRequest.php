<?php

namespace App\Http\Requests\Learn;

use Illuminate\Foundation\Http\FormRequest;

class RunChallengeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isIntern() ?? false;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'code' => ['required', 'string', 'max:50000'],
        ];
    }
}
