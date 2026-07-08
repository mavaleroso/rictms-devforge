import { InternRosterCard } from '@/components/mentor/intern-roster-card';
import { MentorPageHero } from '@/components/mentor/mentor-page-hero';
import { Button } from '@/components/catalyst/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type Enrollment, type PaginatedCollection } from '@/types/learning';
import { ClipboardDocumentCheckIcon, RocketLaunchIcon, UserGroupIcon } from '@heroicons/react/20/solid';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'My Interns', href: '/mentor/interns' },
];

interface Props {
    interns: PaginatedCollection<Enrollment>;
    stats: { total: number; active: number; completed: number; avg_progress: number };
    queue: { code_reviews: number; milestone_reviews: number };
}

export default function MentorInternsIndex({ interns, stats, queue }: Props) {
    const items = interns.data;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Interns" />

            <MentorPageHero
                icon={UserGroupIcon}
                iconClassName="bg-blue-600"
                title="My interns"
                description="Monitor learning progress, identify who needs support, and jump into review queues when work is ready."
                stats={[
                    { label: 'Assigned', value: stats.total, accent: 'blue' },
                    { label: 'Active', value: stats.active, accent: 'default' },
                    { label: 'Avg progress', value: `${stats.avg_progress}%`, accent: 'lime' },
                    { label: 'Completed', value: stats.completed, accent: 'default' },
                ]}
            >
                <div className="flex flex-wrap gap-2">
                    {queue.code_reviews > 0 && (
                        <Button href={route('mentor.reviews.index')} outline className="!text-xs">
                            <ClipboardDocumentCheckIcon data-slot="icon" />
                            {queue.code_reviews} code review{queue.code_reviews === 1 ? '' : 's'}
                        </Button>
                    )}
                    {queue.milestone_reviews > 0 && (
                        <Button href={route('mentor.capstone-reviews.index')} outline className="!text-xs">
                            <RocketLaunchIcon data-slot="icon" />
                            {queue.milestone_reviews} milestone{queue.milestone_reviews === 1 ? '' : 's'}
                        </Button>
                    )}
                </div>
            </MentorPageHero>

            {items.length === 0 ? (
                <div className="mt-8 rounded-xl border border-dashed border-zinc-300 px-6 py-14 text-center dark:border-zinc-600">
                    <p className="text-sm font-medium text-zinc-950 dark:text-white">No interns assigned yet</p>
                    <p className="mt-1 text-xs text-zinc-500">When an admin enrolls an intern with you as mentor, they appear here.</p>
                </div>
            ) : (
                <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {items.map((enrollment) => (
                        <InternRosterCard key={enrollment.id} enrollment={enrollment} />
                    ))}
                </div>
            )}
        </AppLayout>
    );
}
