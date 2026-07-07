<?php

namespace App\Http\Requests\Admin;

use App\Enums\LevelDifficulty;
use App\Models\LearningPath;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreLevelRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    public function rules(): array
    {
        /** @var LearningPath $path */
        $path = $this->route('path');

        return [
            'title' => ['required', 'string', 'max:255'],
            'number' => [
                'nullable',
                'integer',
                'min:1',
                Rule::unique('levels', 'number')->where('learning_path_id', $path->id),
            ],
            'overview' => ['nullable', 'string'],
            'estimated_minutes' => ['integer', 'min:15', 'max:600'],
            'difficulty' => ['required', Rule::enum(LevelDifficulty::class)],
        ];
    }
}
