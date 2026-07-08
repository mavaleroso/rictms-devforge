<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TutorSession extends Model
{
    protected $fillable = [
        'user_id',
        'context_type',
        'context_id',
        'level_id',
        'title',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function level(): BelongsTo
    {
        return $this->belongsTo(Level::class);
    }

    public function messages(): HasMany
    {
        return $this->hasMany(TutorMessage::class)->orderBy('id');
    }
}
