<?php

namespace App\Models;

use App\Enums\MaterialType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class LearningMaterial extends Model
{
    use HasFactory;

    protected $fillable = [
        'level_id',
        'type',
        'title',
        'content',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'type' => MaterialType::class,
        ];
    }

    public function level(): BelongsTo
    {
        return $this->belongsTo(Level::class);
    }

    public function files(): HasMany
    {
        return $this->hasMany(LearningMaterialFile::class)->orderBy('sort_order');
    }

    public function completions(): MorphMany
    {
        return $this->morphMany(ContentCompletion::class, 'completable');
    }
}
