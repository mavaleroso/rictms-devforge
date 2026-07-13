import { Badge } from '@/components/catalyst/badge';
import { Button } from '@/components/catalyst/button';
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '@/components/catalyst/dialog';
import { FormField } from '@/components/form/form-field';
import { Input } from '@/components/catalyst/input';
import { Textarea } from '@/components/catalyst/textarea';
import { useValidatedForm } from '@/hooks/use-validated-form';
import { MILESTONE_STATUS_COLOR, MILESTONE_STATUS_LABEL } from '@/lib/capstone-labels';
import type { CapstoneMilestone } from '@/types/capstone';
import { CheckCircleIcon, ClockIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import { FormEventHandler, useState } from 'react';

interface MilestoneTrackerProps {
    milestones: CapstoneMilestone[];
    hasMentor?: boolean;
    projectActive?: boolean;
}

function attachmentsOf(milestone: CapstoneMilestone) {
    if (!milestone.attachments) {
        return [];
    }

    return Array.isArray(milestone.attachments) ? milestone.attachments : milestone.attachments.data;
}

export function MilestoneTracker({ milestones, hasMentor = true, projectActive = true }: MilestoneTrackerProps) {
    const [openId, setOpenId] = useState<number | null>(null);
    const active = milestones.find((m) => m.id === openId) ?? null;

    const form = useValidatedForm({
        submission_notes: '',
        resubmission_notes: '',
        deliverable_url: '',
        repo_url: '',
        demo_url: '',
        attachments: [] as File[],
    });

    const openSubmit = (milestone: CapstoneMilestone) => {
        form.setData({
            submission_notes: milestone.submission_notes ?? '',
            resubmission_notes: '',
            deliverable_url: milestone.deliverable_url ?? '',
            repo_url: milestone.repo_url ?? '',
            demo_url: milestone.demo_url ?? '',
            attachments: [],
        });
        setOpenId(milestone.id);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (!active) {
            return;
        }

        form.post(route('learn.capstone.milestones.submit', active.id), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => setOpenId(null),
            successToast: {
                title: 'Milestone submitted',
                message: active.requires_mentor_signoff === false
                    ? 'This checkpoint was auto-approved.'
                    : 'Your mentor will review your deliverables.',
            },
        });
    };

    return (
        <>
            <ol className="space-y-2">
                {milestones.map((milestone, index) => {
                    const canSubmit =
                        projectActive &&
                        (milestone.status === 'in_progress' || milestone.status === 'rejected');
                    const blockedByMentor = canSubmit && milestone.requires_mentor_signoff !== false && !hasMentor;

                    return (
                        <li
                            key={milestone.id}
                            className={clsx(
                                'rounded-xl border px-4 py-3',
                                milestone.status === 'approved'
                                    ? 'border-lime-200/80 bg-lime-50/50 dark:border-lime-500/20 dark:bg-lime-950/20'
                                    : milestone.status === 'rejected'
                                      ? 'border-red-200/80 bg-red-50/40 dark:border-red-500/20 dark:bg-red-950/20'
                                      : 'border-zinc-950/10 bg-white dark:border-white/10 dark:bg-zinc-900',
                            )}
                        >
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <div className="flex min-w-0 items-start gap-3">
                                    <span
                                        className={clsx(
                                            'mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                                            milestone.status === 'approved'
                                                ? 'bg-lime-500/15 text-lime-700 dark:text-lime-300'
                                                : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300',
                                        )}
                                    >
                                        {milestone.status === 'approved' ? (
                                            <CheckCircleIcon className="size-4" />
                                        ) : (
                                            index + 1
                                        )}
                                    </span>
                                    <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <p className="text-sm font-semibold text-zinc-950 dark:text-white">{milestone.title}</p>
                                            {milestone.is_final_showcase && <Badge color="violet">Final showcase</Badge>}
                                            {milestone.requires_mentor_signoff === false && <Badge color="zinc">Self-check</Badge>}
                                        </div>
                                        {milestone.description && (
                                            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">{milestone.description}</p>
                                        )}
                                        {milestone.mentor_feedback && (
                                            <p className="mt-2 rounded-lg bg-zinc-50 px-2.5 py-2 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                                                Mentor: {milestone.mentor_feedback}
                                                {milestone.mentor_score != null ? ` · Score ${milestone.mentor_score}` : ''}
                                            </p>
                                        )}
                                        {blockedByMentor && (
                                            <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
                                                A mentor must be assigned before you can submit this milestone.
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge color={MILESTONE_STATUS_COLOR[milestone.status]}>
                                        {MILESTONE_STATUS_LABEL[milestone.status]}
                                    </Badge>
                                    {canSubmit && (
                                        <Button
                                            className="!px-2.5 !py-1 !text-xs"
                                            disabled={blockedByMentor}
                                            onClick={() => openSubmit(milestone)}
                                        >
                                            {milestone.status === 'rejected' ? 'Resubmit' : 'Submit'}
                                        </Button>
                                    )}
                                    {milestone.status === 'submitted' && (
                                        <span className="flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400">
                                            <ClockIcon className="size-3.5" />
                                            Pending mentor
                                        </span>
                                    )}
                                </div>
                            </div>
                        </li>
                    );
                })}
            </ol>

            <Dialog open={openId !== null} onClose={() => setOpenId(null)} size="xl">
                <DialogTitle>{active?.is_final_showcase ? 'Submit final showcase' : 'Submit milestone'}</DialogTitle>
                <DialogDescription>
                    Attach evidence for your mentor — links, notes, and optional files.
                </DialogDescription>
                <DialogBody>
                    <form id="milestone-submit-form" onSubmit={submit} className="space-y-3">
                        <FormField label="Submission notes" error={form.errors.submission_notes}>
                            <Textarea
                                rows={3}
                                value={form.data.submission_notes}
                                onChange={(e) => form.setData('submission_notes', e.target.value)}
                                placeholder="What did you deliver and how should your mentor review it?"
                            />
                        </FormField>
                        {active?.status === 'rejected' && (
                            <FormField label="What changed since last review?" error={form.errors.resubmission_notes}>
                                <Textarea
                                    rows={2}
                                    value={form.data.resubmission_notes}
                                    onChange={(e) => form.setData('resubmission_notes', e.target.value)}
                                />
                            </FormField>
                        )}
                        <div className="grid gap-3 sm:grid-cols-2">
                            <FormField label="Deliverable URL" error={form.errors.deliverable_url}>
                                <Input
                                    value={form.data.deliverable_url}
                                    onChange={(e) => form.setData('deliverable_url', e.target.value)}
                                    placeholder="https://..."
                                />
                            </FormField>
                            <FormField label="Repo URL" error={form.errors.repo_url}>
                                <Input
                                    value={form.data.repo_url}
                                    onChange={(e) => form.setData('repo_url', e.target.value)}
                                    placeholder="https://github.com/..."
                                />
                            </FormField>
                        </div>
                        <FormField
                            label={active?.is_final_showcase ? 'Demo URL (required for showcase)' : 'Demo URL'}
                            error={form.errors.demo_url}
                        >
                            <Input
                                value={form.data.demo_url}
                                onChange={(e) => form.setData('demo_url', e.target.value)}
                                placeholder="https://loom.com/... or staging URL"
                            />
                        </FormField>
                        <FormField label="Attachments (optional, max 5)" error={form.errors.attachments}>
                            <Input
                                type="file"
                                multiple
                                onChange={(e) => form.setData('attachments', Array.from(e.target.files ?? []))}
                            />
                        </FormField>
                        {active && attachmentsOf(active).length > 0 && (
                            <ul className="text-xs text-zinc-500">
                                {attachmentsOf(active).map((file) => (
                                    <li key={file.id}>
                                        <a href={file.url} target="_blank" rel="noreferrer" className="text-brand-600">
                                            {file.original_name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </form>
                </DialogBody>
                <DialogActions>
                    <Button outline onClick={() => setOpenId(null)}>
                        Cancel
                    </Button>
                    <Button type="submit" form="milestone-submit-form" disabled={form.processing}>
                        Submit for review
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
