<?php

namespace App\Models;

use App\Enums\LevelDifficulty;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Level extends Model
{
    use HasFactory;

    protected $fillable = [
        'learning_path_id',
        'number',
        'title',
        'overview',
        'objectives',
        'expected_outcome',
        'estimated_minutes',
        'difficulty',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'difficulty' => LevelDifficulty::class,
        ];
    }

    public function learningPath(): BelongsTo
    {
        return $this->belongsTo(LearningPath::class);
    }

    public function materials(): HasMany
    {
        return $this->hasMany(LearningMaterial::class)->orderBy('sort_order');
    }

    public function videos(): HasMany
    {
        return $this->hasMany(Video::class)->orderBy('sort_order');
    }

    public function quiz(): HasOne
    {
        return $this->hasOne(Quiz::class);
    }

    public function codingChallenge(): HasOne
    {
        return $this->hasOne(CodingChallenge::class);
    }

    public function progressRecords(): HasMany
    {
        return $this->hasMany(LevelProgress::class);
    }
}
