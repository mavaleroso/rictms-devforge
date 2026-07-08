import { Badge } from '@/components/catalyst/badge';
import AppLogo from '@/components/app-logo';
import { CheckCircleIcon, ShieldExclamationIcon } from '@heroicons/react/20/solid';
import { Head } from '@inertiajs/react';

interface VerifiedCertificate {
    certificate_number: string;
    intern_name: string;
    path_name: string;
    mentor_name?: string | null;
    issued_at: string;
}

interface Props {
    valid: boolean;
    certificate: VerifiedCertificate | null;
    code: string;
}

export default function CertificateVerify({ valid, certificate, code }: Props) {
    const issued = certificate
        ? new Date(certificate.issued_at).toLocaleDateString(undefined, {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
          })
        : null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-blue-50/40 dark:from-zinc-950 dark:via-zinc-900 dark:to-blue-950/20">
            <Head title="Verify Certificate" />

            <header className="border-b border-zinc-950/5 bg-white/80 px-4 py-4 backdrop-blur dark:border-white/5 dark:bg-zinc-900/80">
                <div className="mx-auto flex max-w-2xl items-center justify-between">
                    <AppLogo />
                    <Badge color="zinc">Public verification</Badge>
                </div>
            </header>

            <main className="mx-auto max-w-2xl px-4 py-12">
                <div className="overflow-hidden rounded-2xl border border-zinc-950/10 bg-white shadow-lg dark:border-white/10 dark:bg-zinc-900">
                    <div className={`h-1 ${valid ? 'bg-gradient-to-r from-emerald-500 to-green-500' : 'bg-gradient-to-r from-red-500 to-rose-500'}`} />

                    <div className="p-6 sm:p-8">
                        <div className="flex flex-col items-center text-center">
                            <span
                                className={`flex size-14 items-center justify-center rounded-full ${
                                    valid ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'
                                }`}
                            >
                                {valid ? <CheckCircleIcon className="size-7" /> : <ShieldExclamationIcon className="size-7" />}
                            </span>

                            <h1 className="mt-4 text-xl font-semibold text-zinc-950 dark:text-white">
                                {valid ? 'Certificate verified' : 'Verification failed'}
                            </h1>
                            <p className="mt-2 text-sm text-zinc-500">
                                {valid
                                    ? 'This credential is authentic and was issued by DevForge Academy.'
                                    : 'No certificate matches this verification code.'}
                            </p>
                        </div>

                        {valid && certificate && (
                            <dl className="mt-8 space-y-4 rounded-xl border border-zinc-950/5 bg-zinc-50/80 p-4 dark:border-white/5 dark:bg-zinc-800/50">
                                <div>
                                    <dt className="text-[10px] font-semibold tracking-wide text-zinc-500 uppercase">Recipient</dt>
                                    <dd className="mt-0.5 font-medium text-zinc-950 dark:text-white">{certificate.intern_name}</dd>
                                </div>
                                <div>
                                    <dt className="text-[10px] font-semibold tracking-wide text-zinc-500 uppercase">Program</dt>
                                    <dd className="mt-0.5 font-medium text-zinc-950 dark:text-white">{certificate.path_name}</dd>
                                </div>
                                {certificate.mentor_name && (
                                    <div>
                                        <dt className="text-[10px] font-semibold tracking-wide text-zinc-500 uppercase">Mentor</dt>
                                        <dd className="mt-0.5 text-sm text-zinc-700 dark:text-zinc-300">{certificate.mentor_name}</dd>
                                    </div>
                                )}
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <dt className="text-[10px] font-semibold tracking-wide text-zinc-500 uppercase">Issued</dt>
                                        <dd className="mt-0.5 text-sm text-zinc-700 dark:text-zinc-300">{issued}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-[10px] font-semibold tracking-wide text-zinc-500 uppercase">Certificate #</dt>
                                        <dd className="mt-0.5 font-mono text-sm text-zinc-700 dark:text-zinc-300">
                                            {certificate.certificate_number}
                                        </dd>
                                    </div>
                                </div>
                            </dl>
                        )}

                        <p className="mt-6 text-center font-mono text-[10px] text-zinc-400">{code}</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
