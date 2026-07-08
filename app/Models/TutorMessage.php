<?php

namespace App\Models;

use App\Enums\TutorMessageRole;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TutorMessage extends Model
{
    protected $fillable = [
        'tutor_session_id',
        'role',
        'content',
    ];

    protected function casts(): array
    {
        return [
            'role' => TutorMessageRole::class,
        ];
    }

    public function session(): BelongsTo
    {
        return $this->belongsTo(TutorSession::class, 'tutor_session_id');
    }
}
