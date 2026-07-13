<?php

namespace App\Actions\Capstone;

use App\Models\CapstoneProject;
use App\Models\CapstoneTemplate;
use App\Models\Enrollment;
use App\Models\User;
use App\Services\Capstone\CapstoneProjectService;

final class StartCapstoneProject
{
    public function __construct(
        private readonly CapstoneProjectService $projects,
    ) {}

    public function execute(Enrollment $enrollment, CapstoneTemplate $template, User $intern): CapstoneProject
    {
        return $this->projects->start($enrollment, $template, $intern);
    }
}
