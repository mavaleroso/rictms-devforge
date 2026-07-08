<?php

namespace App\Services\Analytics;

use App\Repositories\Contracts\CertificateRepository;
use Illuminate\Http\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

final class ReportExportService
{
    public function __construct(
        private readonly CertificateRepository $certificates,
    ) {}

    public function exportCompletionsCsv(): StreamedResponse
    {
        $filename = 'devforge-completions-'.now()->format('Y-m-d').'.csv';

        return response()->streamDownload(function () {
            $handle = fopen('php://output', 'w');

            fputcsv($handle, [
                'Certificate #',
                'Intern',
                'Email',
                'Learning path',
                'Mentor',
                'Issued at',
                'Verification code',
                'Days to complete',
            ]);

            \App\Models\Certificate::query()
                ->with(['user', 'learningPath', 'enrollment.mentor'])
                ->orderByDesc('issued_at')
                ->cursor()
                ->each(function ($certificate) use ($handle) {
                    fputcsv($handle, [
                        $certificate->certificate_number,
                        $certificate->user?->name,
                        $certificate->user?->email,
                        $certificate->learningPath?->name,
                        $certificate->enrollment?->mentor?->name,
                        $certificate->issued_at?->toDateTimeString(),
                        $certificate->verification_code,
                        $certificate->metadata['days_to_complete'] ?? '',
                    ]);
                });

            fclose($handle);
        }, $filename, [
            'Content-Type' => 'text/csv',
        ]);
    }
}
