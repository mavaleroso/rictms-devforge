import { Head } from '@inertiajs/react';
import { GuestLayout } from '@/layouts/guest-layout';
import { Button } from '@/components/ui/button';
import type { WelcomePageProps } from '@/types';

export default function Welcome({ appName, tagline }: WelcomePageProps) {
    return (
        <GuestLayout title={appName}>
            <Head title="Welcome" />
            <section className="space-y-4">
                <p className="text-xs font-semibold tracking-wide text-zinc-500 uppercase">Sandbox</p>
                <h1 className="text-3xl font-semibold tracking-tight">{appName}</h1>
                <p className="max-w-xl text-sm leading-relaxed text-zinc-600">{tagline}</p>
                <Button>Get started</Button>
            </section>
        </GuestLayout>
    );
}
