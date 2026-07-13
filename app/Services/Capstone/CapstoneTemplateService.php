<?php

namespace App\Services\Capstone;

use App\Models\CapstoneTemplate;
use App\Models\CapstoneTemplateMilestone;
use App\Models\CapstoneTemplateTask;
use App\Repositories\Contracts\CapstoneTemplateRepository;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

final class CapstoneTemplateService
{
    public function __construct(
        private readonly CapstoneTemplateRepository $templates,
    ) {}

    public function create(array $attributes): CapstoneTemplate
    {
        $slug = $attributes['slug'] ?? Str::slug($attributes['name']);

        if (CapstoneTemplate::query()->where('slug', $slug)->exists()) {
            $slug .= '-'.Str::random(4);
        }

        return $this->templates->create([
            'name' => $attributes['name'],
            'slug' => $slug,
            'description' => $attributes['description'] ?? null,
            'objectives' => $attributes['objectives'] ?? null,
            'estimated_weeks' => $attributes['estimated_weeks'] ?? 4,
            'is_active' => $attributes['is_active'] ?? true,
            'requires_kickoff' => $attributes['requires_kickoff'] ?? true,
            'allow_parallel_milestones' => $attributes['allow_parallel_milestones'] ?? false,
            'sort_order' => $attributes['sort_order'] ?? ((int) CapstoneTemplate::query()->max('sort_order') + 1),
        ]);
    }

    public function update(CapstoneTemplate $template, array $attributes): CapstoneTemplate
    {
        return $this->templates->update($template, $attributes);
    }

    public function storeMilestone(CapstoneTemplate $template, array $attributes): CapstoneTemplateMilestone
    {
        return $template->milestones()->create([
            'title' => $attributes['title'],
            'description' => $attributes['description'] ?? null,
            'sort_order' => $attributes['sort_order'] ?? ((int) $template->milestones()->max('sort_order') + 1),
            'requires_mentor_signoff' => $attributes['requires_mentor_signoff'] ?? true,
            'allows_parallel' => $attributes['allows_parallel'] ?? false,
            'is_final_showcase' => $attributes['is_final_showcase'] ?? false,
        ]);
    }

    public function updateMilestone(int $milestoneId, array $attributes): CapstoneTemplateMilestone
    {
        $milestone = CapstoneTemplateMilestone::query()->findOrFail($milestoneId);
        $milestone->update($attributes);

        return $milestone->fresh();
    }

    public function deleteMilestone(int $milestoneId): void
    {
        $milestone = CapstoneTemplateMilestone::query()->findOrFail($milestoneId);

        if ($milestone->tasks()->exists()) {
            throw ValidationException::withMessages([
                'milestone' => 'Remove milestone tasks before deleting the milestone.',
            ]);
        }

        $milestone->delete();
    }

    public function storeTask(CapstoneTemplate $template, array $attributes): CapstoneTemplateTask
    {
        return $template->tasks()->create([
            'capstone_template_milestone_id' => $attributes['capstone_template_milestone_id'] ?? null,
            'title' => $attributes['title'],
            'description' => $attributes['description'] ?? null,
            'default_status' => $attributes['default_status'] ?? 'todo',
            'priority' => $attributes['priority'] ?? 'medium',
            'sort_order' => $attributes['sort_order'] ?? ((int) $template->tasks()->max('sort_order') + 1),
        ]);
    }

    public function updateTask(int $taskId, array $attributes): CapstoneTemplateTask
    {
        $task = CapstoneTemplateTask::query()->findOrFail($taskId);
        $task->update($attributes);

        return $task->fresh();
    }

    public function deleteTask(int $taskId): void
    {
        CapstoneTemplateTask::query()->findOrFail($taskId)->delete();
    }
}
