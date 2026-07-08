import { Button } from '@/components/catalyst/button';
import { buildLevelTasks, type LearnTask } from '@/lib/learn-tasks';
import type { Level } from '@/types/learning';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/20/solid';

interface LearnTaskNavProps {
    pathId: number;
    level: Level;
    currentTask: string;
}

export function LearnTaskNav({ pathId, level, currentTask }: LearnTaskNavProps) {
    const tasks = buildLevelTasks(pathId, level);
    const index = tasks.findIndex((t) => t.key === currentTask);
    const prev = index > 0 ? tasks[index - 1] : null;
    const next = index >= 0 && index < tasks.length - 1 ? tasks[index + 1] : null;

    if (!prev && !next) {
        return null;
    }

    return (
        <div className="flex items-center justify-between gap-3 border-t border-zinc-950/8 pt-4 dark:border-white/8">
            {prev ? (
                <Button href={prev.href} plain className="!text-xs">
                    <ArrowLeftIcon data-slot="icon" className="!size-3.5" />
                    {prev.shortLabel}
                </Button>
            ) : (
                <span />
            )}
            {next ? (
                <Button href={next.href} outline className="!text-xs">
                    {next.shortLabel}
                    <ArrowRightIcon data-slot="icon" className="!size-3.5" />
                </Button>
            ) : null}
        </div>
    );
}

export function findNextIncompleteTask(pathId: number, level: Level): LearnTask | null {
    const tasks = buildLevelTasks(pathId, level).filter((t) => t.type !== 'overview');

    return tasks.find((t) => !t.completed) ?? null;
}
