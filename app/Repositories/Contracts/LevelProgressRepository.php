<?php

namespace App\Repositories\Contracts;

use App\Enums\ProgressStatus;
use App\Models\Enrollment;
use App\Models\Level;
use App\Models\LevelProgress;

interface LevelProgressRepository
{
    public function findForEnrollmentAndLevel(Enrollment $enrollment, Level|int $level): ?LevelProgress;

    public function markInProgress(LevelProgress $progress): void;

    public function markCompleted(LevelProgress $progress): void;

    public function unlock(LevelProgress $progress): void;

    public function createForEnrollment(Enrollment $enrollment, Level $level, ProgressStatus $status): LevelProgress;
}
