import { useAppearance } from '@/hooks/use-appearance';
import { MoonIcon, SunIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import { useEffect, useState } from 'react';

function resolveIsDark(appearance: string): boolean {
    if (appearance === 'dark') {
        return true;
    }

    if (appearance === 'light') {
        return false;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function ThemeToggleButton({ className }: { className?: string }) {
    const { appearance, updateAppearance } = useAppearance();
    const [isDark, setIsDark] = useState(() => resolveIsDark(appearance));

    useEffect(() => {
        setIsDark(resolveIsDark(appearance));

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const syncTheme = () => setIsDark(resolveIsDark(appearance));

        mediaQuery.addEventListener('change', syncTheme);

        return () => mediaQuery.removeEventListener('change', syncTheme);
    }, [appearance]);

    const toggle = () => {
        updateAppearance(isDark ? 'light' : 'dark');
        setIsDark(!isDark);
    };

    return (
        <button
            type="button"
            onClick={toggle}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className={clsx(
                'inline-flex size-9 items-center justify-center rounded-lg border border-slate-200/80 bg-white/80 text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white',
                className,
            )}
        >
            {isDark ? <SunIcon className="size-5" /> : <MoonIcon className="size-5" />}
        </button>
    );
}
