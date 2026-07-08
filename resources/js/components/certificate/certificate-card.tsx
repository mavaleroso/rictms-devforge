import { Button } from '@/components/catalyst/button';
import type { Certificate } from '@/types/certificate';
import { ArrowDownTrayIcon, ShieldCheckIcon } from '@heroicons/react/20/solid';
import { Link } from '@inertiajs/react';

interface CertificateCardProps {
    certificate: Certificate;
    compact?: boolean;
}

export function CertificateCard({ certificate, compact = false }: CertificateCardProps) {
    const pathName = certificate.metadata?.path_name ?? certificate.learning_path?.name ?? 'Learning path';
    const issued = new Date(certificate.issued_at).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });

    return (
        <div className="group relative overflow-hidden rounded-xl border border-zinc-950/10 bg-white shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-zinc-900">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-600 to-violet-600" />
            <div className={compact ? 'p-4' : 'p-5'}>
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <p className="text-[10px] font-semibold tracking-wide text-blue-600 uppercase dark:text-blue-400">
                            Certificate
                        </p>
                        <p className="mt-1 truncate font-semibold text-zinc-950 dark:text-white">{pathName}</p>
                        <p className="mt-0.5 text-xs text-zinc-500">{certificate.certificate_number}</p>
                    </div>
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                        <ShieldCheckIcon className="size-4" />
                    </span>
                </div>
                <p className="mt-3 text-xs text-zinc-500">Issued {issued}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                    <Button href={route('learn.certificates.show', certificate.id)} outline className="!text-xs">
                        View
                    </Button>
                    <Button href={route('learn.certificates.download', certificate.id)} className="!text-xs">
                        <ArrowDownTrayIcon data-slot="icon" />
                        PDF
                    </Button>
                </div>
            </div>
        </div>
    );
}

interface CertificatePreviewProps {
    certificate: Certificate;
}

export function CertificatePreview({ certificate }: CertificatePreviewProps) {
    const pathName = certificate.metadata?.path_name ?? certificate.learning_path?.name ?? 'Learning path';
    const internName = certificate.metadata?.intern_name ?? certificate.user?.name ?? 'Intern';
    const mentorName = certificate.metadata?.mentor_name ?? certificate.enrollment?.mentor?.name;
    const issued = new Date(certificate.issued_at).toLocaleDateString(undefined, {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });

    return (
        <div className="relative overflow-hidden rounded-2xl border border-zinc-950/10 bg-gradient-to-br from-zinc-50 via-white to-blue-50/50 p-6 shadow-sm dark:border-white/10 dark:from-zinc-900 dark:via-zinc-900 dark:to-blue-950/20 sm:p-8">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-600 to-violet-600" />
            <p className="text-center text-[10px] font-semibold tracking-[0.2em] text-zinc-500 uppercase">DevForge Academy</p>
            <h2 className="mt-3 text-center text-xl font-semibold text-zinc-950 sm:text-2xl dark:text-white">
                Certificate of Completion
            </h2>
            <p className="mt-2 text-center text-sm text-zinc-500">Awarded to</p>
            <p className="mt-2 text-center text-2xl font-bold text-blue-700 sm:text-3xl dark:text-blue-400">{internName}</p>
            <p className="mt-4 text-center text-sm text-zinc-600 dark:text-zinc-400">
                for completing <span className="font-semibold text-zinc-950 dark:text-white">{pathName}</span>
            </p>
            {mentorName && (
                <p className="mt-2 text-center text-xs text-zinc-500">Mentored by {mentorName}</p>
            )}
            <p className="mt-6 text-center text-xs text-zinc-500">{issued}</p>
            <p className="mt-4 text-center font-mono text-[11px] text-zinc-400">{certificate.certificate_number}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
                <Button href={route('learn.certificates.download', certificate.id)}>
                    <ArrowDownTrayIcon data-slot="icon" />
                    Download PDF
                </Button>
                <Button href={certificate.verify_url} outline target="_blank">
                    Verification link
                </Button>
            </div>
        </div>
    );
}
