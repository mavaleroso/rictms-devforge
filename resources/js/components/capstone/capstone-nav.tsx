import { Link } from '@inertiajs/react';
import clsx from 'clsx';

const tabs = [
    { key: 'overview', label: 'Overview', href: () => route('learn.capstone.show') },
    { key: 'board', label: 'Task board', href: () => route('learn.capstone.board') },
    { key: 'journal', label: 'Journal', href: () => route('learn.capstone.journal') },
] as const;

export function CapstoneNav({ current }: { current: (typeof tabs)[number]['key'] }) {
    return (
        <nav className="flex gap-1 rounded-lg border border-zinc-950/10 bg-zinc-50 p-1 dark:border-white/10 dark:bg-zinc-900/80">
            {tabs.map((tab) => (
                <Link
                    key={tab.key}
                    href={tab.href()}
                    className={clsx(
                        'rounded-md px-3 py-1.5 text-xs font-medium transition',
                        current === tab.key
                            ? 'bg-white text-zinc-950 shadow-sm dark:bg-zinc-800 dark:text-white'
                            : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200',
                    )}
                >
                    {tab.label}
                </Link>
            ))}
        </nav>
    );
}
