<?php

namespace App\Http\Controllers\Learn;

use App\Http\Controllers\Controller;
use App\Http\Resources\CertificateResource;
use App\Models\Certificate;
use App\Repositories\Contracts\CertificateRepository;
use App\Services\Certificate\CertificatePdfService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class CertificateController extends Controller
{
    public function __construct(
        private readonly CertificateRepository $certificates,
        private readonly CertificatePdfService $pdf,
    ) {}

    public function index(Request $request): InertiaResponse
    {
        $this->authorize('viewAny', Certificate::class);

        $items = $this->certificates->forUser($request->user());

        return Inertia::render('learn/certificates/index', [
            'certificates' => CertificateResource::collection($items)->resolve(),
        ]);
    }

    public function show(Certificate $certificate): InertiaResponse
    {
        $this->authorize('view', $certificate);

        $certificate->load(['learningPath', 'enrollment.mentor']);

        return Inertia::render('learn/certificates/show', [
            'certificate' => (new CertificateResource($certificate))->resolve(),
        ]);
    }

    public function download(Certificate $certificate): Response
    {
        $this->authorize('download', $certificate);

        $contents = $this->pdf->contents($certificate);

        if ($contents === null) {
            abort(404, 'Certificate PDF not found.');
        }

        $filename = $certificate->certificate_number.'.pdf';

        return response($contents, 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="'.$filename.'"',
        ]);
    }
}
