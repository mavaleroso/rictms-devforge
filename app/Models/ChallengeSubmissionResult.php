<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ChallengeSubmissionResult extends Model
{
    use HasFactory;

    protected $fillable = [
        'challenge_submission_id',
        'challenge_test_case_id',
        'passed',
        'actual_output',
        'error_message',
        'runtime_ms',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'passed' => 'boolean',
        ];
    }

    public function submission(): BelongsTo
    {
        return $this->belongsTo(ChallengeSubmission::class, 'challenge_submission_id');
    }

    public function testCase(): BelongsTo
    {
        return $this->belongsTo(ChallengeTestCase::class, 'challenge_test_case_id');
    }
}
