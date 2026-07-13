<?php

namespace App\Models;

use App\Enums\ChallengeAssertionType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ChallengeTestCase extends Model
{
    use HasFactory;

    protected $fillable = [
        'coding_challenge_id',
        'label',
        'assertion_type',
        'target_path',
        'input',
        'expected_output',
        'explanation',
        'is_sample',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'input' => 'array',
            'assertion_type' => ChallengeAssertionType::class,
            'is_sample' => 'boolean',
        ];
    }

    public function challenge(): BelongsTo
    {
        return $this->belongsTo(CodingChallenge::class, 'coding_challenge_id');
    }
}
