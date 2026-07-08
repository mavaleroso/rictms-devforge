<?php

namespace App\Services\Analytics;

use App\Enums\EnrollmentStatus;
use App\Models\Enrollment;
use App\Repositories\Contracts\CertificateRepository;
use App\Repositories\Contracts\EnrollmentRepository;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

final class CompletionAnalyticsService
{
    public function __construct(
        private readonly EnrollmentRepository $enrollments,
        private readonly CertificateRepository $certificates,
    ) {}

    public function summary(): array
    {
        $completed = $this->enrollments->countByStatus(EnrollmentStatus::Completed);
        $active = $this->enrollments->countByStatus(EnrollmentStatus::Active);
        $certificates = $this->certificates->countIssued();
        $thisMonth = $this->certificates->countIssuedSince(now()->startOfMonth());

        $avgDays = Enrollment::query()
            ->where('status', EnrollmentStatus::Completed)
            ->whereNotNull('started_at')
            ->whereNotNull('completed_at')
            ->selectRaw('AVG(DATEDIFF(completed_at, started_at)) as avg_days')
            ->value('avg_days');

        return [
            'active_enrollments' => $active,
            'completed_enrollments' => $completed,
            'certificates_issued' => $certificates,
            'certificates_this_month' => $thisMonth,
            'avg_days_to_complete' => $avgDays !== null ? (int) round((float) $avgDays) : null,
            'completion_rate' => ($active + $completed) > 0
                ? (int) round(($completed / ($active + $completed)) * 100)
                : 0,
        ];
    }

    /** @return Collection<int, array{month: string, label: string, completions: int, certificates: int}> */
    public function monthlyTrend(int $months = 6): Collection
    {
        $start = now()->subMonths($months - 1)->startOfMonth();

        $completions = Enrollment::query()
            ->where('status', EnrollmentStatus::Completed)
            ->where('completed_at', '>=', $start)
            ->selectRaw("DATE_FORMAT(completed_at, '%Y-%m') as month, COUNT(*) as total")
            ->groupBy('month')
            ->pluck('total', 'month');

        $certificates = DB::table('certificates')
            ->where('issued_at', '>=', $start)
            ->selectRaw("DATE_FORMAT(issued_at, '%Y-%m') as month, COUNT(*) as total")
            ->groupBy('month')
            ->pluck('total', 'month');

        return collect(range(0, $months - 1))->map(function (int $offset) use ($start, $completions, $certificates) {
            $date = $start->copy()->addMonths($offset);
            $key = $date->format('Y-m');

            return [
                'month' => $key,
                'label' => $date->format('M'),
                'completions' => (int) ($completions[$key] ?? 0),
                'certificates' => (int) ($certificates[$key] ?? 0),
            ];
        });
    }

    /** @return Collection<int, array{path: string, completed: int, active: int}> */
    public function byPath(): Collection
    {
        return DB::table('enrollments')
            ->join('learning_paths', 'learning_paths.id', '=', 'enrollments.learning_path_id')
            ->selectRaw('learning_paths.name as path')
            ->selectRaw("SUM(CASE WHEN enrollments.status = 'completed' THEN 1 ELSE 0 END) as completed")
            ->selectRaw("SUM(CASE WHEN enrollments.status = 'active' THEN 1 ELSE 0 END) as active")
            ->groupBy('learning_paths.id', 'learning_paths.name')
            ->orderByDesc('completed')
            ->get()
            ->map(fn ($row) => [
                'path' => $row->path,
                'completed' => (int) $row->completed,
                'active' => (int) $row->active,
            ]);
    }
}
