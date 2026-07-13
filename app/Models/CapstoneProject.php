<?php

namespace App\Models;

use App\Enums\CapstoneProjectStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CapstoneProject extends Model
{
    protected $fillable = [
        'enrollment_id',
        'capstone_template_id',
        'level_id',
        'title',
        'description',
        'status',
        'allow_parallel_milestones',
        'started_at',
        'kickoff_approved_at',
        'kickoff_reviewer_id',
        'completed_at',
        'archived_at',
    ];

    protected function casts(): array
    {
        return [
            'status' => CapstoneProjectStatus::class,
            'allow_parallel_milestones' => 'boolean',
            'started_at' => 'datetime',
            'kickoff_approved_at' => 'datetime',
            'completed_at' => 'datetime',
            'archived_at' => 'datetime',
        ];
    }

    public function enrollment(): BelongsTo
    {
        return $this->belongsTo(Enrollment::class);
    }

    public function template(): BelongsTo
    {
        return $this->belongsTo(CapstoneTemplate::class, 'capstone_template_id');
    }

    public function level(): BelongsTo
    {
        return $this->belongsTo(Level::class);
    }

    public function kickoffReviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'kickoff_reviewer_id');
    }

    public function milestones(): HasMany
    {
        return $this->hasMany(CapstoneProjectMilestone::class)->orderBy('sort_order');
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(CapstoneTask::class)->orderBy('sort_order');
    }

    public function journalEntries(): HasMany
    {
        return $this->hasMany(JournalEntry::class)->orderByDesc('entry_date');
    }

    public function needsKickoff(): bool
    {
        return $this->status === CapstoneProjectStatus::Draft && $this->kickoff_approved_at === null;
    }

    public function isActiveWork(): bool
    {
        return $this->status === CapstoneProjectStatus::Active;
    }
}
