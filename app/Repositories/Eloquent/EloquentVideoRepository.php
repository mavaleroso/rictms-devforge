<?php

namespace App\Repositories\Eloquent;

use App\Models\Level;
use App\Models\Video;
use App\Repositories\Contracts\VideoRepository;

final class EloquentVideoRepository implements VideoRepository
{
    public function createForLevel(Level $level, array $attributes): Video
    {
        return $level->videos()->create($attributes);
    }

    public function update(Video $video, array $attributes): void
    {
        $video->update($attributes);
    }

    public function delete(Video $video): void
    {
        $video->delete();
    }
}
