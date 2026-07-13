<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreCapstoneTemplateMilestoneRequest extends FormRequest
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
            'sort_order' => ['nullable', 'integer', 'min:1'],
            'requires_mentor_signoff' => ['required', 'boolean'],
            'allows_parallel' => ['required', 'boolean'],
            'is_final_showcase' => ['required', 'boolean'],
        ];
    }
}
