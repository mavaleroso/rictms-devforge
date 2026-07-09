<?php

namespace App\Http\Requests\Admin;

use App\Enums\MaterialType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreLearningMaterialRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    public function rules(): array
    {
        return [
            'type' => ['required', Rule::enum(MaterialType::class)],
            'title' => ['required', 'string', 'max:255'],
            'content' => ['nullable', 'string'],
            'files' => ['sometimes', 'array'],
            'files.*' => [
                'file',
                'mimetypes:application/pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg,image/png,image/gif,image/webp',
                'max:25600',
            ],
            'sort_order' => ['integer', 'min:0'],
        ];
    }

    public function messages(): array
    {
        return [
            'files.*.mimetypes' => 'Resource files must be PDF, PowerPoint, Word, or an image.',
            'files.*.max' => 'Each resource file may not be larger than 25 MB.',
        ];
    }
}
