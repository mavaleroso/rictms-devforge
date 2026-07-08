<?php

namespace App\Models;

use App\Enums\BadgeCategory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Badge extends Model
{
    protected $fillable = [
        'slug',
        'name',
        'description',
        'icon',
        'category',
        'xp_bonus',
        'sort_order',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'category' => BadgeCategory::class,
            'is_active' => 'boolean',
        ];
    }

    public function userBadges(): HasMany
    {
        return $this->hasMany(UserBadge::class);
    }
}
