<?php

namespace App\Services\Capstone;

use App\Models\CapstoneProject;
use App\Models\JournalEntry;
use App\Models\User;
use App\Repositories\Contracts\JournalEntryRepository;

final class JournalService
{
    public function __construct(
        private readonly JournalEntryRepository $entries,
    ) {}

    public function saveEntry(CapstoneProject $project, User $user, array $data): JournalEntry
    {
        $date = $data['entry_date'] ?? now()->toDateString();

        return $this->entries->upsert($project, $user, $date, [
            'content' => $data['content'],
            'mood' => $data['mood'] ?? null,
            'hours_spent' => $data['hours_spent'] ?? null,
        ]);
    }
}
