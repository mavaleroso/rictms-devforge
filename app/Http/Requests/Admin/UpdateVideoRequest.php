<?php

namespace App\Http\Requests\Admin;

use App\Enums\VideoProvider;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateVideoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'caption' => ['nullable', 'string'],
            'provider' => ['sometimes', Rule::enum(VideoProvider::class)],
            'url' => ['nullable', 'string', 'max:500'],
            'file' => [
                'nullable',
                'file',
                'mimetypes:video/mp4,video/webm,video/quicktime,video/x-msvideo',
                'max:102400',
            ],
            'sort_order' => ['integer', 'min:0'],
        ];
    }

    public function messages(): array
    {
        return [
            'file.mimetypes' => 'Uploaded videos must be MP4, WebM, MOV, or AVI.',
            'file.max' => 'Uploaded videos may not be larger than 100 MB.',
        ];
    }
}
