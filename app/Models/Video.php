<?php

namespace App\Models;

use App\Enums\VideoProvider;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Video extends Model
{
    use HasFactory;

    protected $fillable = [
        'level_id',
        'title',
        'caption',
        'provider',
        'url',
        'file_path',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'provider' => VideoProvider::class,
        ];
    }

    public function level(): BelongsTo
    {
        return $this->belongsTo(Level::class);
    }

    public function completions(): MorphMany
    {
        return $this->morphMany(ContentCompletion::class, 'completable');
    }
}
