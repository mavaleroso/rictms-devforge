import { Badge } from '@/components/catalyst/badge';
import { Button } from '@/components/catalyst/button';
import { MentorPageHero } from '@/components/mentor/mentor-page-hero';
import { MILESTONE_STATUS_COLOR, MILESTONE_STATUS_LABEL } from '@/lib/capstone-labels';
import type { CapstoneMilestone, CapstoneProject } from '@/types/capstone';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { CheckCircleIcon, ClockIcon, RocketLaunchIcon } from '@heroicons/react/20/solid';
import { Head, Link, router } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Milestone Reviews', href: '/mentor/capstone-reviews' },
];

interface Props {
    milestones: { data: CapstoneMilestone[] };
    kickoffs: { data: CapstoneProject[] };
    stats: { pending: number; kickoffs: number; interns_waiting: number };
}

export default function MentorCapstoneReviewsIndex({ milestones: milestonesProp, kickoffs: kickoffsProp, stats }: Props) {
    const milestones = milestonesProp.data;
    const kickoffs = kickoffsProp.data;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Milestone Reviews" />

            <MentorPageHero
                icon={RocketLaunchIcon}
                iconClassName="bg-brand-600"
                title="Capstone reviews"
                description="Approve kickoffs, then sign off milestone deliverables with feedback and scores."
                stats={[
                    { label: 'Awaiting sign-off', value: stats.pending, accent: 'violet' },
                    { label: 'Kickoffs', value: stats.kickoffs, accent: 'amber' },
                    { label: 'Interns waiting', value: stats.interns_waiting, accent: 'default' },
                ]}
            />

            {kickoffs.length > 0 && (
                <section className="mt-6">
                    <h2 className="text-sm font-semibold text-zinc-950 dark:text-white">Kickoff approvals</h2>
                    <ul className="mt-3 space-y-2">
                        {kickoffs.map((project) => (
                            <li
                                key={project.id}
                                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200/80 bg-amber-50/50 px-4 py-3 dark:border-amber-500/20 dark:bg-amber-950/20"
                            >
                                <div>
                                    <p className="text-sm font-semibold text-zinc-950 dark:text-white">{project.title}</p>
                                    <p className="text-xs text-zinc-500">{project.enrollment?.user?.name ?? 'Intern'}</p>
                                </div>
                                <Button
                                    className="!text-xs"
                                    onClick={() => router.post(route('mentor.capstone-kickoffs.approve', project.id))}
                                >
                                    Approve kickoff
                                </Button>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {milestones.length === 0 ? (
                <div className="mt-6 flex flex-col items-center rounded-xl border border-dashed border-zinc-300 px-6 py-14 text-center dark:border-zinc-600">
                    <span className="flex size-12 items-center justify-center rounded-full bg-lime-500/10 text-lime-600">
                        <CheckCircleIcon className="size-6" />
                    </span>
                    <p className="mt-4 text-sm font-medium text-zinc-950 dark:text-white">No milestone reviews waiting</p>
                    <p className="mt-1 text-xs text-zinc-500">Submitted milestones will appear here.</p>
                </div>
            ) : (
                <ul className="mt-6 space-y-3">
                    {milestones.map((milestone) => (
                        <li key={milestone.id}>
                            <Link
                                href={route('mentor.capstone-reviews.show', milestone.id)}
                                className="group flex flex-wrap items-center justify-between gap-4 rounded-xl border border-zinc-950/10 bg-white px-4 py-4 shadow-sm transition hover:border-brand-300/60 hover:shadow-md dark:border-white/10 dark:bg-zinc-900 dark:hover:border-brand-500/30"
                            >
                                <div className="flex min-w-0 items-start gap-3">
                                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400">
                                        <ClockIcon className="size-4" />
                                    </span>
                                    <div className="min-w-0">
                                        <p className="font-semibold text-zinc-950 group-hover:text-brand-700 dark:text-white dark:group-hover:text-brand-300">
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
