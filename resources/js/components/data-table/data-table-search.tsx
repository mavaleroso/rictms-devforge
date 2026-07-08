import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';

interface DataTableSearchProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    isLoading?: boolean;
    className?: string;
    compact?: boolean;
}

export function DataTableSearch({
    value,
    onChange,
    placeholder = 'Search...',
    isLoading = false,
    className,
    compact = true,
}: DataTableSearchProps) {
    return (
        <div className={clsx('relative w-full', className)}>
            <div
                className={clsx(
                    'pointer-events-none absolute inset-y-0 left-0 flex items-center',
                    compact ? 'pl-2.5' : 'pl-3',
                )}
            >
                <MagnifyingGlassIcon
                    className={clsx(
                        'transition-colors',
                        compact ? 'size-3.5' : 'size-4',
                        isLoading ? 'text-zinc-400' : 'text-zinc-500 dark:text-zinc-400',
                    )}
                    aria-hidden
                />
            </div>

            <input
                type="search"
                value={value}
                placeholder={placeholder}
                onChange={(event) => onChange(event.target.value)}
                className={clsx(
                    'block w-full rounded-lg border transition-[border-color,box-shadow,background-color]',
                    'border-zinc-950/10 bg-zinc-50 text-zinc-950 placeholder:text-zinc-400',
                    'hover:border-zinc-950/15 hover:bg-white',
                    'focus:border-zinc-950/20 focus:bg-white focus:ring-2 focus:ring-zinc-950/5 focus:outline-none',
                    'dark:border-white/10 dark:bg-zinc-800/50 dark:text-white dark:placeholder:text-zinc-500',
                    'dark:hover:border-white/15 dark:hover:bg-zinc-800',
                    'dark:focus:border-white/20 dark:focus:bg-zinc-800 dark:focus:ring-white/10',
                    compact ? 'py-1.5 pr-8 pl-8 text-xs' : 'py-2 pr-9 pl-9 text-sm',
                )}
            />

            {value && (
                <button
                    type="button"
                    onClick={() => onChange('')}
                    className={clsx(
                        'absolute inset-y-0 right-0 flex items-center',
                        compact ? 'pr-1.5' : 'pr-2.5',
                        'rounded-r-lg text-zinc-400 transition-colors hover:text-zinc-600',
                        'dark:hover:text-zinc-200',
                    )}
                    aria-label="Clear search"
                >
                    <span
                        className={clsx(
                            'flex items-center justify-center rounded-md hover:bg-zinc-950/5 dark:hover:bg-white/10',
                            compact ? 'size-5' : 'size-6',
                        )}
                    >
                        <XMarkIcon className={compact ? 'size-3.5' : 'size-4'} />
                    </span>
                </button>
            )}
        </div>
    );
}
