import { resolvePathIcon } from '@/lib/path-icons';
import clsx from 'clsx';
import type { SVGProps } from 'react';

interface PathIconProps extends SVGProps<SVGSVGElement> {
    icon: string | null | undefined;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const sizeClasses = {
    sm: 'size-5',
    md: 'size-6',
    lg: 'size-8',
};

export function PathIcon({ icon, size = 'md', className, ...props }: PathIconProps) {
    const Icon = resolvePathIcon(icon);

    return <Icon className={clsx(sizeClasses[size], className)} {...props} />;
}

interface PathIconBadgeProps {
    icon: string | null | undefined;
    className?: string;
}

export function PathIconBadge({ icon, className }: PathIconBadgeProps) {
    return (
        <div
            className={clsx(
                'flex size-12 shrink-0 items-center justify-center rounded-xl bg-zinc-950/5 ring-1 ring-zinc-950/10 dark:bg-white/10 dark:ring-white/10',
                className,
            )}
        >
            <PathIcon icon={icon} size="md" className="text-zinc-700 dark:text-zinc-200" />
        </div>
    );
}
