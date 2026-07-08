<?php

namespace App\Models;

use App\Enums\CapstoneTaskPriority;
use App\Enums\CapstoneTaskStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CapstoneTask extends Model
{
    protected $fillable = [
        'capstone_project_id',
        'capstone_project_milestone_id',
        'title',
        'description',
        'status',
        'priority',
        'assignee_id',
        'reporter_id',
        'due_date',
        'sort_order',
        'completed_at',
    ];

    protected function casts(): array
    {
        return [
            'status' => CapstoneTaskStatus::class,
            'priority' => CapstoneTaskPriority::class,
            'due_date' => 'date',
            'completed_at' => 'datetime',
        ];
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(CapstoneProject::class, 'capstone_project_id');
    }

    public function milestone(): BelongsTo
    {
        return $this->belongsTo(CapstoneProjectMilestone::class, 'capstone_project_milestone_id');
    }

    public function assignee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assignee_id');
    }

    public function reporter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reporter_id');
    }
}
