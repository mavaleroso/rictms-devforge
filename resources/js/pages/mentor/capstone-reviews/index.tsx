import { Badge } from '@/components/catalyst/badge';
import { Button } from '@/components/catalyst/button';
import { MentorPageHero } from '@/components/mentor/mentor-page-hero';
import { MILESTONE_STATUS_COLOR, MILESTONE_STATUS_LABEL } from '@/lib/capstone-labels';
import type { CapstoneMilestone } from '@/types/capstone';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { CheckCircleIcon, ClockIcon, RocketLaunchIcon } from '@heroicons/react/20/solid';
import { Head, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Milestone Reviews', href: '/mentor/capstone-reviews' },
];

interface Props {
    milestones: { data: CapstoneMilestone[] };
    stats: { pending: number; interns_waiting: number };
}

export default function MentorCapstoneReviewsIndex({ milestones: milestonesProp, stats }: Props) {
    const milestones = milestonesProp.data;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Milestone Reviews" />

            <MentorPageHero
                icon={RocketLaunchIcon}
                iconClassName="bg-violet-600"
                title="Capstone milestone sign-offs"
                description="Interns submit milestone deliverables for approval. Sign off when acceptance criteria are met, or return with revision notes."
                stats={[
                    { label: 'Awaiting sign-off', value: stats.pending, accent: 'violet' },
                    { label: 'Interns waiting', value: stats.interns_waiting, accent: 'default' },
                ]}
            />

            {milestones.length === 0 ? (
                <div className="mt-6 flex flex-col items-center rounded-xl border border-dashed border-zinc-300 px-6 py-14 text-center dark:border-zinc-600">
                    <span className="flex size-12 items-center justify-center rounded-full bg-lime-500/10 text-lime-600">
                        <CheckCircleIcon className="size-6" />
                    </span>
                    <p className="mt-4 text-sm font-medium text-zinc-950 dark:text-white">All caught up</p>
                    <p className="mt-1 text-xs text-zinc-500">No capstone milestones are waiting for your review.</p>
                </div>
            ) : (
                <ul className="mt-6 space-y-3">
                    {milestones.map((milestone) => (
                        <li key={milestone.id}>
                            <Link
                                href={route('mentor.capstone-reviews.show', milestone.id)}
                                className="group flex flex-wrap items-center justify-between gap-4 rounded-xl border border-zinc-950/10 bg-white px-4 py-4 shadow-sm transition hover:border-violet-300/60 hover:shadow-md dark:border-white/10 dark:bg-zinc-900 dark:hover:border-violet-500/30"
                            >
                                <div className="flex min-w-0 items-start gap-3">
                                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400">
                                        <ClockIcon className="size-4" />
                                    </span>
                                    <div className="min-w-0">
                                        <p className="font-semibold text-zinc-950 group-hover:text-violet-700 dark:text-white dark:group-hover:text-violet-300">
                                            {milestone.title}
                                        </p>
                                        <p className="mt-0.5 text-xs text-zinc-500">
                                            {milestone.project?.enrollment?.user?.name ?? 'Intern'} · {milestone.project?.title}
                                        </p>
                                        {milestone.submitted_at && (
                                            <p className="mt-1 text-[11px] text-zinc-400">
                                                Submitted {new Date(milestone.submitted_at).toLocaleString()}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Badge color={MILESTONE_STATUS_COLOR[milestone.status]}>{MILESTONE_STATUS_LABEL[milestone.status]}</Badge>
                                    <Button outline className="!text-xs pointer-events-none">
                                        Review
                                    </Button>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </AppLayout>
    );
}
