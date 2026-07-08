import { Badge } from '@/components/catalyst/badge';
import { Button } from '@/components/catalyst/button';
import { LearnPlayerLayout } from '@/components/learning/learn-player-layout';
import { buildLevelTasks, levelTaskProgress, taskTypeLabel } from '@/lib/learn-tasks';
import { levelStatus, progressStatusColor, progressStatusLabel } from '@/lib/learn-status';
import { formatDuration } from '@/lib/path-icons';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { type Enrollment, type LearningPath, type Level } from '@/types/learning';
import {
    BookOpenIcon,
    CheckCircleIcon,
    CodeBracketSquareIcon,
    FilmIcon,
    QuestionMarkCircleIcon,
} from '@heroicons/react/20/solid';
import { usePage } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import clsx from 'clsx';

interface Props {
    path: { data: LearningPath };
    level: { data: Level };
    enrollment: { data: Enrollment } | null;
    currentTask: string;
    continueHref?: string | null;
}

const typeIcons = {
    material: BookOpenIcon,
    video: FilmIcon,
    quiz: QuestionMarkCircleIcon,
    challenge: CodeBracketSquareIcon,
};

export default function LearnLevelsShow({ path: pathProp, level: levelProp, enrollment, continueHref }: Props) {
    const path = pathProp.data;
    const level = levelProp.data;
    const enrolled = enrollment?.data ?? null;
    const levels = path.levels ?? [];
    const tasks = buildLevelTasks(path.id, level).filter((t) => t.type !== 'overview');
    const progress = levelTaskProgress(buildLevelTasks(path.id, level));
    const { flash } = usePage<SharedData & { flash?: { quiz_result?: { score: number; passed: boolean } } }>().props;

    const status = levelStatus(level);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'My learning', href: '/learn/paths' },
        { title: path.name, href: route('learn.paths.show', path.id) },
        { title: `Level ${level.number}`, href: route('learn.levels.show', [path.id, level.id]) },
    ];

    return (
        <LearnPlayerLayout
            title={`${level.title} — ${path.name}`}
            breadcrumbs={breadcrumbs}
            path={path}
            level={level}
            enrollment={enrolled}
            currentTask="overview"
        >
            <header>
                <p className="text-xs font-medium text-violet-600 dark:text-violet-400">
                    Level {level.number} of {levels.length}
                </p>
                <h1 className="mt-1 text-xl font-bold tracking-tight text-zinc-950 dark:text-white sm:text-2xl">{level.title}</h1>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Badge color={progressStatusColor[status]}>{progressStatusLabel[status]}</Badge>
                    <Badge color="zinc">{level.difficulty}</Badge>
                    <span className="text-xs text-zinc-500">{formatDuration(level.estimated_minutes)}</span>
                    <span className="text-xs text-zinc-500">
                        {progress.completed}/{progress.total} tasks done
                    </span>
                </div>
            </header>

            {flash?.quiz_result && (
                <div
                    className={clsx(
                        'mt-4 rounded-lg border p-3 text-sm',
                        flash.quiz_result.passed
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-950/30 dark:text-emerald-200'
                            : 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-500/30 dark:bg-amber-950/30 dark:text-amber-200',
                    )}
                >
                    Quiz result: {flash.quiz_result.score}% — {flash.quiz_result.passed ? 'Passed! Next level unlocked.' : 'Not passed yet. Try again.'}
                </div>
            )}

            {(level.overview || level.objectives) && (
                <section className="mt-5 rounded-xl border border-zinc-950/10 bg-white p-4 dark:border-white/10 dark:bg-zinc-900">
                    <h2 className="text-sm font-semibold text-zinc-950 dark:text-white">About this level</h2>
                    {level.overview && <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">{level.overview}</p>}
                    {level.objectives && (
                        <div className="mt-3">
                            <p className="text-[11px] font-semibold tracking-wide text-zinc-500 uppercase">Objectives</p>
                            <p className="mt-1.5 whitespace-pre-wrap text-sm text-zinc-600 dark:text-zinc-300">{level.objectives}</p>
                        </div>
                    )}
                </section>
            )}

            {continueHref && (
                <div className="mt-4">
                    <Button href={continueHref} color="dark/zinc" className="!text-xs">
                        Continue learning
                    </Button>
                </div>
            )}

            <section className="mt-6">
                <h2 className="text-sm font-semibold text-zinc-950 dark:text-white">Level tasks</h2>
                <p className="mt-1 text-xs text-zinc-500">Complete each item in order. Select a task from the sidebar or below.</p>
                <ul className="mt-3 space-y-2">
                    {tasks.map((task) => {
                        const Icon = typeIcons[task.type as keyof typeof typeIcons] ?? BookOpenIcon;

                        return (
                            <li key={task.key}>
                                <Link
                                    href={task.href}
                                    className="flex items-center gap-3 rounded-xl border border-zinc-950/10 bg-white px-4 py-3 transition hover:border-violet-500/30 hover:bg-violet-50/50 dark:border-white/10 dark:bg-zinc-900 dark:hover:bg-violet-950/20"
                                >
                                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-xs font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                                        {task.completed ? <CheckCircleIcon className="size-4 text-emerald-500" /> : task.step}
                                    </span>
                                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400">
                                        <Icon className="size-4" />
                                    </span>
                                    <span className="min-w-0 flex-1">
                                        <span className="block truncate text-sm font-medium text-zinc-950 dark:text-white">{task.label}</span>
                                        <span className="text-[11px] text-zinc-500">{taskTypeLabel(task.type)}</span>
                                    </span>
                                    {task.completed && (
                                        <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">Done</span>
                                    )}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </section>
        </LearnPlayerLayout>
    );
}
