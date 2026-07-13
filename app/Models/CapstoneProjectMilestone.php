<?php

namespace App\Models;

use App\Enums\CapstoneMilestoneStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CapstoneProjectMilestone extends Model
{
    protected $fillable = [
        'capstone_project_id',
        'capstone_template_milestone_id',
        'title',
        'description',
        'status',
        'sort_order',
        'requires_mentor_signoff',
        'allows_parallel',
        'is_final_showcase',
        'submitted_at',
        'submission_notes',
        'deliverable_url',
        'repo_url',
        'demo_url',
        'resubmission_notes',
        'reviewer_id',
        'mentor_feedback',
        'mentor_score',
        'reviewed_at',
    ];

    protected function casts(): array
    {
        return [
            'status' => CapstoneMilestoneStatus::class,
            'requires_mentor_signoff' => 'boolean',
            'allows_parallel' => 'boolean',
            'is_final_showcase' => 'boolean',
            'submitted_at' => 'datetime',
            'reviewed_at' => 'datetime',
        ];
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(CapstoneProject::class, 'capstone_project_id');
    }

    public function templateMilestone(): BelongsTo
    {
        return $this->belongsTo(CapstoneTemplateMilestone::class, 'capstone_template_milestone_id');
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(CapstoneTask::class)->orderBy('sort_order');
    }

    public function attachments(): HasMany
    {
        return $this->hasMany(CapstoneMilestoneAttachment::class)->orderBy('sort_order');
    }

    public function journalEntries(): HasMany
    {
        return $this->hasMany(JournalEntry::class)->orderByDesc('entry_date');
    }
}
