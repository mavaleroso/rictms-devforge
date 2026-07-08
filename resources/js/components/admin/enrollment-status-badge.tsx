import { type EnrollmentStatus } from '@/types/learning';
import clsx from 'clsx';

const statusConfig: Record<
    EnrollmentStatus,
    { label: string; className: string; dot: string }
> = {
    active: {
        label: 'In progress',
        className: 'bg-blue-500/10 text-blue-700 ring-blue-500/20 dark:text-blue-300',
        dot: 'bg-blue-500',
    },
    completed: {
        label: 'Completed',
        className: 'bg-emerald-500/10 text-emerald-700 ring-emerald-500/20 dark:text-emerald-300',
        dot: 'bg-emerald-500',
    },
    paused: {
        label: 'Paused',
        className: 'bg-amber-500/10 text-amber-700 ring-amber-500/20 dark:text-amber-300',
        dot: 'bg-amber-500',
    },
};

export function EnrollmentStatusBadge({ status }: { status: EnrollmentStatus | string }) {
    const config = statusConfig[status as EnrollmentStatus] ?? {
        label: status,
        className: 'bg-zinc-500/10 text-zinc-700 ring-zinc-500/20 dark:text-zinc-300',
        dot: 'bg-zinc-400',
    };

    return (
        <span
            className={clsx(
                'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset',
                config.className,
            )}
        >
            <span className={clsx('size-1.5 rounded-full', config.dot)} aria-hidden />
            {config.label}
        </span>
    );
}

interface EnrollmentProgressBarProps {
    value: number;
    className?: string;
}

export function EnrollmentProgressBar({ value, className }: EnrollmentProgressBarProps) {
    const clamped = Math.max(0, Math.min(100, value));

    return (
        <div className={clsx('min-w-[7rem]', className)}>
            <div className="flex items-center justify-between gap-2">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                    <div
                        className={clsx(
                            'h-full rounded-full transition-all',
                            clamped === 100 ? 'bg-emerald-500' : 'bg-blue-500',
                        )}
                        style={{ width: `${clamped}%` }}
                    />
                </div>
                <span className="text-xs font-medium text-zinc-600 tabular-nums dark:text-zinc-300">{clamped}%</span>
            </div>
        </div>
    );
}
