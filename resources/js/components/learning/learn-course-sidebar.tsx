import { Badge } from '@/components/catalyst/badge';
import { ProgressBar } from '@/components/learning/progress-bar';
import { buildLevelTasks, levelTaskProgress, taskTypeLabel, type LearnTask } from '@/lib/learn-tasks';
import { levelStatus, progressStatusColor, progressStatusLabel } from '@/lib/learn-status';
import { matchesPathPrefix, normalizePath } from '@/lib/nav';
import { formatDuration } from '@/lib/path-icons';
import { tierColorClass } from '@/lib/gamification-icons';
import type { Enrollment, Level } from '@/types/learning';
import type { GamificationSummary } from '@/types/gamification';
import {
    BookOpenIcon,
    CheckCircleIcon,
    CodeBracketSquareIcon,
    FilmIcon,
    FireIcon,
    HomeIcon,
    LockClosedIcon,
    PlayIcon,
    QuestionMarkCircleIcon,
} from '@heroicons/react/20/solid';
import clsx from 'clsx';
import { Link, usePage } from '@inertiajs/react';
import type { ComponentType, SVGProps } from 'react';

interface LearnCourseSidebarProps {
    pathId: number;
    pathName: string;
    levels: Level[];
    currentLevelId: number;
    currentLevel?: Level;
    currentTask?: string;
    enrollment?: Enrollment | null;
}

const taskIcons: Record<LearnTask['type'], ComponentType<SVGProps<SVGSVGElement>>> = {
    overview: HomeIcon,
    material: BookOpenIcon,
    video: FilmIcon,
    quiz: QuestionMarkCircleIcon,
    challenge: CodeBracketSquareIcon,
};

export function LearnCourseSidebar({
    pathId,
    pathName,
    levels,
    currentLevelId,
    currentLevel,
    currentTask,
    enrollment,
}: LearnCourseSidebarProps) {
    const page = usePage<{ gamification?: GamificationSummary | null }>();
    const { gamification } = page.props;
    const completedCount = levels.filter((l) => levelStatus(l) === 'completed').length;
    const currentPath = normalizePath(page.url);
    const levelForCurrentRoute = levels.find((level) =>
        buildLevelTasks(pathId, level).some((task) => normalizePath(task.href) === currentPath),
    );
    const resolvedLevelId = currentLevelId ?? levelForCurrentRoute?.id;
    const activeLevel = currentLevel ?? levels.find((l) => l.id === resolvedLevelId);
    const levelTasks = activeLevel ? buildLevelTasks(pathId, activeLevel) : [];
    const taskProgress = levelTaskProgress(levelTasks);

    return (
        <aside className="flex flex-col overflow-hidden rounded-xl border border-zinc-950/10 bg-white dark:border-white/10 dark:bg-zinc-900 lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)]">
            <div className="border-b border-zinc-950/5 p-3.5 dark:border-white/5">
                <Link
                    href={route('learn.paths.show', pathId)}
                    className={clsx(
                        'text-[11px] font-medium',
                        isPathOverviewActive(pathId, currentPath)
                            ? 'text-violet-700 dark:text-violet-300'
                            : 'text-violet-600 hover:text-violet-500 dark:text-violet-400',
                    )}
                >
                    ← Back to course
                </Link>
                <h2 className="mt-1.5 line-clamp-2 text-sm font-semibold text-zinc-950 dark:text-white">{pathName}</h2>
                {enrollment && (
                    <div className="mt-2.5">
                        <ProgressBar percentage={enrollment.progress_percentage} variant="accent" />
                        <p className="mt-1.5 text-[11px] text-zinc-500 dark:text-zinc-400">
                            {completedCount} of {levels.length} levels completed
                        </p>
                    </div>
                )}
                {gamification && (
                    <div className="mt-3 flex items-center justify-between gap-2 rounded-lg bg-zinc-50 px-2.5 py-2 dark:bg-zinc-800/60">
                        <div>
                            <p className="text-[10px] font-medium text-zinc-500 uppercase">XP</p>
                            <p className="text-sm font-bold tabular-nums text-zinc-950 dark:text-white">
                                {gamification.total_xp.toLocaleString()}
                            </p>
                        </div>
                        <span className={clsx('rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset', tierColorClass(gamification.tier.color))}>
                            {gamification.tier.label}
                        </span>
                        {gamification.current_streak > 0 && (
                            <div className="flex items-center gap-1 text-[11px] font-medium text-orange-600 dark:text-orange-400">
                                <FireIcon className="size-3.5" />
                                {gamification.current_streak}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <nav aria-label="Course content" className="flex-1 overflow-y-auto p-1.5">
                <ul className="space-y-0.5">
                    {levels.map((level) => {
                        const status = levelStatus(level);
                        const locked = status === 'locked';
                        const isCurrentLevel = level.id === resolvedLevelId;
                        const href = locked ? undefined : route('learn.levels.show', [pathId, level.id]);
                        const tasks = isCurrentLevel ? levelTasks : buildLevelTasks(pathId, level);

                        return (
                            <li key={level.id}>
                                {href ? (
                                    <Link
                                        href={href}
                                        className={clsx(
                                            'flex items-start gap-2.5 rounded-lg px-2.5 py-2 text-sm transition',
                                            isCurrentLevel
                                                ? 'bg-violet-50 ring-1 ring-violet-500/20 dark:bg-violet-950/40 dark:ring-violet-400/30'
                                                : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/60',
                                        )}
                                    >
                                        <LevelIcon status={status} number={level.number} />
                                        <span className="min-w-0 flex-1">
                                            <span
                                                className={clsx(
                                                    'line-clamp-2 text-[13px] font-medium leading-snug',
                                                    isCurrentLevel ? 'text-violet-700 dark:text-violet-200' : 'text-zinc-950 dark:text-white',
                                                )}
                                            >
                                                {level.title}
                                            </span>
                                            <span className="mt-0.5 flex items-center gap-1.5 text-[11px] text-zinc-500">
                                                {formatDuration(level.estimated_minutes)}
                                                {!isCurrentLevel && (
                                                    <Badge color={progressStatusColor[status]} className="!text-[10px]">
                                                        {progressStatusLabel[status]}
                                                    </Badge>
                                                )}
                                            </span>
                                        </span>
                                        {isCurrentLevel && <PlayIcon className="size-3.5 shrink-0 text-violet-500" />}
                                    </Link>
                                ) : (
                                    <div className="flex items-start gap-2.5 rounded-lg px-2.5 py-2 text-sm opacity-60">
                                        <LevelIcon status={status} number={level.number} />
                                        <span className="min-w-0 flex-1">
                                            <span className="line-clamp-2 text-[13px] font-medium text-zinc-500">{level.title}</span>
                                            <span className="mt-0.5 block text-[11px] text-zinc-400">Locked</span>
                                        </span>
                                        <LockClosedIcon className="size-3.5 shrink-0 text-zinc-400" />
                                    </div>
                                )}

                                {isCurrentLevel && !locked && tasks.length > 0 && (
                                    <div className="mt-1 mb-1.5 ml-3 border-l border-violet-500/20 pl-2 dark:border-violet-400/20">
                                        <p className="px-2 py-1 text-[10px] font-semibold tracking-wide text-zinc-500 uppercase">
                                            Level {level.number} · {taskProgress.completed}/{taskProgress.total} tasks
                                        </p>
                                        <ul className="space-y-0.5">
                                            {tasks.map((task) => (
                                                <TaskItem
                                                    key={task.key}
                                                    task={task}
                                                    active={isTaskActive(task, currentTask, currentPath)}
                                                />
                                            ))}
                                        </ul>
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

function isTaskActive(task: LearnTask, currentTask: string | undefined, currentPath: string): boolean {
    if (currentTask === task.key) {
        return true;
    }

    return normalizePath(task.href) === currentPath;
}

function isPathOverviewActive(pathId: number, currentPath: string): boolean {
    return matchesPathPrefix(currentPath, normalizePath(route('learn.paths.show', pathId)));
}

function TaskItem({ task, active }: { task: LearnTask; active: boolean }) {
    const Icon = taskIcons[task.type];

    return (
        <li>
            <Link
                href={task.href}
                className={clsx(
                    'flex items-center gap-2 rounded-md px-2 py-1.5 text-[12px] transition',
                    active
                        ? 'bg-violet-100 font-medium text-violet-800 dark:bg-violet-900/50 dark:text-violet-200'
                        : 'text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800/60',
                )}
            >
                <span className="flex size-5 shrink-0 items-center justify-center rounded bg-zinc-100 text-[10px] font-semibold text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                    {task.completed ? <CheckCircleIcon className="size-3.5 text-emerald-500" /> : task.step}
                </span>
                <Icon className="size-3.5 shrink-0 opacity-70" />
                <span className="min-w-0 flex-1 truncate">{task.shortLabel}</span>
                <span className="shrink-0 text-[10px] text-zinc-400">{taskTypeLabel(task.type)}</span>
            </Link>
        </li>
    );
}

function LevelIcon({ status, number }: { status: ReturnType<typeof levelStatus>; number: number }) {
    if (status === 'completed') {
        return (
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                <CheckCircleIcon className="size-3.5" />
            </span>
        );
    }

    if (status === 'locked') {
        return (
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-[11px] font-semibold text-zinc-400 dark:bg-zinc-800">
                {number}
            </span>
        );
    }

    return (
        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-violet-500/15 text-[11px] font-semibold text-violet-700 dark:text-violet-300">
            {number}
        </span>
    );
}
