import { PathIconBadge } from '@/components/admin/path-icon';
import { Badge } from '@/components/catalyst/badge';
import { formatDuration } from '@/lib/path-icons';
import type { LearningPath } from '@/types/learning';
import { AcademicCapIcon, ClockIcon } from '@heroicons/react/20/solid';
import { Link } from '@inertiajs/react';
import clsx from 'clsx';

interface LearnPathCardProps {
    path: LearningPath;
    enrolled?: boolean;
}

export function LearnPathCard({ path, enrolled }: LearnPathCardProps) {
    const levels = path.levels_count ?? path.levels?.length ?? 0;
    const duration = path.total_estimated_minutes ?? 0;

    return (
        <Link
            href={route('learn.paths.show', path.id)}
            className={clsx(
                'group flex h-full flex-col overflow-hidden rounded-xl border border-zinc-950/10 bg-white transition',
                'hover:-translate-y-0.5 hover:border-violet-500/30 hover:shadow-lg hover:shadow-violet-500/5',
                'dark:border-white/10 dark:bg-zinc-900 dark:hover:border-violet-400/30',
            )}
        >
            <div className="relative aspect-video overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                {path.cover_image_url ? (
                    <img
                        src={path.cover_image_url}
                        alt=""
                        className="size-full object-cover transition duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex size-full items-center justify-center">
                        <PathIconBadge icon={path.icon} className="size-16" />
                    </div>
                )}
                {enrolled && (
                    <Badge color="purple" className="absolute top-3 left-3 shadow-sm">
                        Enrolled
                    </Badge>
                )}
            </div>
            <div className="flex flex-1 flex-col p-4">
                <h3 className="line-clamp-2 font-semibold text-zinc-950 group-hover:text-violet-700 dark:text-white dark:group-hover:text-violet-300">
                    {path.name}
                </h3>
                <p className="mt-2 line-clamp-2 flex-1 text-sm text-zinc-500 dark:text-zinc-400">
                    {path.description ?? 'Structured lessons, videos, and quizzes to build real skills.'}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
                    <span className="inline-flex items-center gap-1">
                        <AcademicCapIcon className="size-3.5" />
                        {levels} {levels === 1 ? 'level' : 'levels'}
                    </span>
                    {duration > 0 && (
                        <span className="inline-flex items-center gap-1">
                            <ClockIcon className="size-3.5" />
                            {formatDuration(duration)}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
}
