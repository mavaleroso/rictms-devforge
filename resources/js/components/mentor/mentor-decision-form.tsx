import { Button } from '@/components/catalyst/button';
import { FormField } from '@/components/form/form-field';
import { Input } from '@/components/catalyst/input';
import { Textarea } from '@/components/catalyst/textarea';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import type { FormEventHandler, ReactNode } from 'react';

type Decision = 'approved' | 'rejected';

interface MentorDecisionFormProps {
    title: string;
    subtitle?: string;
    decision: Decision;
    onDecisionChange: (value: Decision) => void;
    approveLabel?: string;
    rejectLabel?: string;
    score: string;
    onScoreChange: (value: string) => void;
    scoreError?: string;
    feedback: string;
    onFeedbackChange: (value: string) => void;
    feedbackError?: string;
    feedbackPlaceholder?: string;
    processing?: boolean;
    onSubmit: FormEventHandler;
    children?: ReactNode;
}

export function MentorDecisionForm({
    title,
    subtitle,
    decision,
    onDecisionChange,
    approveLabel = 'Approve',
    rejectLabel = 'Request changes',
    score,
    onScoreChange,
    scoreError,
    feedback,
    onFeedbackChange,
    feedbackError,
    feedbackPlaceholder = 'Share specific, actionable feedback the intern can act on…',
    processing,
    onSubmit,
    children,
}: MentorDecisionFormProps) {
    return (
        <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-zinc-950/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-900">
            <div>
                <h2 className="text-sm font-semibold text-zinc-950 dark:text-white">{title}</h2>
                {subtitle && <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{subtitle}</p>}
            </div>

            {children}

            <div className="grid grid-cols-2 gap-2">
                <button
                    type="button"
                    onClick={() => onDecisionChange('approved')}
                    className={clsx(
                        'flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-xs font-semibold transition',
                        decision === 'approved'
                            ? 'border-lime-500/40 bg-lime-50 text-lime-800 ring-1 ring-lime-500/30 dark:bg-lime-950/40 dark:text-lime-300'
                            : 'border-zinc-950/10 text-zinc-600 hover:bg-zinc-50 dark:border-white/10 dark:text-zinc-400 dark:hover:bg-zinc-800',
                    )}
                >
                    <CheckCircleIcon className="size-4" />
                    {approveLabel}
                </button>
                <button
                    type="button"
                    onClick={() => onDecisionChange('rejected')}
                    className={clsx(
                        'flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-xs font-semibold transition',
                        decision === 'rejected'
                            ? 'border-red-500/40 bg-red-50 text-red-800 ring-1 ring-red-500/30 dark:bg-red-950/40 dark:text-red-300'
                            : 'border-zinc-950/10 text-zinc-600 hover:bg-zinc-50 dark:border-white/10 dark:text-zinc-400 dark:hover:bg-zinc-800',
                    )}
                >
                    <XCircleIcon className="size-4" />
                    {rejectLabel}
                </button>
            </div>

            <FormField label="Quality score (0–100)" error={scoreError}>
                <Input type="number" min={0} max={100} value={score} onChange={(e) => onScoreChange(e.target.value)} placeholder="e.g. 85" />
            </FormField>

            <FormField label="Written feedback" error={feedbackError}>
                <Textarea rows={5} value={feedback} onChange={(e) => onFeedbackChange(e.target.value)} placeholder={feedbackPlaceholder} />
            </FormField>

            <Button type="submit" disabled={processing} className="w-full sm:w-auto">
                Submit decision
            </Button>
        </form>
    );
}
