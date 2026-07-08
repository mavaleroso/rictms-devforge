<?php

namespace App\Models;

use App\Enums\CapstoneMilestoneStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CapstoneProjectMilestone extends Model
{
    protected $fillable = [
        'capstone_project_id',
        'capstone_template_milestone_id',
        'title',
        'description',
        'status',
        'sort_order',
        'submitted_at',
        'reviewer_id',
        'mentor_feedback',
        'mentor_score',
        'reviewed_at',
    ];

    protected function casts(): array
    {
        return [
            'status' => CapstoneMilestoneStatus::class,
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

    public function tasks(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(CapstoneTask::class)->orderBy('sort_order');
    }
}
