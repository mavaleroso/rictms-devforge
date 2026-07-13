<?php

namespace App\Http\Requests\Learn;

use Illuminate\Foundation\Http\FormRequest;

class StartCapstoneProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isIntern() === true;
    }

    public function rules(): array
    {
        return [
            'template_id' => ['required', 'integer', 'exists:capstone_templates,id'],
        ];
    }
}
