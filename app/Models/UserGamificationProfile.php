<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class UserGamificationProfile extends Model
{
    protected $fillable = [
        'user_id',
        'total_xp',
        'current_streak',
        'longest_streak',
        'last_activity_date',
    ];

    protected function casts(): array
    {
        return [
            'last_activity_date' => 'date',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function xpTransactions(): HasMany
    {
        return $this->hasMany(XpTransaction::class, 'user_id', 'user_id');
    }
}
