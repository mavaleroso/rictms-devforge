<?php

namespace App\Http\Resources;

use App\Models\Video;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

/** @mixin Video */
class VideoResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'provider' => $this->provider?->value,
            'url' => $this->url,
            'file_path' => $this->file_path
                ? Storage::disk('public')->url($this->file_path).'?v='.$this->updated_at?->timestamp
                : null,
            'sort_order' => $this->sort_order,
            'completed' => $this->when(isset($this->completed), (bool) $this->completed),
        ];
    }
}
