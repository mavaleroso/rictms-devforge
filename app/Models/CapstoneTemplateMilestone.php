<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CapstoneTemplateMilestone extends Model
{
    protected $fillable = [
        'capstone_template_id',
        'title',
        'description',
        'sort_order',
        'requires_mentor_signoff',
    ];

    protected function casts(): array
    {
        return [
            'requires_mentor_signoff' => 'boolean',
        ];
    }

    public function template(): BelongsTo
    {
        return $this->belongsTo(CapstoneTemplate::class, 'capstone_template_id');
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(CapstoneTemplateTask::class)->orderBy('sort_order');
    }
}
