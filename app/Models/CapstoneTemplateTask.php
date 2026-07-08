<?php

namespace App\Models;

use App\Enums\CapstoneTaskPriority;
use App\Enums\CapstoneTaskStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CapstoneTemplateTask extends Model
{
    protected $fillable = [
        'capstone_template_id',
        'capstone_template_milestone_id',
        'title',
        'description',
        'default_status',
        'priority',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'default_status' => CapstoneTaskStatus::class,
            'priority' => CapstoneTaskPriority::class,
        ];
    }

    public function template(): BelongsTo
    {
        return $this->belongsTo(CapstoneTemplate::class, 'capstone_template_id');
    }

    public function milestone(): BelongsTo
    {
        return $this->belongsTo(CapstoneTemplateMilestone::class, 'capstone_template_milestone_id');
    }
}
