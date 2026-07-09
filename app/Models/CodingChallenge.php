<?php

namespace App\Models;

use App\Enums\ChallengeLanguage;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CodingChallenge extends Model
{
    use HasFactory;

    protected $fillable = [
        'level_id',
        'title',
        'slug',
        'description',
        'constraints',
        'examples',
        'language',
        'entry_point',
        'starter_code',
        'solution_code',
        'time_limit_ms',
        'memory_limit_mb',
        'max_attempts',
        'requires_mentor_review',
        'is_active',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'language' => ChallengeLanguage::class,
            'examples' => 'array',
            'requires_mentor_review' => 'boolean',
            'is_active' => 'boolean',
        ];
    }

    public function level(): BelongsTo
    {
        return $this->belongsTo(Level::class);
    }

    public function testCases(): HasMany
    {
        return $this->hasMany(ChallengeTestCase::class)->orderBy('sort_order');
    }

    public function submissions(): HasMany
    {
        return $this->hasMany(ChallengeSubmission::class);
    }

    public function sampleTestCases(): HasMany
    {
        return $this->testCases()->where('is_sample', true);
    }
}
