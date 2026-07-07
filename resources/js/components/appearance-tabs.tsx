import { Appearance, useAppearance } from '@/hooks/use-appearance';
import { ComputerDesktopIcon, MoonIcon, SunIcon } from '@heroicons/react/16/solid';
import clsx from 'clsx';
import { HTMLAttributes } from 'react';

export default function AppearanceToggleTab({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
    const { appearance, updateAppearance } = useAppearance();

    const tabs: { value: Appearance; icon: typeof SunIcon; label: string }[] = [
        { value: 'light', icon: SunIcon, label: 'Light' },
        { value: 'dark', icon: MoonIcon, label: 'Dark' },
        { value: 'system', icon: ComputerDesktopIcon, label: 'System' },
    ];

    return (
        <div className={clsx('inline-flex gap-1 rounded-lg bg-zinc-100 p-1 dark:bg-zinc-800', className)} {...props}>
            {tabs.map(({ value, icon: Icon, label }) => (
                <button
                    key={value}
                    type="button"
                    onClick={() => updateAppearance(value)}
                    className={clsx(
                        'flex items-center rounded-md px-3.5 py-1.5 transition-colors',
                        appearance === value
                            ? 'bg-white text-zinc-950 shadow-xs dark:bg-zinc-700 dark:text-white'
                            : 'text-zinc-500 hover:bg-zinc-200/60 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-700/60 dark:hover:text-white',
                    )}
                >
                    <Icon className="size-4" />
                    <span className="ml-1.5 text-sm">{label}</span>
                </button>
            ))}
        </div>
    );
}
