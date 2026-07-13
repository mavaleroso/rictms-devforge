<?php

namespace App\Models;

use App\Enums\JournalMood;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class JournalEntry extends Model
{
    protected $fillable = [
        'capstone_project_id',
        'user_id',
        'capstone_project_milestone_id',
        'entry_date',
        'content',
        'mood',
        'hours_spent',
    ];

    protected function casts(): array
    {
        return [
            'entry_date' => 'date',
            'mood' => JournalMood::class,
            'hours_spent' => 'decimal:1',
        ];
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(CapstoneProject::class, 'capstone_project_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function milestone(): BelongsTo
    {
        return $this->belongsTo(CapstoneProjectMilestone::class, 'capstone_project_milestone_id');
    }
}
