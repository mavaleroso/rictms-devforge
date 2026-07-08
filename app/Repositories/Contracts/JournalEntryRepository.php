<?php

namespace App\Repositories\Contracts;

use App\Models\CapstoneProject;
use App\Models\JournalEntry;
use App\Models\User;
use Illuminate\Support\Collection;

interface JournalEntryRepository
{
    /** @return Collection<int, JournalEntry> */
    public function forProject(CapstoneProject $project, int $limit = 30): Collection;

    public function findForProjectAndDate(CapstoneProject $project, User $user, string $date): ?JournalEntry;

    public function upsert(CapstoneProject $project, User $user, string $date, array $attributes): JournalEntry;
}
