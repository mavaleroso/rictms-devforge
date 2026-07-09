<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LearningMaterialFile extends Model
{
    protected $fillable = [
        'learning_material_id',
        'file_path',
        'original_name',
        'sort_order',
    ];

    public function material(): BelongsTo
    {
        return $this->belongsTo(LearningMaterial::class, 'learning_material_id');
    }
}
