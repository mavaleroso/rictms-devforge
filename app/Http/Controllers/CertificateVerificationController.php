<?php

namespace App\Http\Controllers;

use App\Services\Certificate\CertificateService;
use Inertia\Inertia;
use Inertia\Response;

class CertificateVerificationController extends Controller
{
    public function __construct(
        private readonly CertificateService $certificates,
    ) {}

    public function show(string $code): Response
    {
        $certificate = $this->certificates->verify($code);

        return Inertia::render('certificates/verify', [
            'valid' => $certificate !== null,
            'certificate' => $certificate ? [
                'certificate_number' => $certificate->certificate_number,
                'intern_name' => $certificate->metadata['intern_name'] ?? $certificate->user?->name,
                'path_name' => $certificate->metadata['path_name'] ?? $certificate->learningPath?->name,
                'mentor_name' => $certificate->metadata['mentor_name'] ?? $certificate->enrollment?->mentor?->name,
                'issued_at' => $certificate->issued_at?->toIso8601String(),
            ] : null,
            'code' => $code,
        ]);
    }
}
