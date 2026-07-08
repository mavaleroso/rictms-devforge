import { Badge } from '@/components/catalyst/badge';
import { progressStatusColor, progressStatusLabel } from '@/lib/learn-status';
import type { ProgressStatus } from '@/types/learning';
import { CheckCircleIcon, LockClosedIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';

export interface InternLevelRow {
    level_number: number;
    level_title: string;
    status: string;
    completed_at: string | null;
}

export function InternLevelTimeline({ levels }: { levels: InternLevelRow[] }) {
    const completed = levels.filter((l) => l.status === 'completed').length;

    return (
        <div className="rounded-xl border border-zinc-950/10 bg-white dark:border-white/10 dark:bg-zinc-900">
            <div className="flex items-center justify-between border-b border-zinc-950/5 px-4 py-3 dark:border-white/5">
                <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">Learning path progress</h3>
                <span className="text-xs text-zinc-500">
                    {completed} / {levels.length} levels
                </span>
            </div>
            <ul className="max-h-[28rem] divide-y divide-zinc-950/5 overflow-y-auto dark:divide-white/5">
                {levels.map((row) => {
                    const status = row.status as ProgressStatus;
                    const isCompleted = status === 'completed';
                    const isLocked = status === 'locked';

                    return (
                        <li key={row.level_number} className="flex items-center gap-3 px-4 py-2.5">
                            <span
                                className={clsx(
                                    'flex size-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold',
                                    isCompleted && 'bg-lime-500/15 text-lime-700 dark:text-lime-300',
                                    !isCompleted && !isLocked && 'bg-blue-500/15 text-blue-700 dark:text-blue-300',
                                    isLocked && 'bg-zinc-100 text-zinc-400 dark:bg-zinc-800',
                                )}
                            >
                                {isCompleted ? <CheckCircleIcon className="size-4" /> : isLocked ? <LockClosedIcon className="size-3.5" /> : row.level_number}
                            </span>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-zinc-950 dark:text-white">
                                    L{row.level_number} · {row.level_title}
                                </p>
                                {row.completed_at && (
                                    <p className="text-[11px] text-zinc-500">Completed {new Date(row.completed_at).toLocaleDateString()}</p>
                                )}
                            </div>
                            <Badge color={progressStatusColor[status] ?? 'zinc'}>{progressStatusLabel[status] ?? row.status}</Badge>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
