<?php

namespace App\Repositories\Contracts;

use App\Models\Level;
use App\Models\Video;

interface VideoRepository
{
    public function createForLevel(Level $level, array $attributes): Video;

    public function update(Video $video, array $attributes): void;

    public function delete(Video $video): void;
}
