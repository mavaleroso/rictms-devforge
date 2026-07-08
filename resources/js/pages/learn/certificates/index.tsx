import { CertificateCard } from '@/components/certificate/certificate-card';
import { MentorPageHero } from '@/components/mentor/mentor-page-hero';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import type { Certificate } from '@/types/certificate';
import { ShieldCheckIcon } from '@heroicons/react/20/solid';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Certificates', href: '/learn/certificates' },
];

interface Props {
    certificates: Certificate[];
}

export default function LearnCertificatesIndex({ certificates }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Certificates" />

            <MentorPageHero
                icon={ShieldCheckIcon}
                iconClassName="bg-blue-600"
                title="Your certificates"
                description="Download PDF credentials with QR verification. Share the verification link with employers."
                stats={[{ label: 'Earned', value: certificates.length, accent: 'blue' }]}
            />

            {certificates.length === 0 ? (
                <div className="mt-6 rounded-xl border border-dashed border-zinc-300 px-6 py-14 text-center dark:border-zinc-600">
                    <p className="text-sm font-medium text-zinc-950 dark:text-white">No certificates yet</p>
                    <p className="mt-1 text-xs text-zinc-500">
                        Complete your learning path to earn a verifiable certificate.
                    </p>
                </div>
            ) : (
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {certificates.map((certificate) => (
                        <CertificateCard key={certificate.id} certificate={certificate} />
                    ))}
                </div>
            )}
        </AppLayout>
    );
}
