<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CapstoneTemplate extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'objectives',
        'estimated_weeks',
        'is_active',
        'requires_kickoff',
        'allow_parallel_milestones',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'requires_kickoff' => 'boolean',
            'allow_parallel_milestones' => 'boolean',
        ];
    }

    public function milestones(): HasMany
    {
        return $this->hasMany(CapstoneTemplateMilestone::class)->orderBy('sort_order');
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(CapstoneTemplateTask::class)->orderBy('sort_order');
    }
}
