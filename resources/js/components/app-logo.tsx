import AppLogoIcon from './app-logo-icon';
import clsx from 'clsx';

interface AppLogoProps {
    variant?: 'default' | 'onDark';
}

export default function AppLogo({ variant = 'default' }: AppLogoProps) {
    const onDark = variant === 'onDark';

    return (
        <span className="flex min-w-0 items-center gap-3">
            <span
                className={clsx(
                    'flex size-8 items-center justify-center rounded-md shadow-sm',
                    onDark ? 'bg-white/10 ring-1 ring-white/15' : 'bg-brand-800',
                )}
            >
                <AppLogoIcon className="size-5 fill-white" />
            </span>
            <span
                className={clsx(
                    'truncate text-[15px] font-semibold tracking-tight',
                    onDark ? 'text-white' : 'text-slate-900 dark:text-white',
                )}
            >
                DevForge
            </span>
        </span>
    );
}
