<?php

namespace App\Services\Analytics;

use App\Enums\CapstoneMilestoneStatus;
use App\Enums\CapstoneProjectStatus;
use App\Models\CapstoneProject;
use App\Models\CapstoneProjectMilestone;
use App\Models\JournalEntry;

final class CapstoneAnalyticsService
{
    public function summary(): array
    {
        $projects = CapstoneProject::query()->selectRaw('status, COUNT(*) as total')->groupBy('status')->pluck('total', 'status');
        $pendingReviews = CapstoneProjectMilestone::query()->where('status', CapstoneMilestoneStatus::Submitted)->count();
        $avgScore = CapstoneProjectMilestone::query()
            ->where('status', CapstoneMilestoneStatus::Approved)
            ->whereNotNull('mentor_score')
            ->avg('mentor_score');
        $reviewed = CapstoneProjectMilestone::query()->whereNotNull('reviewed_at')->count();
        $rejected = CapstoneProjectMilestone::query()->where('status', CapstoneMilestoneStatus::Rejected)->count();
        $journalHours = (float) JournalEntry::query()->sum('hours_spent');

        return [
            'active_projects' => (int) ($projects[CapstoneProjectStatus::Active->value] ?? 0),
            'draft_projects' => (int) ($projects[CapstoneProjectStatus::Draft->value] ?? 0),
            'completed_projects' => (int) ($projects[CapstoneProjectStatus::Completed->value] ?? 0),
            'archived_projects' => (int) ($projects[CapstoneProjectStatus::Archived->value] ?? 0),
            'pending_reviews' => $pendingReviews,
            'avg_mentor_score' => $avgScore !== null ? (int) round((float) $avgScore) : null,
            'rejection_rate' => $reviewed > 0 ? (int) round(($rejected / $reviewed) * 100) : 0,
            'journal_hours_logged' => round($journalHours, 1),
        ];
    }

    /** @return list<array{title: string, total: int, completed: int, active: int}> */
    public function byTemplate(): array
    {
        return CapstoneProject::query()
            ->join('capstone_templates', 'capstone_templates.id', '=', 'capstone_projects.capstone_template_id')
            ->selectRaw('capstone_templates.name as title, COUNT(*) as total')
            ->selectRaw("SUM(CASE WHEN capstone_projects.status = 'completed' THEN 1 ELSE 0 END) as completed")
            ->selectRaw("SUM(CASE WHEN capstone_projects.status = 'active' THEN 1 ELSE 0 END) as active")
            ->groupBy('capstone_templates.name')
            ->orderByDesc('total')
            ->get()
            ->map(fn ($row) => [
                'title' => $row->title,
                'total' => (int) $row->total,
                'completed' => (int) $row->completed,
                'active' => (int) $row->active,
            ])
            ->all();
    }
}
