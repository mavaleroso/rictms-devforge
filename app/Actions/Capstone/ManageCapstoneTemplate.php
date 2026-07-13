<?php

namespace App\Actions\Capstone;

use App\Models\CapstoneProject;
use App\Models\CapstoneTemplate;
use App\Models\User;
use App\Services\Capstone\CapstoneTemplateService;

final class ManageCapstoneTemplate
{
    public function __construct(
        private readonly CapstoneTemplateService $templates,
    ) {}

    public function create(array $attributes): CapstoneTemplate
    {
        return $this->templates->create($attributes);
    }

    public function update(CapstoneTemplate $template, array $attributes): CapstoneTemplate
    {
        return $this->templates->update($template, $attributes);
    }

    public function storeMilestone(CapstoneTemplate $template, array $attributes): void
    {
        $this->templates->storeMilestone($template, $attributes);
    }

    public function updateMilestone(int $milestoneId, array $attributes): void
    {
        $this->templates->updateMilestone($milestoneId, $attributes);
    }

    public function deleteMilestone(int $milestoneId): void
    {
        $this->templates->deleteMilestone($milestoneId);
    }

    public function storeTask(CapstoneTemplate $template, array $attributes): void
    {
        $this->templates->storeTask($template, $attributes);
    }

    public function updateTask(int $taskId, array $attributes): void
    {
        $this->templates->updateTask($taskId, $attributes);
    }

    public function deleteTask(int $taskId): void
    {
        $this->templates->deleteTask($taskId);
    }
}
