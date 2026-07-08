<?php

namespace App\Repositories\Contracts;

use App\Models\CapstoneProject;
use App\Models\CapstoneTask;
use App\Models\User;
use Illuminate\Support\Collection;

interface CapstoneTaskRepository
{
    /** @return Collection<int, CapstoneTask> */
    public function forProject(CapstoneProject $project): Collection;

    public function create(CapstoneProject $project, array $attributes): CapstoneTask;

    public function update(CapstoneTask $task, array $attributes): CapstoneTask;

    public function findForProject(CapstoneProject $project, int $taskId): ?CapstoneTask;

    public function delete(CapstoneTask $task): void;
}
