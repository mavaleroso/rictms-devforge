<?php

namespace App\Library\Certificate;

use App\Models\Certificate;

final class CertificateNumberGenerator
{
    public function generate(): string
    {
        $prefix = config('certificates.number_prefix', 'DF');
        $year = now()->format('Y');
        $sequence = Certificate::query()
            ->whereYear('issued_at', $year)
            ->count() + 1;

        return sprintf('%s-%s-%05d', $prefix, $year, $sequence);
    }

    public function verificationCode(): string
    {
        return bin2hex(random_bytes(16));
    }
}
