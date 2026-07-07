<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateQuizRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'passing_score' => ['integer', 'min:1', 'max:100'],
            'max_attempts' => ['integer', 'min:1', 'max:10'],
        ];
    }
}
