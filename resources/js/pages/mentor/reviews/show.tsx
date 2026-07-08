import { Badge } from '@/components/catalyst/badge';
import { MentorDecisionForm } from '@/components/mentor/mentor-decision-form';
import { SUBMISSION_STATUS_COLOR, SUBMISSION_STATUS_LABEL } from '@/lib/coding-challenge-library';
import type { ChallengeSubmission } from '@/lib/coding-challenge-library/types';
import AppLayout from '@/layouts/app-layout';
import { useValidatedForm } from '@/hooks/use-validated-form';
import { type BreadcrumbItem } from '@/types';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/20/solid';
import { Head, Link } from '@inertiajs/react';
import clsx from 'clsx';
import { FormEventHandler } from 'react';

interface Props {
    submission: { data: ChallengeSubmission };
}

export default function MentorReviewsShow({ submission: submissionProp }: Props) {
    const submission = submissionProp.data;
    const results = submission.results ?? [];

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Code Reviews', href: '/mentor/reviews' },
        { title: submission.user?.name ?? 'Review', href: route('mentor.reviews.show', submission.id) },
    ];

    const form = useValidatedForm({
        status: 'approved' as 'approved' | 'rejected',
        mentor_feedback: '',
        mentor_score: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        form.patch(route('mentor.reviews.update', submission.id), {
            mentor_feedback: form.data.mentor_feedback || null,
            mentor_score: form.data.mentor_score ? Number(form.data.mentor_score) : null,
            successToast: {
                title: 'Review submitted',
                message: 'The intern can see your decision on their challenge workspace.',
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Review — ${submission.user?.name ?? 'Intern'}`} />

            <Link href={route('mentor.reviews.index')} className="text-xs font-medium text-violet-600 dark:text-violet-400">
                ← Back to queue
            </Link>

            <header className="mt-3 flex flex-wrap items-start justify-between gap-3 rounded-xl border border-zinc-950/10 bg-white p-4 dark:border-white/10 dark:bg-zinc-900">
                <div>
                    <p className="text-[10px] font-semibold tracking-wide text-amber-600 uppercase">Code review</p>
                    <h1 className="mt-1 text-lg font-semibold text-zinc-950 dark:text-white">{submission.challenge?.title}</h1>
                    <p className="mt-1 text-xs text-zinc-500">
                        {submission.user?.name} · {submission.user?.email} · Attempt #{submission.attempt_number}
                    </p>
                </div>
                <Badge color={SUBMISSION_STATUS_COLOR[submission.status]}>{SUBMISSION_STATUS_LABEL[submission.status]}</Badge>
            </header>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {[
                    { label: 'Tests passed', value: `${submission.tests_passed}/${submission.tests_total}` },
                    { label: 'Language', value: submission.language?.toUpperCase() ?? '—' },
                    { label: 'Runtime', value: submission.runtime_ms != null ? `${submission.runtime_ms}ms` : '—' },
                ].map((item) => (
                    <div key={item.label} className="rounded-lg border border-zinc-950/10 bg-zinc-50 px-3 py-2 dark:border-white/10 dark:bg-zinc-800/50">
                        <p className="text-[10px] text-zinc-500 uppercase">{item.label}</p>
                        <p className="text-sm font-semibold text-zinc-950 dark:text-white">{item.value}</p>
                    </div>
                ))}
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
                <div className="space-y-4">
                    {results.length > 0 && (
                        <section className="overflow-hidden rounded-xl border border-zinc-950/10 dark:border-white/10">
                            <div className="border-b border-zinc-950/8 bg-zinc-50 px-4 py-2 text-xs font-semibold text-zinc-600 dark:border-white/8 dark:bg-zinc-900 dark:text-zinc-400">
                                Test results
                            </div>
                            <ul className="divide-y divide-zinc-950/5 dark:divide-white/5">
                                {results.map((result, index) => (
                                    <li key={result.id ?? index} className="flex items-center justify-between gap-3 px-4 py-2.5 text-xs">
                                        <span className="text-zinc-600 dark:text-zinc-300">
                                            {result.test_case?.label ?? `Test ${index + 1}`}
                                        </span>
                                        <span className={clsx('flex items-center gap-1 font-medium', result.passed ? 'text-lime-600' : 'text-red-600')}>
                                            {result.passed ? <CheckCircleIcon className="size-3.5" /> : <XCircleIcon className="size-3.5" />}
                                            {result.passed ? 'Pass' : 'Fail'}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    <section className="overflow-hidden rounded-xl border border-zinc-950/10 dark:border-white/10">
                        <div className="flex items-center justify-between border-b border-zinc-950/8 bg-zinc-900 px-4 py-2 dark:border-white/8">
                            <span className="text-xs text-zinc-400">Submitted code</span>
                            <span className="text-[10px] text-zinc-500">{submission.language}</span>
                        </div>
                        <pre className="max-h-[24rem] overflow-auto bg-zinc-950 p-4 font-mono text-xs leading-relaxed text-zinc-100">{submission.code}</pre>
                    </section>
                </div>

                <MentorDecisionForm
                    title="Your decision"
                    subtitle="Approve if the solution is correct and maintainable. Reject with concrete improvements."
                    decision={form.data.status}
                    onDecisionChange={(value) => form.setData('status', value)}
                    approveLabel="Approve submission"
                    rejectLabel="Request revision"
                    score={form.data.mentor_score}
                    onScoreChange={(value) => form.setData('mentor_score', value)}
                    scoreError={form.errors.mentor_score}
                    feedback={form.data.mentor_feedback}
                    onFeedbackChange={(value) => form.setData('mentor_feedback', value)}
                    feedbackError={form.errors.mentor_feedback}
                    processing={form.processing}
                    onSubmit={submit}
                />
            </div>
        </AppLayout>
    );
}
