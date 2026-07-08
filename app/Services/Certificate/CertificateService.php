<?php

namespace App\Services\Certificate;

use App\Library\Certificate\CertificateNumberGenerator;
use App\Models\Certificate;
use App\Models\Enrollment;
use App\Notifications\CertificateIssuedNotification;
use App\Repositories\Contracts\CertificateRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;

final class CertificateService
{
    public function __construct(
        private readonly CertificateRepository $certificates,
        private readonly CertificateNumberGenerator $numbers,
        private readonly CertificatePdfService $pdf,
    ) {}

    public function issueForEnrollment(Enrollment $enrollment): ?Certificate
    {
        $existing = $this->certificates->findForEnrollment($enrollment);

        if ($existing) {
            return $existing;
        }

        return DB::transaction(function () use ($enrollment) {
            $enrollment->loadMissing(['user', 'learningPath', 'mentor']);

            $daysToComplete = null;

            if ($enrollment->started_at && $enrollment->completed_at) {
                $daysToComplete = (int) $enrollment->started_at->diffInDays($enrollment->completed_at);
            }

            $certificate = $this->certificates->create([
                'enrollment_id' => $enrollment->id,
                'user_id' => $enrollment->user_id,
                'learning_path_id' => $enrollment->learning_path_id,
                'certificate_number' => $this->numbers->generate(),
                'verification_code' => $this->numbers->verificationCode(),
                'issued_at' => now(),
                'metadata' => [
                    'intern_name' => $enrollment->user->name,
                    'path_name' => $enrollment->learningPath->name,
                    'mentor_name' => $enrollment->mentor?->name,
                    'days_to_complete' => $daysToComplete,
                ],
            ]);

            $pdfPath = $this->pdf->generate($certificate);
            $certificate->update(['pdf_path' => $pdfPath]);

            $enrollment->user->notify(new CertificateIssuedNotification($certificate));

            $this->flashIssued($certificate);

            return $certificate->fresh(['user', 'learningPath']);
        });
    }

    public function verify(string $code): ?Certificate
    {
        return $this->certificates->findByVerificationCode($code);
    }

    private function flashIssued(Certificate $certificate): void
    {
        Session::flash('certificate_issued', [
            'id' => $certificate->id,
            'certificate_number' => $certificate->certificate_number,
            'path_name' => $certificate->metadata['path_name'] ?? $certificate->learningPath?->name,
        ]);
    }
}
