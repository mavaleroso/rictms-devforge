import { Badge } from '@/components/catalyst/badge';
import { MentorDecisionForm } from '@/components/mentor/mentor-decision-form';
import { ProgressBar } from '@/components/learning/progress-bar';
import { MILESTONE_STATUS_COLOR, MILESTONE_STATUS_LABEL, MOOD_LABEL } from '@/lib/capstone-labels';
import type { CapstoneMilestone, CapstoneMilestoneAttachment, CapstoneTask, JournalEntry } from '@/types/capstone';
import AppLayout from '@/layouts/app-layout';
import { useValidatedForm } from '@/hooks/use-validated-form';
import { type BreadcrumbItem } from '@/types';
import { CheckCircleIcon } from '@heroicons/react/20/solid';
import { Head, Link } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface Props {
    milestone: { data: CapstoneMilestone };
    journals: { data: JournalEntry[] };
    project_progress: { approved: number; total: number; percent: number };
}

function listTasks(milestone: CapstoneMilestone): CapstoneTask[] {
    if (!milestone.tasks) return [];
    return Array.isArray(milestone.tasks) ? milestone.tasks : milestone.tasks.data;
}

function listAttachments(milestone: CapstoneMilestone): CapstoneMilestoneAttachment[] {
    if (!milestone.attachments) return [];
    return Array.isArray(milestone.attachments) ? milestone.attachments : milestone.attachments.data;
}

export default function MentorCapstoneReviewsShow({ milestone: milestoneProp, journals: journalsProp, project_progress }: Props) {
    const milestone = milestoneProp.data;
    const journals = journalsProp.data;
    const internName = milestone.project?.enrollment?.user?.name ?? 'Intern';
    const tasks = listTasks(milestone);
    const attachments = listAttachments(milestone);

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
                message: 'The intern will be notified with your feedback.',
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Review — ${milestone.title}`} />

            <Link href={route('mentor.capstone-reviews.index')} className="text-xs font-medium text-brand-600 dark:text-brand-400">
                ← Back to queue
            </Link>

            <header className="mt-3 flex flex-wrap items-start justify-between gap-3 rounded-xl border border-zinc-950/10 bg-white p-4 dark:border-white/10 dark:bg-zinc-900">
                <div>
                    <p className="text-[10px] font-semibold tracking-wide text-brand-600 uppercase">
                        {milestone.is_final_showcase ? 'Final showcase' : 'Milestone sign-off'}
                    </p>
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

            <div className="mt-4 rounded-xl border border-zinc-950/10 bg-white p-4 dark:border-white/10 dark:bg-zinc-900">
                <div className="mb-2 flex justify-between text-xs text-zinc-500">
                    <span>Project progress</span>
                    <span>
                        {project_progress.approved}/{project_progress.total} milestones approved
                    </span>
                </div>
                <ProgressBar percentage={project_progress.percent} variant="accent" />
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
                <div className="space-y-4">
                    <section className="rounded-xl border border-zinc-950/10 bg-white p-5 dark:border-white/10 dark:bg-zinc-900">
                        <h2 className="text-sm font-semibold text-zinc-950 dark:text-white">Acceptance criteria</h2>
                        <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                            {milestone.description ?? 'No description provided for this milestone.'}
                        </p>
                    </section>

                    <section className="rounded-xl border border-zinc-950/10 bg-white p-5 dark:border-white/10 dark:bg-zinc-900">
                        <h2 className="text-sm font-semibold text-zinc-950 dark:text-white">Deliverables</h2>
                        <dl className="mt-3 space-y-2 text-sm">
                            {milestone.submission_notes && (
                                <div>
                                    <dt className="text-xs font-medium text-zinc-500">Notes</dt>
                                    <dd className="whitespace-pre-wrap text-zinc-700 dark:text-zinc-300">{milestone.submission_notes}</dd>
                                </div>
                            )}
                            {milestone.resubmission_notes && (
                                <div>
                                    <dt className="text-xs font-medium text-zinc-500">Resubmission notes</dt>
                                    <dd className="whitespace-pre-wrap text-zinc-700 dark:text-zinc-300">{milestone.resubmission_notes}</dd>
                                </div>
                            )}
                            {milestone.deliverable_url && (
                                <div>
                                    <dt className="text-xs font-medium text-zinc-500">Deliverable</dt>
                                    <dd>
                                        <a href={milestone.deliverable_url} target="_blank" rel="noreferrer" className="text-brand-600 break-all">
                                            {milestone.deliverable_url}
                                        </a>
                                    </dd>
                                </div>
                            )}
                            {milestone.repo_url && (
                                <div>
                                    <dt className="text-xs font-medium text-zinc-500">Repository</dt>
                                    <dd>
                                        <a href={milestone.repo_url} target="_blank" rel="noreferrer" className="text-brand-600 break-all">
                                            {milestone.repo_url}
                                        </a>
                                    </dd>
                                </div>
                            )}
                            {milestone.demo_url && (
                                <div>
                                    <dt className="text-xs font-medium text-zinc-500">Demo</dt>
                                    <dd>
                                        <a href={milestone.demo_url} target="_blank" rel="noreferrer" className="text-brand-600 break-all">
                                            {milestone.demo_url}
                                        </a>
                                    </dd>
                                </div>
                            )}
                            {!milestone.submission_notes && !milestone.deliverable_url && !milestone.repo_url && !milestone.demo_url && (
                                <p className="text-xs text-zinc-500">No links or notes were provided with this submission.</p>
                            )}
                        </dl>
                        {attachments.length > 0 && (
                            <ul className="mt-3 space-y-1 text-sm">
                                {attachments.map((file) => (
                                    <li key={file.id}>
                                        <a href={file.url} target="_blank" rel="noreferrer" className="text-brand-600">
                                            {file.original_name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>

                    {tasks.length > 0 && (
                        <section className="rounded-xl border border-zinc-950/10 bg-white dark:border-white/10 dark:bg-zinc-900">
                            <div className="border-b border-zinc-950/5 px-4 py-3 dark:border-white/5">
                                <h2 className="text-sm font-semibold text-zinc-950 dark:text-white">Related board tasks</h2>
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

                    <section className="rounded-xl border border-zinc-950/10 bg-white dark:border-white/10 dark:bg-zinc-900">
                        <div className="border-b border-zinc-950/5 px-4 py-3 dark:border-white/5">
                            <h2 className="text-sm font-semibold text-zinc-950 dark:text-white">Journal entries</h2>
                            <p className="text-xs text-zinc-500">Recent logs from this intern’s capstone project</p>
                        </div>
                        {journals.length === 0 ? (
                            <p className="px-4 py-6 text-xs text-zinc-500">No journal entries yet.</p>
                        ) : (
                            <ul className="divide-y divide-zinc-950/5 dark:divide-white/5">
                                {journals.map((entry) => (
                                    <li key={entry.id} className="px-4 py-3">
                                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-zinc-500">
                                            <span>{entry.entry_date}</span>
                                            {entry.mood && <Badge color="zinc">{MOOD_LABEL[entry.mood]}</Badge>}
                                            {entry.milestone && <Badge color="blue">{entry.milestone.title}</Badge>}
                                            {entry.hours_spent && <span>{entry.hours_spent}h</span>}
                                        </div>
                                        <p className="mt-1 whitespace-pre-wrap text-xs text-zinc-700 dark:text-zinc-300">{entry.content}</p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>

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
                    subtitle="Approving unlocks the next milestone. Rejecting returns it for revision with your notes."
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
