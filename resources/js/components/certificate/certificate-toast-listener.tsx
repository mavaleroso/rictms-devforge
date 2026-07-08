import { useToast } from '@/components/toast/toast-provider';
import type { CertificateIssuedFlash } from '@/types/certificate';
import { usePage } from '@inertiajs/react';
import { useEffect, useRef } from 'react';

export function CertificateToastListener() {
    const { flash } = usePage<{ flash?: { certificate_issued?: CertificateIssuedFlash } }>().props;
    const { showSuccess } = useToast();
    const shown = useRef('');

    useEffect(() => {
        const issued = flash?.certificate_issued;

        if (!issued) {
            shown.current = '';

            return;
        }

        const signature = JSON.stringify(issued);

        if (signature === shown.current) {
            return;
        }

        shown.current = signature;

        showSuccess(
            'Certificate issued',
            `${issued.path_name ?? 'Learning path'} · ${issued.certificate_number}`,
        );
    }, [flash?.certificate_issued, showSuccess]);

    return null;
}
