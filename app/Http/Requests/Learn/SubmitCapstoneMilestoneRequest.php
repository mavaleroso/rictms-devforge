<?php

namespace App\Http\Requests\Learn;

use Illuminate\Foundation\Http\FormRequest;

class SubmitCapstoneMilestoneRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isIntern() === true;
    }

    public function rules(): array
    {
        return [
            'submission_notes' => ['nullable', 'string', 'max:5000'],
            'resubmission_notes' => ['nullable', 'string', 'max:5000'],
            'deliverable_url' => ['nullable', 'url', 'max:500'],
            'repo_url' => ['nullable', 'url', 'max:500'],
            'demo_url' => ['nullable', 'url', 'max:500'],
            'attachments' => ['sometimes', 'array', 'max:5'],
            'attachments.*' => [
                'file',
                'mimetypes:application/pdf,image/png,image/jpeg,image/webp,text/plain,application/zip,application/x-zip-compressed',
                'max:10240',
            ],
        ];
    }
}
