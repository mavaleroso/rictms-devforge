import { Badge } from '@/components/catalyst/badge';
import { Button } from '@/components/catalyst/button';
import { DataTableMetaText } from '@/components/data-table';
import { MentorPageHero } from '@/components/mentor/mentor-page-hero';
import { SUBMISSION_STATUS_COLOR, SUBMISSION_STATUS_LABEL } from '@/lib/coding-challenge-library';
import type { ChallengeSubmission } from '@/lib/coding-challenge-library/types';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { CheckCircleIcon, ClipboardDocumentCheckIcon, ClockIcon, XCircleIcon } from '@heroicons/react/20/solid';
import { Head, Link } from '@inertiajs/react';
import clsx from 'clsx';

interface Props {
    submissions: { data: ChallengeSubmission[] };
    stats: { pending: number; interns_waiting: number };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Code Reviews', href: '/mentor/reviews' },
];

export default function MentorReviewsIndex({ submissions, stats }: Props) {
    const items = submissions.data;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Code Reviews" />

            <MentorPageHero
                icon={ClipboardDocumentCheckIcon}
                iconClassName="bg-amber-500"
                title="Code review queue"
                description="Interns passed automated tests. Review code quality, approve for credit, or request revisions with clear feedback."
                stats={[
                    { label: 'Pending', value: stats.pending, accent: 'amber' },
                    { label: 'Interns waiting', value: stats.interns_waiting, accent: 'default' },
                ]}
            />

            <section className="mt-6 overflow-hidden rounded-xl border border-zinc-950/10 bg-white shadow-sm dark:border-white/10 dark:bg-zinc-900">
                {items.length === 0 ? (
                    <div className="flex flex-col items-center px-6 py-14 text-center">
                        <span className="flex size-12 items-center justify-center rounded-full bg-lime-500/10 text-lime-600">
                            <CheckCircleIcon className="size-6" />
                        </span>
                        <p className="mt-4 text-sm font-medium text-zinc-950 dark:text-white">Queue is clear</p>
                        <p className="mt-1 text-xs text-zinc-500">No submissions need your review right now.</p>
                    </div>
                ) : (
                    <ul className="divide-y divide-zinc-950/5 dark:divide-white/5">
                        {items.map((submission) => {
                            const passRate = submission.tests_total
                                ? Math.round((submission.tests_passed / submission.tests_total) * 100)
                                : 0;

                            return (
                                <li key={submission.id}>
                                    <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-5">
                                        <div className="flex min-w-0 items-start gap-3">
                                            <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                                                <ClockIcon className="size-4" />
                                            </span>
                                            <div className="min-w-0">
                                                <DataTableMetaText
                                                    primary={submission.challenge?.title ?? 'Coding challenge'}
                                                    secondary={`${submission.user?.name ?? 'Intern'} · Attempt #${submission.attempt_number}`}
                                                />
                                                <div className="mt-2 flex flex-wrap items-center gap-2">
                                                    <Badge color={SUBMISSION_STATUS_COLOR[submission.status]}>
                                                        {SUBMISSION_STATUS_LABEL[submission.status]}
                                                    </Badge>
                                                    <span
                                                        className={clsx(
                                                            'text-[11px] font-medium',
                                                            passRate === 100 ? 'text-lime-600' : 'text-amber-600',
                                                        )}
                                                    >
                                                        {submission.tests_passed}/{submission.tests_total} tests passed
                                                    </span>
                                                    {submission.runtime_ms != null && (
                                                        <span className="text-[11px] text-zinc-500">{submission.runtime_ms}ms runtime</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <Button href={route('mentor.reviews.show', submission.id)} className="!text-xs">
                                            Start review
                                        </Button>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </section>

            <p className="mt-4 text-xs text-zinc-500">
                Tip: Approve when code is readable, correct, and follows team standards — not only when tests pass.
            </p>
        </AppLayout>
    );
}
