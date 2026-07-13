<?php

namespace App\Http\Requests\Learn;

use App\Enums\CapstoneTaskPriority;
use App\Enums\CapstoneTaskStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCapstoneTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isIntern() === true;
    }

    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'status' => ['sometimes', Rule::enum(CapstoneTaskStatus::class)],
            'priority' => ['sometimes', Rule::enum(CapstoneTaskPriority::class)],
            'milestone_id' => ['nullable', 'integer'],
            'due_date' => ['nullable', 'date'],
        ];
    }
}
