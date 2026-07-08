import { Badge } from '@/components/catalyst/badge';
import { MentorDecisionForm } from '@/components/mentor/mentor-decision-form';
import { MILESTONE_STATUS_COLOR, MILESTONE_STATUS_LABEL } from '@/lib/capstone-labels';
import type { CapstoneMilestone } from '@/types/capstone';
import AppLayout from '@/layouts/app-layout';
import { useValidatedForm } from '@/hooks/use-validated-form';
import { type BreadcrumbItem } from '@/types';
import { CheckCircleIcon } from '@heroicons/react/20/solid';
import { Head, Link } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface Props {
    milestone: { data: CapstoneMilestone };
}

export default function MentorCapstoneReviewsShow({ milestone: milestoneProp }: Props) {
    const milestone = milestoneProp.data;
    const internName = milestone.project?.enrollment?.user?.name ?? 'Intern';
    const tasks = milestone.tasks ?? [];

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Milestone Reviews', href: '/mentor/capstone-reviews' },
        { title: milestone.title, href: route('mentor.capstone-reviews.show', milestone.id) },
    ];

    const form = useValidatedForm({
        status: 'approved' as 'approved' | 'rejected',
        mentor_feedback: '',
        mentor_score: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        form.patch(route('mentor.capstone-reviews.update', milestone.id), {
            mentor_feedback: form.data.mentor_feedback || null,
            mentor_score: form.data.mentor_score ? Number(form.data.mentor_score) : null,
            successToast: {
                title: 'Sign-off recorded',
                message: 'The intern will see your feedback on their capstone overview.',
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Review — ${milestone.title}`} />

            <Link href={route('mentor.capstone-reviews.index')} className="text-xs font-medium text-violet-600 dark:text-violet-400">
                ← Back to queue
            </Link>

            <header className="mt-3 flex flex-wrap items-start justify-between gap-3 rounded-xl border border-zinc-950/10 bg-white p-4 dark:border-white/10 dark:bg-zinc-900">
                <div>
                    <p className="text-[10px] font-semibold tracking-wide text-violet-600 uppercase">Milestone sign-off</p>
                    <h1 className="mt-1 text-lg font-semibold text-zinc-950 dark:text-white">{milestone.title}</h1>
                    <p className="mt-1 text-xs text-zinc-500">
                        {internName} · {milestone.project?.title}
                    </p>
                    {milestone.submitted_at && (
                        <p className="mt-1 text-[11px] text-zinc-400">Submitted {new Date(milestone.submitted_at).toLocaleString()}</p>
                    )}
                </div>
                <Badge color={MILESTONE_STATUS_COLOR[milestone.status]}>{MILESTONE_STATUS_LABEL[milestone.status]}</Badge>
            </header>

            <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
                <div className="space-y-4">
                    <section className="rounded-xl border border-zinc-950/10 bg-white p-5 dark:border-white/10 dark:bg-zinc-900">
                        <h2 className="text-sm font-semibold text-zinc-950 dark:text-white">Acceptance criteria</h2>
                        <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                            {milestone.description ?? 'No description provided for this milestone.'}
                        </p>
                    </section>

                    {tasks.length > 0 && (
                        <section className="rounded-xl border border-zinc-950/10 bg-white dark:border-white/10 dark:bg-zinc-900">
                            <div className="border-b border-zinc-950/5 px-4 py-3 dark:border-white/5">
                                <h2 className="text-sm font-semibold text-zinc-950 dark:text-white">Related board tasks</h2>
                                <p className="text-xs text-zinc-500">Snapshot of tasks linked to this milestone</p>
                            </div>
                            <ul className="divide-y divide-zinc-950/5 dark:divide-white/5">
                                {tasks.map((task) => (
                                    <li key={task.id} className="flex items-center justify-between gap-3 px-4 py-2.5 text-xs">
                                        <span className="text-zinc-700 dark:text-zinc-300">{task.title}</span>
                                        <span className="font-medium capitalize text-zinc-500">{task.status.replace('_', ' ')}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    <section className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50/50 p-4 dark:border-zinc-600 dark:bg-zinc-900/50">
                        <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Review checklist</p>
                        <ul className="mt-2 space-y-1.5 text-xs text-zinc-500">
                            <li className="flex items-center gap-2">
                                <CheckCircleIcon className="size-3.5 text-lime-500" />
                                Deliverable matches acceptance criteria
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircleIcon className="size-3.5 text-lime-500" />
                                Quality is production-ready or clearly documented
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircleIcon className="size-3.5 text-lime-500" />
                                Intern can articulate decisions in journal or demo
                            </li>
                        </ul>
                    </section>
                </div>

                <MentorDecisionForm
                    title="Sign-off decision"
                    subtitle="Approving unlocks the next milestone. Rejecting returns it to the intern with your notes."
                    decision={form.data.status}
                    onDecisionChange={(value) => form.setData('status', value)}
                    approveLabel="Approve milestone"
                    rejectLabel="Request revision"
                    score={form.data.mentor_score}
                    onScoreChange={(value) => form.setData('mentor_score', value)}
                    scoreError={form.errors.mentor_score}
                    feedback={form.data.mentor_feedback}
                    onFeedbackChange={(value) => form.setData('mentor_feedback', value)}
                    feedbackError={form.errors.mentor_feedback}
                    feedbackPlaceholder="What was done well? What must change before approval?"
                    processing={form.processing}
                    onSubmit={submit}
                />
            </div>
        </AppLayout>
    );
}
