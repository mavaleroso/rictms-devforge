<?php

namespace App\Models;

use App\Enums\ChallengeLanguage;
use App\Enums\EvaluationDriver;
use App\Enums\SubmissionSource;
use App\Enums\SubmissionStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ChallengeSubmission extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'coding_challenge_id',
        'code',
        'files',
        'language',
        'submission_source',
        'evaluation_driver',
        'github_owner',
        'github_repo',
        'github_ref',
        'github_path',
        'github_commit_sha',
        'status',
        'attempt_number',
        'tests_passed',
        'tests_total',
        'runtime_ms',
        'memory_kb',
        'reviewer_id',
        'mentor_feedback',
        'mentor_score',
        'reviewed_at',
    ];

    protected function casts(): array
    {
        return [
            'status' => SubmissionStatus::class,
            'language' => ChallengeLanguage::class,
            'files' => 'array',
            'submission_source' => SubmissionSource::class,
            'evaluation_driver' => EvaluationDriver::class,
            'reviewed_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function challenge(): BelongsTo
    {
        return $this->belongsTo(CodingChallenge::class, 'coding_challenge_id');
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }

    public function results(): HasMany
    {
        return $this->hasMany(ChallengeSubmissionResult::class)->orderBy('sort_order');
    }
}
