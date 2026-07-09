<?php

namespace App\Http\Resources;

use App\Models\LearningMaterialFile;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

/** @mixin LearningMaterialFile */
class LearningMaterialFileResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'url' => Storage::disk('public')->url($this->file_path).'?v='.$this->updated_at?->timestamp,
            'original_name' => $this->original_name,
            'sort_order' => $this->sort_order,
        ];
    }
}
