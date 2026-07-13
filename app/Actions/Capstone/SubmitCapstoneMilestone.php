<?php

namespace App\Actions\Capstone;

use App\Models\CapstoneProjectMilestone;
use App\Models\User;
use App\Services\Capstone\CapstoneProjectService;
use Illuminate\Http\UploadedFile;

final class SubmitCapstoneMilestone
{
    public function __construct(
        private readonly CapstoneProjectService $projects,
    ) {}

    /**
     * @param  array<string, mixed>  $data
     * @param  list<UploadedFile>  $files
     */
    public function execute(User $intern, CapstoneProjectMilestone $milestone, array $data = [], array $files = []): CapstoneProjectMilestone
    {
        return $this->projects->submitMilestone($intern, $milestone, $data, $files);
    }
}
