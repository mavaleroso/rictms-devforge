<?php

namespace App\Actions\Capstone;

use App\Enums\CapstoneMilestoneStatus;
use App\Models\CapstoneProjectMilestone;
use App\Models\User;
use App\Services\Capstone\CapstoneProjectService;

final class ReviewCapstoneMilestone
{
    public function __construct(
        private readonly CapstoneProjectService $projects,
    ) {}

    public function execute(
        User $mentor,
        CapstoneProjectMilestone $milestone,
        CapstoneMilestoneStatus $status,
        ?string $feedback,
        ?int $score,
    ): CapstoneProjectMilestone {
        return $this->projects->reviewMilestone($mentor, $milestone, $status, $feedback, $score);
    }
}
