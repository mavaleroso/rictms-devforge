<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreCapstoneTemplateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() === true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:capstone_templates,slug'],
            'description' => ['nullable', 'string'],
            'objectives' => ['nullable', 'string'],
            'estimated_weeks' => ['required', 'integer', 'min:1', 'max:52'],
            'is_active' => ['required', 'boolean'],
            'requires_kickoff' => ['required', 'boolean'],
            'allow_parallel_milestones' => ['required', 'boolean'],
        ];
    }
}
