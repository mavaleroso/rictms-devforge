import { LeaderboardAvatar, rankMedalClass } from '@/lib/gamification-icons';
import type { LeaderboardEntry } from '@/types/gamification';
import { FireIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';

interface LeaderboardTableProps {
    entries: LeaderboardEntry[];
    xpLabel?: string;
    highlightUserId?: number;
    emptyMessage?: string;
}

export function LeaderboardTable({
    entries,
    xpLabel = 'XP',
    highlightUserId,
    emptyMessage = 'No rankings yet. Complete lessons to appear on the board.',
}: LeaderboardTableProps) {
    if (entries.length === 0) {
        return (
            <div className="rounded-xl border border-dashed border-zinc-300 px-6 py-10 text-center dark:border-zinc-600">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <ul className="divide-y divide-zinc-950/5 overflow-hidden rounded-xl border border-zinc-950/10 bg-white dark:divide-white/5 dark:border-white/10 dark:bg-zinc-900">
            {entries.map((entry) => {
                const isViewer = highlightUserId === entry.user_id;

                return (
                    <li
                        key={entry.user_id}
                        className={clsx(
                            'flex items-center gap-3 px-4 py-3',
                            isViewer && 'bg-violet-50/80 dark:bg-violet-950/25',
                        )}
                    >
                        <span
                            className={clsx(
                                'flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ring-1 ring-inset',
                                rankMedalClass(entry.rank),
                            )}
                        >
                            {entry.rank}
                        </span>
                        <LeaderboardAvatar name={entry.name} avatarUrl={entry.avatar_url} className="size-9 shrink-0" />
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-zinc-950 dark:text-white">
                                {entry.name}
                                {isViewer && (
                                    <span className="ml-2 text-[10px] font-medium text-violet-600 dark:text-violet-400">
                                        You
                                    </span>
                                )}
                            </p>
                            {entry.current_streak > 0 && (
                                <p className="mt-0.5 flex items-center gap-1 text-[11px] text-orange-600 dark:text-orange-400">
                                    <FireIcon className="size-3" />
                                    {entry.current_streak} day streak
                                </p>
                            )}
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-bold tabular-nums text-zinc-950 dark:text-white">
                                {entry.xp.toLocaleString()}
                            </p>
                            <p className="text-[10px] text-zinc-500 uppercase">{xpLabel}</p>
                        </div>
                    </li>
                );
            })}
        </ul>
    );
}
