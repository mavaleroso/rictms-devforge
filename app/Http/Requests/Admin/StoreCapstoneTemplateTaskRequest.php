<?php

namespace App\Http\Requests\Admin;

use App\Enums\CapstoneTaskPriority;
use App\Enums\CapstoneTaskStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCapstoneTemplateTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() === true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'capstone_template_milestone_id' => ['nullable', 'integer'],
            'default_status' => ['nullable', Rule::enum(CapstoneTaskStatus::class)],
            'priority' => ['nullable', Rule::enum(CapstoneTaskPriority::class)],
            'sort_order' => ['nullable', 'integer', 'min:1'],
        ];
    }
}
