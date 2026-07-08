import clsx from 'clsx';

const toneStyles = {
    success: {
        dot: 'bg-emerald-500',
        text: 'text-emerald-700 dark:text-emerald-400',
        wrap: 'bg-emerald-500/10 ring-emerald-500/20',
    },
    warning: {
        dot: 'bg-amber-500',
        text: 'text-amber-700 dark:text-amber-400',
        wrap: 'bg-amber-500/10 ring-amber-500/20',
    },
    neutral: {
        dot: 'bg-zinc-400',
        text: 'text-zinc-600 dark:text-zinc-400',
        wrap: 'bg-zinc-500/10 ring-zinc-500/20',
    },
    info: {
        dot: 'bg-blue-500',
        text: 'text-blue-700 dark:text-blue-400',
        wrap: 'bg-blue-500/10 ring-blue-500/20',
    },
} as const;

interface DataTableStatusProps {
    label: string;
    tone?: keyof typeof toneStyles;
    compact?: boolean;
}

export function DataTableStatus({ label, tone = 'neutral', compact = true }: DataTableStatusProps) {
    const styles = toneStyles[tone];

    return (
        <span
            className={clsx(
                'inline-flex items-center gap-1.5 rounded-full ring-1 ring-inset',
                styles.wrap,
                compact ? 'px-2 py-0.5 text-[11px] font-medium' : 'px-2.5 py-1 text-xs font-medium',
                styles.text,
            )}
        >
            <span className={clsx('size-1.5 shrink-0 rounded-full', styles.dot)} aria-hidden />
            {label}
        </span>
    );
}

interface DataTableMetaTextProps {
    primary: string;
    secondary?: string | null;
    mono?: boolean;
}

export function DataTableMetaText({ primary, secondary, mono = false }: DataTableMetaTextProps) {
    return (
        <div className="min-w-0">
            <p className={clsx('truncate text-sm text-zinc-950 dark:text-zinc-100', mono && 'font-mono text-xs')}>
                {primary}
            </p>
            {secondary && <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">{secondary}</p>}
        </div>
    );
}
