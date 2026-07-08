import { Heading } from '@/components/catalyst/heading';
import { Text } from '@/components/catalyst/text';
import { accent, surfaces } from '@/lib/theme';
import { formatDisplayName } from '@/lib/user-profile';
import clsx from 'clsx';
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
        <section className={clsx('relative overflow-hidden p-6 sm:p-8', surfaces.hero)}>
            <div
                className="pointer-events-none absolute -top-20 -right-20 size-56 rounded-full bg-brand-400/10 blur-3xl dark:bg-brand-500/10"
                aria-hidden
            />
            <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className={clsx('text-sm font-medium', accent.textSoft)}>
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
