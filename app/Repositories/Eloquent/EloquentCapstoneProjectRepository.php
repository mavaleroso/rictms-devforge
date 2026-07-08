<?php

namespace App\Repositories\Eloquent;

use App\Enums\CapstoneMilestoneStatus;
use App\Models\CapstoneProject;
use App\Models\CapstoneProjectMilestone;
use App\Models\Enrollment;
use App\Repositories\Contracts\CapstoneProjectRepository;
use Illuminate\Support\Collection;

final class EloquentCapstoneProjectRepository implements CapstoneProjectRepository
{
    public function findForEnrollment(Enrollment|int $enrollment): ?CapstoneProject
    {
        $enrollmentId = $enrollment instanceof Enrollment ? $enrollment->id : $enrollment;

        return CapstoneProject::query()
            ->where('enrollment_id', $enrollmentId)
            ->with(['template', 'milestones', 'tasks.assignee', 'enrollment.user', 'enrollment.mentor'])
            ->first();
    }

    public function findWithRelations(int $id): ?CapstoneProject
    {
        return CapstoneProject::query()
            ->with(['template', 'milestones', 'tasks.assignee', 'enrollment.user', 'enrollment.mentor', 'level'])
            ->find($id);
    }

    public function create(array $attributes): CapstoneProject
    {
        return CapstoneProject::create($attributes);
    }

    public function update(CapstoneProject $project, array $attributes): CapstoneProject
    {
        $project->update($attributes);

        return $project->fresh(['template', 'milestones', 'tasks']);
    }

    public function findMilestoneForProject(CapstoneProject $project, int $milestoneId): ?CapstoneProjectMilestone
    {
        return $project->milestones()->whereKey($milestoneId)->first();
    }

    public function pendingReviewsForMentor(int $mentorId, int $limit = 20): Collection
    {
        return CapstoneProjectMilestone::query()
            ->where('status', CapstoneMilestoneStatus::Submitted)
            ->whereHas('project.enrollment', fn ($q) => $q->where('mentor_id', $mentorId))
            ->with(['project.enrollment.user', 'project.template'])
            ->latest('submitted_at')
            ->limit($limit)
            ->get();
    }

    public function findMilestoneForMentorReview(int $mentorId, CapstoneProjectMilestone $milestone): ?CapstoneProjectMilestone
    {
        return CapstoneProjectMilestone::query()
            ->whereKey($milestone->id)
            ->whereHas('project.enrollment', fn ($q) => $q->where('mentor_id', $mentorId))
            ->with(['project.enrollment.user', 'project.template', 'tasks'])
            ->first();
    }

    public function countPendingReviewsForMentor(int $mentorId): int
    {
        return CapstoneProjectMilestone::query()
            ->where('status', CapstoneMilestoneStatus::Submitted)
            ->whereHas('project.enrollment', fn ($q) => $q->where('mentor_id', $mentorId))
            ->count();
    }
}
