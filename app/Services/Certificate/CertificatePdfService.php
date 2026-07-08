<?php

namespace App\Services\Certificate;

use App\Models\Certificate;
use Barryvdh\DomPDF\Facade\Pdf;
use Endroid\QrCode\Builder\Builder;
use Illuminate\Support\Facades\Storage;

final class CertificatePdfService
{
    public function generate(Certificate $certificate): string
    {
        $certificate->loadMissing(['user', 'learningPath']);

        $verifyUrl = route('certificates.verify', $certificate->verification_code);

        $qrResult = (new Builder)->build(
            data: $verifyUrl,
            size: 140,
            margin: 4,
        );

        $qrBase64 = base64_encode($qrResult->getString());

        $pdf = Pdf::loadView('certificates.pdf', [
            'certificate' => $certificate,
            'issuer' => config('certificates.issuer_name'),
            'verifyUrl' => $verifyUrl,
            'qrBase64' => $qrBase64,
        ])->setPaper('a4', 'landscape');

        $disk = config('certificates.storage_disk', 'local');
        $path = config('certificates.storage_path', 'certificates').'/'.$certificate->certificate_number.'.pdf';

        Storage::disk($disk)->put($path, $pdf->output());

        return $path;
    }

    public function contents(Certificate $certificate): ?string
    {
        if (! $certificate->pdf_path) {
            return null;
        }

        $disk = config('certificates.storage_disk', 'local');

        if (! Storage::disk($disk)->exists($certificate->pdf_path)) {
            return null;
        }

        return Storage::disk($disk)->get($certificate->pdf_path);
    }
}
