import { tierColorClass } from '@/lib/gamification-icons';
import type { GamificationSummary } from '@/types/gamification';
import clsx from 'clsx';

interface XpProgressCardProps {
    summary: GamificationSummary;
    compact?: boolean;
}

export function XpProgressCard({ summary, compact = false }: XpProgressCardProps) {
    const tierClass = tierColorClass(summary.tier.color);

    return (
        <div
            className={clsx(
                'relative overflow-hidden rounded-2xl border border-zinc-950/10 bg-gradient-to-br from-zinc-900 via-zinc-900 to-brand-950 p-5 text-white shadow-lg dark:border-white/10',
                compact && 'p-4',
            )}
        >
            <div className="pointer-events-none absolute -top-10 -right-10 size-32 rounded-full bg-brand-500/20 blur-2xl" aria-hidden />
            <div className="relative flex items-start justify-between gap-4">
                <div>
                    <p className="text-[11px] font-semibold tracking-wide text-brand-300 uppercase">Your rank</p>
                    <p className={clsx('mt-1 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset', tierClass)}>
                        {summary.tier.label}
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-bold tabular-nums">{summary.total_xp.toLocaleString()}</p>
                    <p className="text-[11px] text-zinc-400">Total XP</p>
                </div>
            </div>

            <div className="relative mt-4">
                <div className="mb-1.5 flex justify-between text-[11px] text-zinc-400">
                    <span>
                        {summary.next_tier
                            ? `Progress to ${summary.next_tier.label}`
                            : 'Maximum tier reached'}
                    </span>
                    <span>{summary.tier_progress}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-brand-500 to-fuchsia-400 transition-all duration-700"
                        style={{ width: `${summary.tier_progress}%` }}
                    />
                </div>
                {summary.next_tier && (
                    <p className="mt-1.5 text-[11px] text-zinc-500">
                        {summary.xp_to_next_tier.toLocaleString()} XP to next tier
                    </p>
                )}
            </div>
        </div>
    );
}
