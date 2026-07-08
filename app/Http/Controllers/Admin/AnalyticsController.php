<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\CertificateResource;
use App\Models\Certificate;
use App\Services\Analytics\CompletionAnalyticsService;
use App\Services\Analytics\ReportExportService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AnalyticsController extends Controller
{
    public function __construct(
        private readonly CompletionAnalyticsService $analytics,
        private readonly ReportExportService $export,
    ) {}

    public function index(): Response
    {
        $this->authorize('viewAny', Certificate::class);

        return Inertia::render('admin/analytics/index', [
            'stats' => $this->analytics->summary(),
            'trend' => $this->analytics->monthlyTrend(),
            'by_path' => $this->analytics->byPath(),
        ]);
    }

    public function table(Request $request): AnonymousResourceCollection
    {
        $this->authorize('viewAny', Certificate::class);

        $validated = $request->validate([
            'page' => ['sometimes', 'integer', 'min:1'],
            'per_page' => ['sometimes', 'integer', 'min:5', 'max:100'],
            'sort' => ['sometimes', 'nullable', 'string', 'in:issued_at,certificate_number'],
            'direction' => ['sometimes', 'string', 'in:asc,desc'],
            'search' => ['sometimes', 'nullable', 'string', 'max:255'],
        ]);

        $certificates = app(\App\Repositories\Contracts\CertificateRepository::class)->paginateWithRelations(
            perPage: $validated['per_page'] ?? 15,
            search: $validated['search'] ?? null,
            sort: $validated['sort'] ?? null,
            direction: $validated['direction'] ?? 'desc',
        );

        return CertificateResource::collection($certificates);
    }

    public function export(): StreamedResponse
    {
        $this->authorize('viewAny', Certificate::class);

        return $this->export->exportCompletionsCsv();
    }
}
