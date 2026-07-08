<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Certificate {{ $certificate->certificate_number }}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: DejaVu Sans, sans-serif; color: #18181b; }
        .page {
            width: 100%;
            height: 100%;
            padding: 36px 48px;
            background: linear-gradient(135deg, #fafafa 0%, #f4f4f5 100%);
            position: relative;
        }
        .border-frame {
            border: 3px solid #3f3f46;
            border-radius: 8px;
            padding: 28px 36px;
            height: 100%;
            position: relative;
        }
        .accent { height: 4px; background: #2563eb; margin-bottom: 20px; border-radius: 2px; }
        .issuer { font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #71717a; text-align: center; }
        .title { font-size: 28px; font-weight: bold; text-align: center; margin: 12px 0 6px; color: #18181b; }
        .subtitle { font-size: 12px; text-align: center; color: #52525b; margin-bottom: 24px; }
        .recipient { font-size: 32px; font-weight: bold; text-align: center; color: #1d4ed8; margin: 16px 0; }
        .path { font-size: 16px; text-align: center; color: #3f3f46; margin-bottom: 8px; }
        .meta { font-size: 11px; text-align: center; color: #71717a; margin-top: 20px; }
        .footer {
            position: absolute;
            bottom: 28px;
            left: 36px;
            right: 36px;
            display: table;
            width: calc(100% - 72px);
        }
        .footer-col { display: table-cell; vertical-align: bottom; width: 33%; }
        .footer-col.center { text-align: center; }
        .footer-col.right { text-align: right; }
        .label { font-size: 9px; text-transform: uppercase; letter-spacing: 1px; color: #a1a1aa; }
        .value { font-size: 11px; font-weight: bold; color: #3f3f46; margin-top: 2px; }
        .qr { width: 80px; height: 80px; }
        .verify { font-size: 8px; color: #71717a; margin-top: 4px; word-break: break-all; }
    </style>
</head>
<body>
    <div class="page">
        <div class="border-frame">
            <div class="accent"></div>
            <p class="issuer">{{ $issuer }}</p>
            <h1 class="title">Certificate of Completion</h1>
            <p class="subtitle">This certifies that</p>
            <p class="recipient">{{ $certificate->metadata['intern_name'] ?? $certificate->user->name }}</p>
            <p class="path">has successfully completed</p>
            <p class="path" style="font-weight: bold;">{{ $certificate->metadata['path_name'] ?? $certificate->learningPath->name }}</p>
            @if (!empty($certificate->metadata['mentor_name']))
                <p class="meta">Mentored by {{ $certificate->metadata['mentor_name'] }}</p>
            @endif
            <p class="meta">Issued {{ $certificate->issued_at->format('F j, Y') }}</p>

            <div class="footer">
                <div class="footer-col">
                    <p class="label">Certificate no.</p>
                    <p class="value">{{ $certificate->certificate_number }}</p>
                </div>
                <div class="footer-col center">
                    <img class="qr" src="data:image/png;base64,{{ $qrBase64 }}" alt="QR">
                    <p class="verify">{{ $verifyUrl }}</p>
                </div>
                <div class="footer-col right">
                    <p class="label">Verification</p>
                    <p class="value">{{ substr($certificate->verification_code, 0, 12) }}…</p>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
