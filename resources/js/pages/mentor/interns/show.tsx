import { EnrollmentProgressBar, EnrollmentStatusBadge } from '@/components/admin/enrollment-status-badge';
import { InternLevelTimeline, type InternLevelRow } from '@/components/mentor/intern-level-timeline';
import { Avatar } from '@/components/catalyst/avatar';
import { Badge } from '@/components/catalyst/badge';
import { Button } from '@/components/catalyst/button';
import { ProgressBar } from '@/components/learning/progress-bar';
import { MILESTONE_STATUS_COLOR, MILESTONE_STATUS_LABEL } from '@/lib/capstone-labels';
import { useInitials } from '@/hooks/use-initials';
import { formatDisplayName } from '@/lib/user-profile';
import type { CapstoneProject } from '@/types/capstone';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type Enrollment, type EnrollmentStatus } from '@/types/learning';
import {
    ClipboardDocumentCheckIcon,
    FireIcon,
    RocketLaunchIcon,
    SparklesIcon,
} from '@heroicons/react/20/solid';
import { Head, Link } from '@inertiajs/react';

interface Props {
    enrollment: { data: Enrollment };
    level_progress: InternLevelRow[];
    capstone: { data: CapstoneProject } | null;
    insights: {
        levels_completed: number;
        levels_total: number;
        total_xp: number;
        current_streak: number;
        pending_submissions: number;
    };
}

export default function MentorInternsShow({ enrollment: enrollmentProp, level_progress, capstone, insights }: Props) {
    const enrollment = enrollmentProp.data;
    const user = enrollment.user;
    const getInitials = useInitials();
    const displayName = user ? formatDisplayName(user) : 'Intern';
    const capstoneProject = capstone?.data ?? null;
    const milestones = capstoneProject?.milestones ?? [];
    const approvedMilestones = milestones.filter((m) => m.status === 'approved').length;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'My Interns', href: '/mentor/interns' },
        { title: displayName, href: route('mentor.interns.show', user?.id) },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={displayName} />

            <Link href={route('mentor.interns.index')} className="text-xs font-medium text-violet-600 dark:text-violet-400">
                ← Back to roster
            </Link>

            <header className="mt-3 flex flex-col gap-4 rounded-2xl border border-zinc-950/10 bg-white p-5 dark:border-white/10 dark:bg-zinc-900 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                    <Avatar
                        src={user?.avatar_url}
                        initials={getInitials(displayName)}
                        alt={displayName}
                        className="size-14 ring-2 ring-zinc-950/5 dark:ring-white/10"
                    />
                    <div>
                        <h1 className="text-lg font-semibold text-zinc-950 dark:text-white">{displayName}</h1>
                        <p className="text-sm text-zinc-500">{user?.email}</p>
                        <p className="mt-1 text-xs font-medium text-violet-600 dark:text-violet-400">{enrollment.learning_path?.name}</p>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <EnrollmentStatusBadge status={enrollment.status as EnrollmentStatus} />
                    {insights.pending_submissions > 0 && (
                        <Button href={route('mentor.reviews.index')} outline className="!text-xs">
                            <ClipboardDocumentCheckIcon data-slot="icon" />
                            {insights.pending_submissions} pending review{insights.pending_submissions === 1 ? '' : 's'}
                        </Button>
                    )}
                </div>
            </header>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                    { label: 'Path progress', value: `${enrollment.progress_percentage}%`, icon: null },
                    { label: 'Levels done', value: `${insights.levels_completed}/${insights.levels_total}`, icon: null },
                    { label: 'Total XP', value: insights.total_xp.toLocaleString(), icon: SparklesIcon },
                    { label: 'Streak', value: `${insights.current_streak}d`, icon: FireIcon },
                ].map((item) => (
                    <div key={item.label} className="rounded-xl border border-zinc-950/10 bg-white px-4 py-3 dark:border-white/10 dark:bg-zinc-900">
                        <p className="text-[10px] font-semibold tracking-wide text-zinc-500 uppercase">{item.label}</p>
                        <p className="mt-1 flex items-center gap-1.5 text-xl font-bold text-zinc-950 dark:text-white">
                            {item.icon && <item.icon className="size-4 text-orange-500" />}
                            {item.value}
                        </p>
                    </div>
                ))}
            </div>

            <div className="mt-6 max-w-md">
                <EnrollmentProgressBar value={enrollment.progress_percentage} className="w-full" />
            </div>

            <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
                <InternLevelTimeline levels={level_progress} />

                <div className="space-y-4">
                    {capstoneProject ? (
                        <section className="rounded-xl border border-zinc-950/10 bg-white p-4 dark:border-white/10 dark:bg-zinc-900">
                            <div className="flex items-center gap-2">
                                <RocketLaunchIcon className="size-4 text-violet-600" />
                                <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">Capstone project</h3>
                            </div>
                            <p className="mt-2 font-medium text-zinc-950 dark:text-white">{capstoneProject.title}</p>
                            <p className="mt-1 text-xs text-zinc-500">{capstoneProject.status} · {capstoneProject.template?.name}</p>
                            <div className="mt-3">
                                <ProgressBar
                                    percentage={milestones.length ? Math.round((approvedMilestones / milestones.length) * 100) : 0}
                                    label="Milestones approved"
                                />
                            </div>
                            <ul className="mt-3 space-y-1.5">
                                {milestones.slice(0, 4).map((m) => (
                                    <li key={m.id} className="flex items-center justify-between gap-2 text-xs">
                                        <span className="truncate text-zinc-600 dark:text-zinc-300">{m.title}</span>
                                        <Badge color={MILESTONE_STATUS_COLOR[m.status]}>{MILESTONE_STATUS_LABEL[m.status]}</Badge>
                                    </li>
                                ))}
                            </ul>
                            <Button href={route('mentor.capstone-reviews.index')} outline className="mt-4 !text-xs">
                                Open milestone queue
                            </Button>
                        </section>
                    ) : (
                        <section className="rounded-xl border border-dashed border-zinc-300 px-4 py-8 text-center dark:border-zinc-600">
                            <p className="text-sm text-zinc-500">Capstone not started yet</p>
                            <p className="mt-1 text-xs text-zinc-400">Unlocks at Level 20</p>
                        </section>
                    )}

                    {enrollment.current_level && (
                        <section className="rounded-xl border border-blue-200/60 bg-blue-50/50 p-4 dark:border-blue-500/20 dark:bg-blue-950/20">
                            <p className="text-[10px] font-semibold tracking-wide text-blue-600 uppercase dark:text-blue-400">Current focus</p>
                            <p className="mt-1 text-sm font-semibold text-zinc-950 dark:text-white">
                                L{(enrollment.current_level as { number: number }).number} — {(enrollment.current_level as { title: string }).title}
                            </p>
                        </section>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
