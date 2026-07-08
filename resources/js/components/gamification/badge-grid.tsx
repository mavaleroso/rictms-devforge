import { BadgeIcon } from '@/lib/gamification-icons';
import type { GamificationBadge, GamificationSummary } from '@/types/gamification';
import { FireIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';

interface StreakCardProps {
    summary: Pick<GamificationSummary, 'current_streak' | 'longest_streak'>;
}

export function StreakCard({ summary }: StreakCardProps) {
    const active = summary.current_streak > 0;

    return (
        <div
            className={clsx(
                'rounded-2xl border p-4',
                active
                    ? 'border-orange-200/80 bg-gradient-to-br from-orange-50 to-amber-50 dark:border-orange-500/20 dark:from-orange-950/30 dark:to-amber-950/20'
                    : 'border-zinc-950/10 bg-white dark:border-white/10 dark:bg-zinc-900',
            )}
        >
            <div className="flex items-center gap-3">
                <span
                    className={clsx(
                        'flex size-11 items-center justify-center rounded-xl',
                        active ? 'bg-orange-500/15 text-orange-600 dark:text-orange-400' : 'bg-zinc-100 text-zinc-400 dark:bg-zinc-800',
                    )}
                >
                    <FireIcon className={clsx('size-6', active && 'animate-pulse')} />
                </span>
                <div>
                    <p className="text-2xl font-bold tabular-nums text-zinc-950 dark:text-white">{summary.current_streak}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">Day streak</p>
                </div>
            </div>
            <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
                Longest: {summary.longest_streak} days · Complete a lesson daily to keep your streak alive.
            </p>
        </div>
    );
}

interface BadgeGridProps {
    badges: GamificationBadge[];
    limit?: number;
}

export function BadgeGrid({ badges, limit }: BadgeGridProps) {
    const visible = limit ? badges.slice(0, limit) : badges;

    return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {visible.map((badge) => (
                <div
                    key={badge.slug}
                    className={clsx(
                        'group relative rounded-xl border p-3 transition',
                        badge.earned
                            ? 'border-brand-200/80 bg-brand-50/50 dark:border-brand-500/25 dark:bg-brand-950/20'
                            : 'border-zinc-950/5 bg-zinc-50/50 opacity-60 grayscale dark:border-white/5 dark:bg-zinc-900/50',
                    )}
                    title={badge.description}
                >
                    <span
                        className={clsx(
                            'flex size-10 items-center justify-center rounded-lg',
                            badge.earned
                                ? 'bg-brand-500/15 text-brand-600 dark:text-brand-400'
                                : 'bg-zinc-200/80 text-zinc-400 dark:bg-zinc-800',
                        )}
                    >
                        <BadgeIcon icon={badge.icon} className="size-5" />
                    </span>
                    <p className="mt-2 text-xs font-semibold text-zinc-950 dark:text-white">{badge.name}</p>
                    <p className="mt-0.5 line-clamp-2 text-[11px] leading-4 text-zinc-500 dark:text-zinc-400">
                        {badge.description}
                    </p>
                    {badge.xp_bonus > 0 && (
                        <p className="mt-1.5 text-[10px] font-medium text-brand-600 dark:text-brand-400">
                            +{badge.xp_bonus} XP bonus
                        </p>
                    )}
                </div>
            ))}
        </div>
    );
}
