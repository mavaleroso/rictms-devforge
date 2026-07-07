<?php

namespace App\Repositories\Eloquent;

use App\Enums\ProgressStatus;
use App\Models\Enrollment;
use App\Models\Level;
use App\Models\LevelProgress;
use App\Repositories\Contracts\LevelProgressRepository;

final class EloquentLevelProgressRepository implements LevelProgressRepository
{
    public function findForEnrollmentAndLevel(Enrollment $enrollment, Level|int $level): ?LevelProgress
    {
        $levelId = $level instanceof Level ? $level->id : $level;

        return $enrollment->levelProgress()->where('level_id', $levelId)->first();
    }

    public function markInProgress(LevelProgress $progress): void
    {
        if ($progress->status === ProgressStatus::Available) {
            $progress->update(['status' => ProgressStatus::InProgress]);
        }
    }

    public function markCompleted(LevelProgress $progress): void
    {
        $progress->update([
            'status' => ProgressStatus::Completed,
            'completed_at' => now(),
        ]);
    }

    public function unlock(LevelProgress $progress): void
    {
        if ($progress->status === ProgressStatus::Locked) {
            $progress->update(['status' => ProgressStatus::Available]);
        }
    }

    public function createForEnrollment(Enrollment $enrollment, Level $level, ProgressStatus $status): LevelProgress
    {
        return $enrollment->levelProgress()->create([
            'level_id' => $level->id,
            'status' => $status,
        ]);
    }
}
