<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class CapstoneMilestoneAttachment extends Model
{
    protected $fillable = [
        'capstone_project_milestone_id',
        'file_path',
        'original_name',
        'size_bytes',
        'mime_type',
        'sort_order',
    ];

    public function milestone(): BelongsTo
    {
        return $this->belongsTo(CapstoneProjectMilestone::class, 'capstone_project_milestone_id');
    }

    public function url(): string
    {
        return Storage::disk('public')->url($this->file_path);
    }
}
