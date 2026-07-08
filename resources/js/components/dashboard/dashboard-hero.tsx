import { Heading } from '@/components/catalyst/heading';
import { Text } from '@/components/catalyst/text';
import { formatDisplayName } from '@/lib/user-profile';
import type { ReactNode } from 'react';

interface DashboardHeroProps {
    displayName: string;
    role: 'admin' | 'mentor' | 'intern';
    children?: ReactNode;
}

function greeting(): string {
    const hour = new Date().getHours();

    if (hour < 12) {
        return 'Good morning';
    }

    if (hour < 17) {
        return 'Good afternoon';
    }

    return 'Good evening';
}

const roleCopy: Record<DashboardHeroProps['role'], string> = {
    admin: 'Overview of users, enrollments, and learning paths across the platform.',
    mentor: 'Monitor assigned interns and support their progress through each learning path.',
    intern: 'Continue your current path or explore new courses to grow your skills.',
};

export function DashboardHero({ displayName, role, children }: DashboardHeroProps) {
    const firstName = displayName.split(' ')[0] || displayName;

    return (
        <section className="relative overflow-hidden rounded-2xl border border-zinc-950/10 bg-gradient-to-br from-zinc-50 via-white to-violet-50/40 p-6 shadow-sm sm:p-8 dark:border-white/10 dark:from-zinc-900 dark:via-zinc-900 dark:to-violet-950/25">
            <div
                className="pointer-events-none absolute -top-20 -right-20 size-56 rounded-full bg-violet-400/10 blur-3xl dark:bg-violet-500/10"
                aria-hidden
            />
            <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-sm font-medium text-violet-600 dark:text-violet-400">
                        {greeting()}, {firstName}
                    </p>
                    <Heading className="mt-1">Dashboard</Heading>
                    <Text className="mt-2 max-w-2xl">{roleCopy[role]}</Text>
                </div>
                {children}
            </div>
        </section>
    );
}

export function resolveDisplayName(user: {
    name: string;
    first_name?: string | null;
    middle_name?: string | null;
    last_name?: string | null;
}): string {
    return formatDisplayName(user);
}
