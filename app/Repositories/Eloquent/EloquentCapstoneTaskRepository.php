<?php

namespace App\Repositories\Eloquent;

use App\Models\CapstoneProject;
use App\Models\CapstoneTask;
use App\Repositories\Contracts\CapstoneTaskRepository;
use Illuminate\Support\Collection;

final class EloquentCapstoneTaskRepository implements CapstoneTaskRepository
{
    public function forProject(CapstoneProject $project): Collection
    {
        return $project->tasks()
            ->with(['assignee', 'milestone'])
            ->orderBy('sort_order')
            ->get();
    }

    public function create(CapstoneProject $project, array $attributes): CapstoneTask
    {
        return $project->tasks()->create($attributes);
    }

    public function update(CapstoneTask $task, array $attributes): CapstoneTask
    {
        $task->update($attributes);

        return $task->fresh(['assignee', 'milestone']);
    }

    public function findForProject(CapstoneProject $project, int $taskId): ?CapstoneTask
    {
        return $project->tasks()->whereKey($taskId)->first();
    }

    public function delete(CapstoneTask $task): void
    {
        $task->delete();
    }
}
