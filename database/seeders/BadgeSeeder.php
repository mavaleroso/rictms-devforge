<?php

namespace Database\Seeders;

use App\Models\Badge;
use Illuminate\Database\Seeder;

class BadgeSeeder extends Seeder
{
    public function run(): void
    {
        foreach (config('gamification.badges', []) as $badge) {
            Badge::updateOrCreate(
                ['slug' => $badge['slug']],
                [
                    'name' => $badge['name'],
                    'description' => $badge['description'],
                    'icon' => $badge['icon'],
                    'category' => $badge['category'],
                    'xp_bonus' => $badge['xp_bonus'],
                    'sort_order' => $badge['sort_order'],
                    'is_active' => true,
                ],
            );
        }
    }
}
