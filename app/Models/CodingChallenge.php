<?php

namespace App\Models;

use App\Enums\ChallengeEnvironment;
use App\Enums\ChallengeLanguage;
use App\Enums\ChallengeWorkspaceMode;
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
        'environment',
        'workspace_mode',
        'template_key',
        'target_files',
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
            'environment' => ChallengeEnvironment::class,
            'workspace_mode' => ChallengeWorkspaceMode::class,
            'target_files' => 'array',
            'examples' => 'array',
            'requires_mentor_review' => 'boolean',
            'is_active' => 'boolean',
        ];
    }

    public function isProjectWorkspace(): bool
    {
        return $this->workspace_mode === ChallengeWorkspaceMode::Project;
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
