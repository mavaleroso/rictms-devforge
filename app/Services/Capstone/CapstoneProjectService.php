<?php

namespace App\Services\Capstone;

use App\Enums\CapstoneMilestoneStatus;
use App\Enums\CapstoneProjectStatus;
use App\Enums\CapstoneTaskStatus;
use App\Enums\XpSourceType;
use App\Library\Gamification\XpRules;
use App\Models\CapstoneMilestoneAttachment;
use App\Models\CapstoneProject;
use App\Models\CapstoneProjectMilestone;
use App\Models\CapstoneTemplate;
use App\Models\CapstoneTemplateMilestone;
use App\Models\Enrollment;
use App\Models\User;
use App\Notifications\CapstoneKickoffApprovedNotification;
use App\Notifications\CapstoneMilestoneReviewedNotification;
use App\Notifications\CapstoneMilestoneSubmittedNotification;
use App\Repositories\Contracts\CapstoneProjectRepository;
use App\Repositories\Contracts\CapstoneTemplateRepository;
use App\Repositories\Contracts\LevelRepository;
use App\Services\Gamification\GamificationService;
use App\Services\Learning\ProgressEngine;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

final class CapstoneProjectService
{
    public function __construct(
        private readonly CapstoneProjectRepository $projects,
        private readonly CapstoneTemplateRepository $templates,
        private readonly LevelRepository $levels,
        private readonly ProgressEngine $progressEngine,
        private readonly GamificationService $gamification,
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

            $needsKickoff = (bool) $template->requires_kickoff;
            $status = $needsKickoff ? CapstoneProjectStatus::Draft : CapstoneProjectStatus::Active;

            $project = $this->projects->create([
                'enrollment_id' => $enrollment->id,
                'capstone_template_id' => $template->id,
                'level_id' => $capstoneLevel?->id,
                'title' => $template->name,
                'description' => $template->description,
                'status' => $status,
                'allow_parallel_milestones' => (bool) $template->allow_parallel_milestones,
                'started_at' => now(),
                'kickoff_approved_at' => $needsKickoff ? null : now(),
            ]);

            foreach ($template->milestones as $index => $milestone) {
                $initialStatus = CapstoneMilestoneStatus::Pending;

                if (! $needsKickoff) {
                    $initialStatus = $this->initialMilestoneStatus($template, $milestone, $index === 0);
                }

                $projectMilestone = $project->milestones()->create([
                    'capstone_template_milestone_id' => $milestone->id,
                    'title' => $milestone->title,
                    'description' => $milestone->description,
                    'status' => $initialStatus,
                    'sort_order' => $milestone->sort_order,
                    'requires_mentor_signoff' => $milestone->requires_mentor_signoff,
                    'allows_parallel' => $milestone->allows_parallel,
                    'is_final_showcase' => $milestone->is_final_showcase,
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

    public function approveKickoff(User $mentor, CapstoneProject $project): CapstoneProject
    {
        if ($project->status !== CapstoneProjectStatus::Draft) {
            throw ValidationException::withMessages([
                'project' => 'This project does not need kickoff approval.',
            ]);
        }

        return DB::transaction(function () use ($mentor, $project) {
            $project->load(['milestones', 'template', 'enrollment.user']);

            $this->projects->update($project, [
                'status' => CapstoneProjectStatus::Active,
                'kickoff_approved_at' => now(),
                'kickoff_reviewer_id' => $mentor->id,
            ]);

            $milestones = $project->milestones->sortBy('sort_order')->values();
            foreach ($milestones as $index => $milestone) {
                $status = $this->initialMilestoneStatus(
                    $project,
                    $milestone,
                    $index === 0,
                );

                if ($status === CapstoneMilestoneStatus::InProgress) {
                    $milestone->update(['status' => CapstoneMilestoneStatus::InProgress]);
                }
            }

            $project->enrollment?->user?->notify(new CapstoneKickoffApprovedNotification($project->fresh()));

            return $this->projects->findWithRelations($project->id);
        });
    }

    /**
     * @param  list<UploadedFile>  $files
     */
    public function submitMilestone(
        User $intern,
        CapstoneProjectMilestone $milestone,
        array $data = [],
        array $files = [],
    ): CapstoneProjectMilestone {
        $milestone->load(['project.enrollment.mentor', 'project.enrollment.user', 'attachments']);

        if ($milestone->project->status !== CapstoneProjectStatus::Active) {
            throw ValidationException::withMessages([
                'milestone' => $milestone->project->needsKickoff()
                    ? 'Your mentor must approve project kickoff before you can submit milestones.'
                    : 'This project is not active.',
            ]);
        }

        if (! in_array($milestone->status, [CapstoneMilestoneStatus::InProgress, CapstoneMilestoneStatus::Rejected], true)) {
            throw ValidationException::withMessages([
                'milestone' => 'This milestone cannot be submitted in its current state.',
            ]);
        }

        if (! $milestone->project->enrollment?->mentor_id && $milestone->requires_mentor_signoff) {
            throw ValidationException::withMessages([
                'milestone' => 'A mentor must be assigned before you can submit this milestone for review.',
            ]);
        }

        if ($milestone->is_final_showcase && empty($data['demo_url']) && empty($data['deliverable_url'])) {
            throw ValidationException::withMessages([
                'demo_url' => 'Final showcase requires a demo or deliverable URL.',
            ]);
        }

        return DB::transaction(function () use ($intern, $milestone, $data, $files) {
            $wasRejected = $milestone->status === CapstoneMilestoneStatus::Rejected;

            $milestone->update([
                'status' => CapstoneMilestoneStatus::Submitted,
                'submitted_at' => now(),
                'submission_notes' => $data['submission_notes'] ?? null,
                'deliverable_url' => $data['deliverable_url'] ?? null,
                'repo_url' => $data['repo_url'] ?? null,
                'demo_url' => $data['demo_url'] ?? null,
                'resubmission_notes' => $wasRejected ? ($data['resubmission_notes'] ?? $data['submission_notes'] ?? null) : null,
                'mentor_feedback' => null,
                'mentor_score' => null,
                'reviewed_at' => null,
                'reviewer_id' => null,
            ]);

            $this->storeAttachments($milestone, $files);

            if (! $milestone->requires_mentor_signoff) {
                return $this->autoApproveMilestone($intern, $milestone->fresh(['project.enrollment.user', 'attachments']));
            }

            $mentor = $milestone->project->enrollment?->mentor;
            $mentor?->notify(new CapstoneMilestoneSubmittedNotification($milestone->fresh(['project.enrollment.user'])));

            return $milestone->fresh(['project.enrollment.user', 'attachments']);
        });
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

        if ($milestone->status !== CapstoneMilestoneStatus::Submitted) {
            throw ValidationException::withMessages([
                'status' => 'Only submitted milestones can be reviewed.',
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
                $this->awardMilestoneXp($milestone);
                $this->unlockNextMilestones($milestone);
                $this->evaluateProjectCompletion($milestone->project);
            }

            $intern = $milestone->project?->enrollment?->user
                ?? $milestone->fresh(['project.enrollment.user'])->project?->enrollment?->user;

            $intern?->notify(new CapstoneMilestoneReviewedNotification(
                $milestone->fresh(),
                $status === CapstoneMilestoneStatus::Approved,
            ));

            return $milestone->fresh(['project.enrollment.user', 'project.milestones', 'attachments']);
        });
    }

    public function archive(CapstoneProject $project): CapstoneProject
    {
        if ($project->status === CapstoneProjectStatus::Completed) {
            throw ValidationException::withMessages([
                'project' => 'Completed projects cannot be archived.',
            ]);
        }

        return $this->projects->update($project, [
            'status' => CapstoneProjectStatus::Archived,
            'archived_at' => now(),
        ]);
    }

    public function restart(Enrollment $enrollment, CapstoneTemplate $template, User $intern): CapstoneProject
    {
        $existing = $this->projects->findForEnrollment($enrollment);

        if ($existing && ! in_array($existing->status, [CapstoneProjectStatus::Archived, CapstoneProjectStatus::Draft], true)) {
            throw ValidationException::withMessages([
                'project' => 'Archive the current project before restarting with a new template.',
            ]);
        }

        if ($existing) {
            $existing->delete();
        }

        return $this->start($enrollment, $template, $intern);
    }

    /**
     * @param  list<UploadedFile>  $files
     */
    private function storeAttachments(CapstoneProjectMilestone $milestone, array $files): void
    {
        $sort = (int) $milestone->attachments()->max('sort_order');

        foreach ($files as $file) {
            if (! $file instanceof UploadedFile) {
                continue;
            }

            $path = $file->store(
                "capstone/{$milestone->capstone_project_id}/milestones/{$milestone->id}",
                'public',
            );

            CapstoneMilestoneAttachment::create([
                'capstone_project_milestone_id' => $milestone->id,
                'file_path' => $path,
                'original_name' => $file->getClientOriginalName(),
                'size_bytes' => $file->getSize(),
                'mime_type' => $file->getClientMimeType(),
                'sort_order' => ++$sort,
            ]);
        }
    }

    private function autoApproveMilestone(User $actor, CapstoneProjectMilestone $milestone): CapstoneProjectMilestone
    {
        $milestone->update([
            'status' => CapstoneMilestoneStatus::Approved,
            'reviewer_id' => $actor->id,
            'mentor_feedback' => 'Auto-approved (mentor sign-off not required).',
            'reviewed_at' => now(),
        ]);

        $this->awardMilestoneXp($milestone);
        $this->unlockNextMilestones($milestone);
        $this->evaluateProjectCompletion($milestone->project);

        return $milestone->fresh(['project.enrollment.user', 'project.milestones', 'attachments']);
    }

    private function awardMilestoneXp(CapstoneProjectMilestone $milestone): void
    {
        $user = $milestone->project?->enrollment?->user
            ?? $milestone->load('project.enrollment.user')->project?->enrollment?->user;

        if (! $user) {
            return;
        }

        $this->gamification->awardXp(
            $user,
            XpSourceType::CapstoneMilestone,
            $milestone->id,
            XpRules::capstoneMilestone(),
            'Capstone milestone approved: '.$milestone->title,
        );
    }

    private function unlockNextMilestones(CapstoneProjectMilestone $approved): void
    {
        $project = $approved->project()->with('milestones')->first();

        if (! $project) {
            return;
        }

        $pending = $project->milestones
            ->where('status', CapstoneMilestoneStatus::Pending)
            ->sortBy('sort_order')
            ->values();

        if ($pending->isEmpty()) {
            return;
        }

        if ($project->allow_parallel_milestones) {
            $nextSequential = $pending->first();
            if ($nextSequential) {
                $nextSequential->update(['status' => CapstoneMilestoneStatus::InProgress]);
            }

            foreach ($pending as $milestone) {
                if ($milestone->id === $nextSequential?->id) {
                    continue;
                }

                if ($milestone->allows_parallel) {
                    $milestone->update(['status' => CapstoneMilestoneStatus::InProgress]);
                }
            }

            return;
        }

        $next = $pending->first();
        $next?->update(['status' => CapstoneMilestoneStatus::InProgress]);
    }

    private function evaluateProjectCompletion(CapstoneProject $project): void
    {
        $project->load(['milestones', 'enrollment.user', 'enrollment.levelProgress.level']);

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

        $enrollment = $project->enrollment;

        if ($enrollment?->user) {
            $this->gamification->awardXp(
                $enrollment->user,
                XpSourceType::CapstoneComplete,
                $project->id,
                XpRules::capstoneComplete(),
                'Capstone project completed: '.$project->title,
            );
        }

        if ($enrollment && $project->level_id) {
            $level = $enrollment->levelProgress->firstWhere('level_id', $project->level_id)?->level;

            if ($level) {
                $this->progressEngine->evaluate($enrollment, $level);
            }
        }
    }

    private function initialMilestoneStatus(
        CapstoneTemplate|CapstoneProject $source,
        CapstoneTemplateMilestone|CapstoneProjectMilestone $milestone,
        bool $isFirst,
    ): CapstoneMilestoneStatus {
        $allowParallel = $source instanceof CapstoneTemplate
            ? (bool) $source->allow_parallel_milestones
            : (bool) $source->allow_parallel_milestones;

        $milestoneAllowsParallel = (bool) $milestone->allows_parallel;

        if ($isFirst || ($allowParallel && $milestoneAllowsParallel && ! $milestone->is_final_showcase)) {
            return CapstoneMilestoneStatus::InProgress;
        }

        return CapstoneMilestoneStatus::Pending;
    }
}
