<?php

namespace App\Repositories\Eloquent;

use App\Models\CapstoneProject;
use App\Models\JournalEntry;
use App\Models\User;
use App\Repositories\Contracts\JournalEntryRepository;
use Illuminate\Support\Collection;

final class EloquentJournalEntryRepository implements JournalEntryRepository
{
    public function forProject(CapstoneProject $project, int $limit = 30): Collection
    {
        return $project->journalEntries()
            ->with(['user', 'milestone'])
            ->limit($limit)
            ->get();
    }

    public function findForProjectAndDate(CapstoneProject $project, User $user, string $date): ?JournalEntry
    {
        return JournalEntry::query()
            ->where('capstone_project_id', $project->id)
            ->where('user_id', $user->id)
            ->whereDate('entry_date', $date)
            ->first();
    }

    public function upsert(CapstoneProject $project, User $user, string $date, array $attributes): JournalEntry
    {
        return JournalEntry::updateOrCreate(
            [
                'capstone_project_id' => $project->id,
                'user_id' => $user->id,
                'entry_date' => $date,
            ],
            $attributes,
        );
    }
}
