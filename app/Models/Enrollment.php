<?php

namespace App\Models;

use App\Enums\EnrollmentStatus;
use App\Enums\ProgressStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Enrollment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'learning_path_id',
        'mentor_id',
        'status',
        'started_at',
        'completed_at',
    ];

    protected function casts(): array
    {
        return [
            'status' => EnrollmentStatus::class,
            'started_at' => 'datetime',
            'completed_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function learningPath(): BelongsTo
    {
        return $this->belongsTo(LearningPath::class);
    }

    public function mentor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'mentor_id');
    }

    public function levelProgress(): HasMany
    {
        return $this->hasMany(LevelProgress::class);
    }

    public function capstoneProject(): HasOne
    {
        return $this->hasOne(CapstoneProject::class);
    }

    public function certificate(): HasOne
    {
        return $this->hasOne(Certificate::class);
    }

    public function progressPercentage(): int
    {
        $total = $this->levelProgress()->count();

        if ($total === 0) {
            return 0;
        }

        $completed = $this->levelProgress()
            ->where('status', ProgressStatus::Completed)
            ->count();

        return (int) round(($completed / $total) * 100);
    }

    public function currentLevel(): ?Level
    {
        return $this->levelProgress()
            ->with('level')
            ->get()
            ->filter(fn (LevelProgress $p) => in_array($p->status, [
                ProgressStatus::Available,
                ProgressStatus::InProgress,
            ], true))
            ->sortBy(fn (LevelProgress $p) => $p->level->number)
            ->first()?->level;
    }
}
