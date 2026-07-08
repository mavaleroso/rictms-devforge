import { CertificatePreview } from '@/components/certificate/certificate-card';
import { Badge } from '@/components/catalyst/badge';
import { Button } from '@/components/catalyst/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import type { Certificate } from '@/types/certificate';
import { ArrowLeftIcon, ClipboardDocumentIcon } from '@heroicons/react/20/solid';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

interface Props {
    certificate: Certificate;
}

export default function LearnCertificateShow({ certificate }: Props) {
    const [copied, setCopied] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Certificates', href: '/learn/certificates' },
        { title: certificate.certificate_number, href: route('learn.certificates.show', certificate.id) },
    ];

    async function copyVerifyLink() {
        await navigator.clipboard.writeText(certificate.verify_url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={certificate.certificate_number} />

            <div className="mb-4">
                <Button href={route('learn.certificates.index')} plain className="!text-xs">
                    <ArrowLeftIcon data-slot="icon" />
                    Back to certificates
                </Button>
            </div>

            <CertificatePreview certificate={certificate} />

            <div className="mt-6 rounded-xl border border-zinc-950/10 bg-white p-4 dark:border-white/10 dark:bg-zinc-900">
                <p className="text-xs font-semibold text-zinc-950 dark:text-white">Verification</p>
                <p className="mt-1 text-xs text-zinc-500">
                    Anyone can confirm this credential at the public verification page.
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                    <Badge color="zinc" className="font-mono text-[10px]">
                        {certificate.verification_code}
                    </Badge>
                    <Button outline className="!text-xs" onClick={copyVerifyLink}>
                        <ClipboardDocumentIcon data-slot="icon" />
                        {copied ? 'Copied' : 'Copy link'}
                    </Button>
                    <Button href={certificate.verify_url} outline className="!text-xs" target="_blank">
                        Open verify page
                    </Button>
                </div>
            </div>
        </AppLayout>
    );
}
