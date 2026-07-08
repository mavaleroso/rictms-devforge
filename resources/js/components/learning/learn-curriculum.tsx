import { Badge } from '@/components/catalyst/badge';
import { formatDuration } from '@/lib/path-icons';
import { levelStatus, progressStatusColor, progressStatusLabel } from '@/lib/learn-status';
import type { Level } from '@/types/learning';
import {
    CheckCircleIcon,
    ChevronDownIcon,
    FilmIcon,
    LockClosedIcon,
    PlayCircleIcon,
    QuestionMarkCircleIcon,
} from '@heroicons/react/20/solid';
import clsx from 'clsx';
import { useState } from 'react';

interface LearnCurriculumProps {
    pathId: number;
    levels: Level[];
    defaultOpenLevelId?: number;
}

function levelMeta(level: Level): string {
    const parts: string[] = [];
    const materials = level.materials_count ?? level.materials?.length ?? 0;
    const videos = level.videos_count ?? level.videos?.length ?? 0;

    if (materials > 0) {
        parts.push(`${materials} reading`);
    }

    if (videos > 0) {
        parts.push(`${videos} video${videos === 1 ? '' : 's'}`);
    }

    if (level.quiz) {
        parts.push('quiz');
    }

    parts.push(formatDuration(level.estimated_minutes));

    return parts.join(' · ');
}

export function LearnCurriculum({ pathId, levels, defaultOpenLevelId }: LearnCurriculumProps) {
    const [openId, setOpenId] = useState<number | null>(defaultOpenLevelId ?? levels.find((l) => levelStatus(l) !== 'locked')?.id ?? levels[0]?.id ?? null);

    return (
        <div className="overflow-hidden rounded-xl border border-zinc-950/10 bg-white dark:border-white/10 dark:bg-zinc-900">
            <div className="border-b border-zinc-950/5 px-5 py-4 dark:border-white/5">
                <h2 className="text-lg font-semibold text-zinc-950 dark:text-white">Course content</h2>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    {levels.length} sections · Complete each level to unlock the next
                </p>
            </div>

            <ul className="divide-y divide-zinc-950/5 dark:divide-white/5">
                {levels.map((level) => {
                    const status = levelStatus(level);
                    const locked = status === 'locked';
                    const completed = status === 'completed';
                    const open = openId === level.id;
                    const href = locked ? undefined : route('learn.levels.show', [pathId, level.id]);

                    return (
                        <li key={level.id}>
                            <button
                                type="button"
                                onClick={() => setOpenId(open ? null : level.id)}
                                className="flex w-full items-start gap-3 px-5 py-4 text-left transition hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                            >
                                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-sm font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
                                    {completed ? <CheckCircleIcon className="size-5 text-emerald-500" /> : level.number}
                                </span>
                                <span className="min-w-0 flex-1">
                                    <span className="flex flex-wrap items-center gap-2">
                                        <span className="font-medium text-zinc-950 dark:text-white">{level.title}</span>
                                        <Badge color={progressStatusColor[status]}>{progressStatusLabel[status]}</Badge>
                                    </span>
                                    <span className="mt-1 block text-sm text-zinc-500 dark:text-zinc-400">{levelMeta(level)}</span>
                                </span>
                                <ChevronDownIcon
                                    className={clsx('size-5 shrink-0 text-zinc-400 transition', open && 'rotate-180')}
                                />
                            </button>

                            {open && (
                                <div className="border-t border-zinc-950/5 bg-zinc-50/80 px-5 py-3 dark:border-white/5 dark:bg-zinc-800/30">
                                    {level.overview && (
                                        <p className="mb-3 text-sm text-zinc-600 dark:text-zinc-300">{level.overview}</p>
                                    )}
                                    <ul className="space-y-2 text-sm">
                                        {(level.materials_count ?? 0) > 0 && (
                                            <li className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
                                                <PlayCircleIcon className="size-4 text-brand-500" />
                                                Reading materials
                                            </li>
                                        )}
                                        {(level.videos_count ?? 0) > 0 && (
                                            <li className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
                                                <FilmIcon className="size-4 text-brand-500" />
                                                Video lessons
                                            </li>
                                        )}
                                        {level.quiz && (
                                            <li className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
                                                <QuestionMarkCircleIcon className="size-4 text-brand-500" />
                                                Level quiz
                                            </li>
                                        )}
                                    </ul>
                                    <div className="mt-4">
                                        {locked ? (
                                            <span className="inline-flex items-center gap-1 text-sm text-zinc-500">
                                                <LockClosedIcon className="size-4" />
                                                Complete the previous level to unlock
                                            </span>
                                        ) : (
                                            <a
                                                href={href}
                                                className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-500 dark:text-brand-400"
                                            >
                                                <PlayCircleIcon className="size-4" />
                                                {completed ? 'Review level' : status === 'in_progress' ? 'Continue level' : 'Start level'}
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
