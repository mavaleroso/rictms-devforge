import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                <div className="aspect-video rounded-xl border border-zinc-950/10 bg-zinc-50 dark:border-white/10 dark:bg-zinc-800/50" />
                <div className="aspect-video rounded-xl border border-zinc-950/10 bg-zinc-50 dark:border-white/10 dark:bg-zinc-800/50" />
                <div className="aspect-video rounded-xl border border-zinc-950/10 bg-zinc-50 dark:border-white/10 dark:bg-zinc-800/50" />
            </div>
            <div className="mt-4 min-h-[50vh] rounded-xl border border-zinc-950/10 bg-zinc-50 dark:border-white/10 dark:bg-zinc-800/50" />
        </AppLayout>
    );
}
