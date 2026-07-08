import clsx from 'clsx';
import type { ComponentType, ReactNode, SVGProps } from 'react';

interface StatPill {
    label: string;
    value: string | number;
    accent?: 'default' | 'amber' | 'violet' | 'blue' | 'lime';
}

interface MentorPageHeroProps {
    icon: ComponentType<SVGProps<SVGSVGElement>>;
    iconClassName?: string;
    title: string;
    description: string;
    stats?: StatPill[];
    children?: ReactNode;
}

const accentMap = {
    default: 'border-zinc-950/10 bg-white dark:border-white/10 dark:bg-zinc-900',
    amber: 'border-amber-200/80 bg-amber-50/80 dark:border-amber-500/20 dark:bg-amber-950/30',
    violet: 'border-brand-200/80 bg-brand-50/80 dark:border-brand-500/20 dark:bg-brand-950/30',
    blue: 'border-blue-200/80 bg-blue-50/80 dark:border-blue-500/20 dark:bg-blue-950/30',
    lime: 'border-lime-200/80 bg-lime-50/80 dark:border-lime-500/20 dark:bg-lime-950/30',
};

export function MentorPageHero({ icon: Icon, iconClassName, title, description, stats, children }: MentorPageHeroProps) {
    return (
        <section className="relative overflow-hidden rounded-2xl border border-zinc-950/10 bg-gradient-to-br from-zinc-50 via-white to-blue-50/40 p-5 dark:border-white/10 dark:from-zinc-900 dark:via-zinc-900 dark:to-blue-950/20 sm:p-6">
            <div className="pointer-events-none absolute -top-16 -right-16 size-40 rounded-full bg-blue-400/10 blur-3xl" aria-hidden />
            <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex items-start gap-3">
                    <span className={clsx('flex size-11 shrink-0 items-center justify-center rounded-xl text-white shadow-sm', iconClassName ?? 'bg-blue-600')}>
                        <Icon className="size-5" />
                    </span>
                    <div>
                        <h1 className="text-lg font-semibold text-zinc-950 dark:text-white">{title}</h1>
                        <p className="mt-1 max-w-2xl text-sm text-zinc-500 dark:text-zinc-400">{description}</p>
                    </div>
                </div>
                {children}
            </div>
            {stats && stats.length > 0 && (
                <div className="relative mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            className={clsx('rounded-xl border px-3 py-2.5', accentMap[stat.accent ?? 'default'])}
                        >
                            <p className="text-[10px] font-semibold tracking-wide text-zinc-500 uppercase">{stat.label}</p>
                            <p className="mt-0.5 text-xl font-bold tabular-nums text-zinc-950 dark:text-white">{stat.value}</p>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
