import { Badge } from '@/components/catalyst/badge';
import { Button } from '@/components/catalyst/button';
import { MILESTONE_STATUS_COLOR, MILESTONE_STATUS_LABEL } from '@/lib/capstone-labels';
import type { CapstoneMilestone } from '@/types/capstone';
import { CheckCircleIcon, ClockIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import { router } from '@inertiajs/react';

interface MilestoneTrackerProps {
    milestones: CapstoneMilestone[];
}

export function MilestoneTracker({ milestones }: MilestoneTrackerProps) {
    return (
        <ol className="space-y-2">
            {milestones.map((milestone, index) => {
                const canSubmit = milestone.status === 'in_progress' || milestone.status === 'rejected';

                return (
                    <li
                        key={milestone.id}
                        className={clsx(
                            'rounded-xl border px-4 py-3',
                            milestone.status === 'approved'
                                ? 'border-lime-200/80 bg-lime-50/50 dark:border-lime-500/20 dark:bg-lime-950/20'
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
                                    <p className="text-sm font-semibold text-zinc-950 dark:text-white">{milestone.title}</p>
                                    {milestone.description && (
                                        <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">{milestone.description}</p>
                                    )}
                                    {milestone.mentor_feedback && (
                                        <p className="mt-2 rounded-lg bg-zinc-50 px-2.5 py-2 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                                            Mentor: {milestone.mentor_feedback}
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
                                        onClick={() =>
                                            router.post(route('learn.capstone.milestones.submit', milestone.id), {}, { preserveScroll: true })
                                        }
                                    >
                                        Submit
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
    );
}
