<?php

namespace App\Http\Requests\Admin;

use App\Enums\LevelDifficulty;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateLevelRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'overview' => ['nullable', 'string'],
            'objectives' => ['nullable', 'string'],
            'expected_outcome' => ['nullable', 'string'],
            'estimated_minutes' => ['integer', 'min:1'],
            'difficulty' => ['string', Rule::enum(LevelDifficulty::class)],
        ];
    }
}
