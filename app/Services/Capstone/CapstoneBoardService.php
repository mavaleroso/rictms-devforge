<?php

namespace App\Services\Capstone;

use App\Enums\CapstoneTaskStatus;
use App\Models\CapstoneProject;
use App\Models\CapstoneTask;
use App\Models\User;
use App\Repositories\Contracts\CapstoneTaskRepository;
use Illuminate\Validation\ValidationException;

final class CapstoneBoardService
{
    public function __construct(
        private readonly CapstoneTaskRepository $tasks,
    ) {}

    /** @return array<string, list<CapstoneTask>> */
    public function groupedByStatus(CapstoneProject $project): array
    {
        $grouped = [];

        foreach (CapstoneTaskStatus::boardOrder() as $status) {
            $grouped[$status->value] = [];
        }

        foreach ($this->tasks->forProject($project) as $task) {
            $grouped[$task->status->value][] = $task;
        }

        return $grouped;
    }

    public function createTask(CapstoneProject $project, User $reporter, array $data): CapstoneTask
    {
        $status = CapstoneTaskStatus::from($data['status'] ?? CapstoneTaskStatus::Todo->value);

        return $this->tasks->create($project, [
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
            'status' => $status,
            'priority' => $data['priority'] ?? 'medium',
            'capstone_project_milestone_id' => $data['milestone_id'] ?? null,
            'assignee_id' => $reporter->id,
            'reporter_id' => $reporter->id,
            'due_date' => $data['due_date'] ?? null,
            'sort_order' => ($this->tasks->forProject($project)->max('sort_order') ?? 0) + 1,
            'completed_at' => $status === CapstoneTaskStatus::Done ? now() : null,
        ]);
    }

    public function moveTask(CapstoneTask $task, CapstoneTaskStatus $status): CapstoneTask
    {
        return $this->tasks->update($task, [
            'status' => $status,
            'completed_at' => $status === CapstoneTaskStatus::Done ? now() : null,
        ]);
    }

    public function updateTask(CapstoneTask $task, array $data): CapstoneTask
    {
        $attributes = [];

        if (isset($data['title'])) {
            $attributes['title'] = $data['title'];
        }

        if (array_key_exists('description', $data)) {
            $attributes['description'] = $data['description'];
        }

        if (isset($data['status'])) {
            $status = CapstoneTaskStatus::from($data['status']);
            $attributes['status'] = $status;
            $attributes['completed_at'] = $status === CapstoneTaskStatus::Done ? now() : null;
        }

        if (isset($data['priority'])) {
            $attributes['priority'] = $data['priority'];
        }

        if (array_key_exists('due_date', $data)) {
            $attributes['due_date'] = $data['due_date'];
        }

        if (array_key_exists('milestone_id', $data)) {
            $attributes['capstone_project_milestone_id'] = $data['milestone_id'];
        }

        if ($attributes === []) {
            throw ValidationException::withMessages([
                'task' => 'No changes provided.',
            ]);
        }

        return $this->tasks->update($task, $attributes);
    }

    public function deleteTask(CapstoneTask $task): void
    {
        $this->tasks->delete($task);
    }
}
