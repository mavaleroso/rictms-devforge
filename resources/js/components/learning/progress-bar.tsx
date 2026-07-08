import clsx from 'clsx';
import { accent } from '@/lib/theme';

interface ProgressBarProps {
    percentage: number;
    label?: string;
    variant?: 'default' | 'accent';
}

export function ProgressBar({ percentage, label, variant = 'default' }: ProgressBarProps) {
    const clamped = Math.min(100, Math.max(0, percentage));
    const fillClass =
        variant === 'accent'
            ? accent.progress
            : 'bg-slate-800 dark:bg-slate-200';

    return (
        <div>
            {label && (
                <div className="mb-1.5 flex justify-between text-sm">
                    <span className={variant === 'accent' ? 'text-zinc-300' : 'text-zinc-600 dark:text-zinc-400'}>{label}</span>
                    <span className={variant === 'accent' ? 'font-medium text-white' : 'text-zinc-600 dark:text-zinc-400'}>{clamped}%</span>
                </div>
            )}
            <div className={variant === 'accent' ? 'h-2 overflow-hidden rounded-full bg-white/20' : 'h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700'}>
                <div className={clsx('h-full rounded-full transition-all duration-500', fillClass)} style={{ width: `${clamped}%` }} />
            </div>
        </div>
    );
}
