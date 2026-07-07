<?php

namespace App\Http\Requests\Admin;

use App\Enums\MaterialType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateLearningMaterialRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    public function rules(): array
    {
        return [
            'type' => ['sometimes', Rule::enum(MaterialType::class)],
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'content' => ['nullable', 'string'],
            'file_path' => ['nullable', 'string', 'max:500'],
            'sort_order' => ['integer', 'min:0'],
        ];
    }
}
