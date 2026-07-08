<?php

namespace App\Services\Capstone;

use App\Enums\CapstoneMilestoneStatus;
use App\Enums\CapstoneProjectStatus;
use App\Enums\CapstoneTaskStatus;
use App\Models\CapstoneProject;
use App\Models\CapstoneProjectMilestone;
use App\Models\CapstoneTemplate;
use App\Models\Enrollment;
use App\Models\User;
use App\Repositories\Contracts\CapstoneProjectRepository;
use App\Repositories\Contracts\CapstoneTemplateRepository;
use App\Repositories\Contracts\LevelRepository;
use App\Services\Learning\ProgressEngine;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

final class CapstoneProjectService
{
    public function __construct(
        private readonly CapstoneProjectRepository $projects,
        private readonly CapstoneTemplateRepository $templates,
        private readonly LevelRepository $levels,
        private readonly ProgressEngine $progressEngine,
    ) {}

    public function start(Enrollment $enrollment, CapstoneTemplate $template, User $intern): CapstoneProject
    {
        if ($this->projects->findForEnrollment($enrollment)) {
            throw ValidationException::withMessages([
                'template' => 'You already have an active capstone project.',
            ]);
        }

        $template = $this->templates->findWithRelations($template->id);

        if (! $template?->is_active) {
            throw ValidationException::withMessages([
                'template' => 'This capstone template is not available.',
            ]);
        }

        return DB::transaction(function () use ($enrollment, $template, $intern) {
            $capstoneLevel = $this->levels->findByPathAndNumber(
                $enrollment->learning_path_id,
                20,
            );

            $project = $this->projects->create([
                'enrollment_id' => $enrollment->id,
                'capstone_template_id' => $template->id,
                'level_id' => $capstoneLevel?->id,
                'title' => $template->name,
                'description' => $template->description,
                'status' => CapstoneProjectStatus::Active,
                'started_at' => now(),
            ]);

            foreach ($template->milestones as $index => $milestone) {
                $projectMilestone = $project->milestones()->create([
                    'capstone_template_milestone_id' => $milestone->id,
                    'title' => $milestone->title,
                    'description' => $milestone->description,
                    'status' => $index === 0 ? CapstoneMilestoneStatus::InProgress : CapstoneMilestoneStatus::Pending,
                    'sort_order' => $milestone->sort_order,
                ]);

                foreach ($template->tasks->where('capstone_template_milestone_id', $milestone->id) as $taskIndex => $task) {
                    $project->tasks()->create([
                        'capstone_project_milestone_id' => $projectMilestone->id,
                        'title' => $task->title,
                        'description' => $task->description,
                        'status' => $task->default_status ?? CapstoneTaskStatus::Todo,
                        'priority' => $task->priority,
                        'assignee_id' => $intern->id,
                        'reporter_id' => $intern->id,
                        'sort_order' => $taskIndex + 1,
                    ]);
                }
            }

            foreach ($template->tasks->whereNull('capstone_template_milestone_id') as $taskIndex => $task) {
                $project->tasks()->create([
                    'title' => $task->title,
                    'description' => $task->description,
                    'status' => $task->default_status ?? CapstoneTaskStatus::Backlog,
                    'priority' => $task->priority,
                    'assignee_id' => $intern->id,
                    'reporter_id' => $intern->id,
                    'sort_order' => $taskIndex + 1,
                ]);
            }

            return $this->projects->findWithRelations($project->id);
        });
    }

    public function submitMilestone(User $intern, CapstoneProjectMilestone $milestone): CapstoneProjectMilestone
    {
        if (! in_array($milestone->status, [CapstoneMilestoneStatus::InProgress, CapstoneMilestoneStatus::Rejected], true)) {
            throw ValidationException::withMessages([
                'milestone' => 'This milestone cannot be submitted in its current state.',
            ]);
        }

        $milestone->update([
            'status' => CapstoneMilestoneStatus::Submitted,
            'submitted_at' => now(),
        ]);

        return $milestone->fresh(['project.enrollment.user']);
    }

    public function reviewMilestone(
        User $mentor,
        CapstoneProjectMilestone $milestone,
        CapstoneMilestoneStatus $status,
        ?string $feedback,
        ?int $score,
    ): CapstoneProjectMilestone {
        if (! in_array($status, [CapstoneMilestoneStatus::Approved, CapstoneMilestoneStatus::Rejected], true)) {
            throw ValidationException::withMessages([
                'status' => 'Review must approve or reject the milestone.',
            ]);
        }

        return DB::transaction(function () use ($mentor, $milestone, $status, $feedback, $score) {
            $milestone->update([
                'status' => $status,
                'reviewer_id' => $mentor->id,
                'mentor_feedback' => $feedback,
                'mentor_score' => $score,
                'reviewed_at' => now(),
            ]);

            if ($status === CapstoneMilestoneStatus::Approved) {
                $this->unlockNextMilestone($milestone);
                $this->evaluateProjectCompletion($milestone->project);
            }

            return $milestone->fresh(['project.enrollment.user', 'project.milestones']);
        });
    }

    private function unlockNextMilestone(CapstoneProjectMilestone $approved): void
    {
        $next = CapstoneProjectMilestone::query()
            ->where('capstone_project_id', $approved->capstone_project_id)
            ->where('sort_order', '>', $approved->sort_order)
            ->orderBy('sort_order')
            ->first();

        if ($next && $next->status === CapstoneMilestoneStatus::Pending) {
            $next->update(['status' => CapstoneMilestoneStatus::InProgress]);
        }
    }

    private function evaluateProjectCompletion(CapstoneProject $project): void
    {
        $project->load('milestones');

        $allApproved = $project->milestones->every(
            fn (CapstoneProjectMilestone $m) => $m->status === CapstoneMilestoneStatus::Approved,
        );

        if (! $allApproved) {
            return;
        }

        $this->projects->update($project, [
            'status' => CapstoneProjectStatus::Completed,
            'completed_at' => now(),
        ]);

        $enrollment = $project->enrollment()->with('levelProgress.level')->first();

        if ($enrollment && $project->level_id) {
            $level = $enrollment->levelProgress->firstWhere('level_id', $project->level_id)?->level;

            if ($level) {
                $this->progressEngine->evaluate($enrollment, $level);
            }
        }
    }
}
