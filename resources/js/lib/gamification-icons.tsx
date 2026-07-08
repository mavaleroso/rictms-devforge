import {
    AcademicCapIcon,
    BoltIcon,
    BookOpenIcon,
    CheckBadgeIcon,
    CodeBracketSquareIcon,
    FireIcon,
    RocketLaunchIcon,
    SparklesIcon,
    StarIcon,
    TrophyIcon,
} from '@heroicons/react/20/solid';
import clsx from 'clsx';
import type { ComponentType, SVGProps } from 'react';

const iconMap: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
    'book-open': BookOpenIcon,
    'academic-cap': AcademicCapIcon,
    'code-bracket': CodeBracketSquareIcon,
    fire: FireIcon,
    bolt: BoltIcon,
    star: StarIcon,
    'check-badge': CheckBadgeIcon,
    trophy: TrophyIcon,
    sparkles: SparklesIcon,
    rocket: RocketLaunchIcon,
};

export function BadgeIcon({ icon, className }: { icon: string; className?: string }) {
    const Icon = iconMap[icon] ?? StarIcon;

    return <Icon className={className} />;
}

const tierColors: Record<string, string> = {
    zinc: 'bg-zinc-500/10 text-zinc-600 ring-zinc-500/20 dark:text-zinc-300',
    blue: 'bg-blue-500/10 text-blue-700 ring-blue-500/20 dark:text-blue-300',
    violet: 'bg-violet-500/10 text-violet-700 ring-violet-500/20 dark:text-violet-300',
    amber: 'bg-amber-500/10 text-amber-700 ring-amber-500/20 dark:text-amber-300',
    lime: 'bg-lime-500/10 text-lime-700 ring-lime-500/20 dark:text-lime-300',
};

export function tierColorClass(color: string): string {
    return tierColors[color] ?? tierColors.zinc;
}

export function rankMedalClass(rank: number): string {
    if (rank === 1) {
        return 'bg-amber-400/20 text-amber-700 ring-amber-500/30 dark:text-amber-300';
    }

    if (rank === 2) {
        return 'bg-zinc-300/30 text-zinc-700 ring-zinc-400/40 dark:text-zinc-200';
    }

    if (rank === 3) {
        return 'bg-orange-400/20 text-orange-800 ring-orange-500/30 dark:text-orange-300';
    }

    return 'bg-zinc-100 text-zinc-600 ring-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700';
}

export function initialsFromName(name: string): string {
    return name
        .split(' ')
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? '')
        .join('');
}

export function LeaderboardAvatar({
    name,
    avatarUrl,
    className,
}: {
    name: string;
    avatarUrl?: string | null;
    className?: string;
}) {
    if (avatarUrl) {
        return <img src={avatarUrl} alt="" className={clsx('rounded-full object-cover', className)} />;
    }

    return (
        <span
            className={clsx(
                'flex items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-xs font-semibold text-white',
                className,
            )}
        >
            {initialsFromName(name)}
        </span>
    );
}
