<?php

namespace App\Repositories\Contracts;

use App\Models\CapstoneProject;
use App\Models\CapstoneProjectMilestone;
use App\Models\Enrollment;
use App\Models\User;
use Illuminate\Support\Collection;

interface CapstoneProjectRepository
{
    public function findForEnrollment(Enrollment|int $enrollment): ?CapstoneProject;

    public function findWithRelations(int $id): ?CapstoneProject;

    public function create(array $attributes): CapstoneProject;

    public function update(CapstoneProject $project, array $attributes): CapstoneProject;

    public function findMilestoneForProject(CapstoneProject $project, int $milestoneId): ?CapstoneProjectMilestone;

    /** @return Collection<int, CapstoneProjectMilestone> */
    public function pendingReviewsForMentor(int $mentorId, int $limit = 20): Collection;

    public function findMilestoneForMentorReview(int $mentorId, CapstoneProjectMilestone $milestone): ?CapstoneProjectMilestone;

    public function countPendingReviewsForMentor(int $mentorId): int;
}
