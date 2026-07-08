<?php

namespace App\Models;

use App\Enums\XpSourceType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class XpTransaction extends Model
{
    protected $fillable = [
        'user_id',
        'source_type',
        'source_id',
        'amount',
        'reason',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'source_type' => XpSourceType::class,
            'metadata' => 'array',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
