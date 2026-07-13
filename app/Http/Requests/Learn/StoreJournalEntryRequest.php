<?php

namespace App\Http\Requests\Learn;

use App\Enums\JournalMood;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreJournalEntryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isIntern() === true;
    }

    public function rules(): array
    {
        return [
            'entry_date' => ['required', 'date'],
            'content' => ['required', 'string', 'min:10'],
            'mood' => ['nullable', Rule::enum(JournalMood::class)],
            'hours_spent' => ['nullable', 'numeric', 'min:0', 'max:24'],
            'milestone_id' => ['nullable', 'integer'],
        ];
    }
}
