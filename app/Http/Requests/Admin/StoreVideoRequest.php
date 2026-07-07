<?php

namespace App\Http\Requests\Admin;

use App\Enums\VideoProvider;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreVideoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'provider' => ['required', Rule::enum(VideoProvider::class)],
            'url' => ['nullable', 'string', 'max:500'],
            'file_path' => ['nullable', 'string', 'max:500'],
            'sort_order' => ['integer', 'min:0'],
        ];
    }
}
