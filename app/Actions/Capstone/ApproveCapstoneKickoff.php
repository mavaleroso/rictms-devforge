<?php

namespace App\Actions\Capstone;

use App\Models\CapstoneProject;
use App\Models\User;
use App\Services\Capstone\CapstoneProjectService;

final class ApproveCapstoneKickoff
{
    public function __construct(
        private readonly CapstoneProjectService $projects,
    ) {}

    public function execute(User $mentor, CapstoneProject $project): CapstoneProject
    {
        return $this->projects->approveKickoff($mentor, $project);
    }
}
