import { Badge } from '@/components/catalyst/badge';
import { ProgressBar } from '@/components/learning/progress-bar';
import { levelStatus, progressStatusColor, progressStatusLabel } from '@/lib/learn-status';
import { formatDuration } from '@/lib/path-icons';
import type { Enrollment, Level } from '@/types/learning';
import { CheckCircleIcon, LockClosedIcon, PlayIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import { Link } from '@inertiajs/react';

interface LearnCourseSidebarProps {
    pathId: number;
    pathName: string;
    levels: Level[];
    currentLevelId: number;
    enrollment?: Enrollment | null;
}

export function LearnCourseSidebar({ pathId, pathName, levels, currentLevelId, enrollment }: LearnCourseSidebarProps) {
    const completedCount = levels.filter((l) => levelStatus(l) === 'completed').length;

    return (
        <aside className="flex flex-col overflow-hidden rounded-xl border border-zinc-950/10 bg-white dark:border-white/10 dark:bg-zinc-900 lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)]">
            <div className="border-b border-zinc-950/5 p-4 dark:border-white/5">
                <Link href={route('learn.paths.show', pathId)} className="text-xs font-medium text-violet-600 hover:text-violet-500 dark:text-violet-400">
                    ← Back to course
                </Link>
                <h2 className="mt-2 line-clamp-2 font-semibold text-zinc-950 dark:text-white">{pathName}</h2>
                {enrollment && (
                    <div className="mt-3">
                        <ProgressBar percentage={enrollment.progress_percentage} variant="accent" />
                        <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                            {completedCount} of {levels.length} levels completed
                        </p>
                    </div>
                )}
            </div>

            <nav aria-label="Course content" className="flex-1 overflow-y-auto p-2">
                <ul className="space-y-0.5">
                    {levels.map((level) => {
                        const status = levelStatus(level);
                        const locked = status === 'locked';
                        const current = level.id === currentLevelId;
                        const href = locked ? undefined : route('learn.levels.show', [pathId, level.id]);

                        return (
                            <li key={level.id}>
                                {href ? (
                                    <Link
                                        href={href}
                                        className={clsx(
                                            'flex items-start gap-3 rounded-lg px-3 py-2.5 text-sm transition',
                                            current
                                                ? 'bg-violet-50 ring-1 ring-violet-500/20 dark:bg-violet-950/40 dark:ring-violet-400/30'
                                                : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/60',
                                        )}
                                    >
                                        <LevelIcon status={status} number={level.number} />
                                        <span className="min-w-0 flex-1">
                                            <span className={clsx('font-medium', current ? 'text-violet-700 dark:text-violet-200' : 'text-zinc-950 dark:text-white')}>
                                                {level.title}
                                            </span>
                                            <span className="mt-0.5 flex items-center gap-2 text-xs text-zinc-500">
                                                {formatDuration(level.estimated_minutes)}
                                                {!current && (
                                                    <Badge color={progressStatusColor[status]} className="text-[10px]">
                                                        {progressStatusLabel[status]}
                                                    </Badge>
                                                )}
                                            </span>
                                        </span>
                                        {current && <PlayIcon className="size-4 shrink-0 text-violet-500" />}
                                    </Link>
                                ) : (
                                    <div className="flex items-start gap-3 rounded-lg px-3 py-2.5 text-sm opacity-60">
                                        <LevelIcon status={status} number={level.number} />
                                        <span className="min-w-0 flex-1">
                                            <span className="font-medium text-zinc-500">{level.title}</span>
                                            <span className="mt-0.5 block text-xs text-zinc-400">Locked</span>
                                        </span>
                                        <LockClosedIcon className="size-4 shrink-0 text-zinc-400" />
                                    </div>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </aside>
    );
}

function LevelIcon({ status, number }: { status: ReturnType<typeof levelStatus>; number: number }) {
    if (status === 'completed') {
        return (
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                <CheckCircleIcon className="size-4" />
            </span>
        );
    }

    if (status === 'locked') {
        return (
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-semibold text-zinc-400 dark:bg-zinc-800">
                {number}
            </span>
        );
    }

    return (
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-violet-500/15 text-xs font-semibold text-violet-700 dark:text-violet-300">
            {number}
        </span>
    );
}
