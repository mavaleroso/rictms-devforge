import {
    AcademicCapIcon,
    CheckCircleIcon,
    PlayCircleIcon,
    UserGroupIcon,
    type SVGProps,
} from '@heroicons/react/20/solid';
import type { ComponentType } from 'react';

interface EnrollmentIndexStatsProps {
    stats: {
        total: number;
        active: number;
        completed: number;
        with_mentor: number;
    };
}

function share(value: number, total: number): string {
    if (total === 0) {
        return '—';
    }

    return `${Math.round((value / total) * 100)}% of enrollments`;
}

export function EnrollmentIndexStats({ stats }: EnrollmentIndexStatsProps) {
    const items: Array<{
        label: string;
        value: number;
        hint: string;
        icon: ComponentType<SVGProps<SVGSVGElement>>;
        accent: string;
        iconWrap: string;
        iconColor: string;
    }> = [
        {
            label: 'Total enrollments',
            value: stats.total,
            hint: 'All-time program placements',
            icon: AcademicCapIcon,
            accent: 'from-zinc-500 to-zinc-700',
            iconWrap: 'bg-zinc-100 dark:bg-zinc-800',
            iconColor: 'text-zinc-600 dark:text-zinc-300',
        },
        {
            label: 'In progress',
            value: stats.active,
            hint: share(stats.active, stats.total),
            icon: PlayCircleIcon,
            accent: 'from-blue-500 to-sky-600',
            iconWrap: 'bg-blue-500/10 dark:bg-blue-500/15',
            iconColor: 'text-blue-600 dark:text-blue-400',
        },
        {
            label: 'Completed',
            value: stats.completed,
            hint: share(stats.completed, stats.total),
            icon: CheckCircleIcon,
            accent: 'from-emerald-500 to-green-600',
            iconWrap: 'bg-emerald-500/10 dark:bg-emerald-500/15',
            iconColor: 'text-emerald-600 dark:text-emerald-400',
        },
        {
            label: 'Mentor assigned',
            value: stats.with_mentor,
            hint: share(stats.with_mentor, stats.total),
            icon: UserGroupIcon,
            accent: 'from-violet-500 to-purple-600',
            iconWrap: 'bg-violet-500/10 dark:bg-violet-500/15',
            iconColor: 'text-violet-600 dark:text-violet-400',
        },
    ];

    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {items.map((item) => (
                <div
                    key={item.label}
                    className="group relative overflow-hidden rounded-2xl border border-zinc-950/10 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-white/10 dark:bg-zinc-900"
                >
                    <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${item.accent}`} />

                    <div className="flex items-start justify-between gap-4 p-5">
                        <div className="min-w-0">
                            <p className="text-xs font-semibold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
                                {item.label}
                            </p>
                            <p className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950 tabular-nums dark:text-white">
                                {item.value}
                            </p>
                            <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">{item.hint}</p>
                        </div>

                        <span
                            className={`flex size-11 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-105 ${item.iconWrap}`}
                        >
                            <item.icon className={`size-5 ${item.iconColor}`} />
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}
