<?php

namespace App\Models;

use App\Enums\ProgressStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LevelProgress extends Model
{
    use HasFactory;

    protected $table = 'level_progress';

    protected $fillable = [
        'enrollment_id',
        'level_id',
        'status',
        'completed_at',
    ];

    protected function casts(): array
    {
        return [
            'status' => ProgressStatus::class,
            'completed_at' => 'datetime',
        ];
    }

    public function enrollment(): BelongsTo
    {
        return $this->belongsTo(Enrollment::class);
    }

    public function level(): BelongsTo
    {
        return $this->belongsTo(Level::class);
    }
}
