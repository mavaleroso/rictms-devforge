import {
    AcademicCapIcon,
    BookOpenIcon,
    CheckCircleIcon,
    PlayCircleIcon,
    UserGroupIcon,
    UsersIcon,
    type SVGProps,
} from '@heroicons/react/20/solid';
import type { ComponentType } from 'react';

interface DashboardAdminStatsProps {
    stats: {
        total_users: number;
        interns: number;
        mentors: number;
        admins?: number;
        active_enrollments: number;
        completed_enrollments: number;
        learning_paths: number;
    };
}

export function DashboardAdminStats({ stats }: DashboardAdminStatsProps) {
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
            label: 'Platform users',
            value: stats.total_users,
            hint: `${stats.interns} interns · ${stats.mentors} mentors`,
            icon: UsersIcon,
            accent: 'from-zinc-500 to-zinc-700',
            iconWrap: 'bg-zinc-100 dark:bg-zinc-800',
            iconColor: 'text-zinc-600 dark:text-zinc-300',
        },
        {
            label: 'Active enrollments',
            value: stats.active_enrollments,
            hint: 'Interns currently learning',
            icon: PlayCircleIcon,
            accent: 'from-blue-500 to-sky-600',
            iconWrap: 'bg-blue-500/10 dark:bg-blue-500/15',
            iconColor: 'text-blue-600 dark:text-blue-400',
        },
        {
            label: 'Completed',
            value: stats.completed_enrollments,
            hint: 'Finished learning paths',
            icon: CheckCircleIcon,
            accent: 'from-emerald-500 to-green-600',
            iconWrap: 'bg-emerald-500/10 dark:bg-emerald-500/15',
            iconColor: 'text-emerald-600 dark:text-emerald-400',
        },
        {
            label: 'Published paths',
            value: stats.learning_paths,
            hint: 'Live curricula available',
            icon: BookOpenIcon,
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

interface QuickAction {
    title: string;
    description: string;
    href: string;
    icon: ComponentType<SVGProps<SVGSVGElement>>;
    accent: string;
}

const adminActions: QuickAction[] = [
    {
        title: 'Learning paths',
        description: 'Build and publish curricula',
        href: 'admin.paths.index',
        icon: BookOpenIcon,
        accent: 'from-violet-500 to-indigo-600',
    },
    {
        title: 'Enrollments',
        description: 'Assign interns to paths',
        href: 'admin.enrollments.index',
        icon: AcademicCapIcon,
        accent: 'from-blue-500 to-cyan-600',
    },
    {
        title: 'User directory',
        description: 'Manage roles and access',
        href: 'admin.users.index',
        icon: UserGroupIcon,
        accent: 'from-zinc-600 to-zinc-800',
    },
];

export function DashboardQuickActions() {
    return (
        <div className="grid gap-4 sm:grid-cols-3">
            {adminActions.map((action) => (
                <a
                    key={action.title}
                    href={route(action.href)}
                    className="group flex items-start gap-4 rounded-2xl border border-zinc-950/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-950/15 hover:shadow-md dark:border-white/10 dark:bg-zinc-900 dark:hover:border-white/15"
                >
                    <span
                        className={`flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm ${action.accent}`}
                    >
                        <action.icon className="size-5" />
                    </span>
                    <div className="min-w-0">
                        <p className="font-semibold text-zinc-950 dark:text-white">{action.title}</p>
                        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{action.description}</p>
                    </div>
                </a>
            ))}
        </div>
    );
}
