import { Badge } from '@/components/catalyst/badge';
import { TASK_PRIORITY_LABEL, TASK_STATUS_LABEL } from '@/lib/capstone-labels';
import type { CapstoneTask, CapstoneTaskStatus } from '@/types/capstone';
import clsx from 'clsx';
import { router } from '@inertiajs/react';

interface KanbanBoardProps {
    columns: { status: CapstoneTaskStatus; tasks: { data: CapstoneTask[] } }[];
}

const columnAccent: Record<CapstoneTaskStatus, string> = {
    backlog: 'border-t-zinc-400',
    todo: 'border-t-blue-500',
    in_progress: 'border-t-amber-500',
    in_review: 'border-t-brand-500',
    done: 'border-t-lime-500',
};

export function KanbanBoard({ columns }: KanbanBoardProps) {
    const moveTask = (task: CapstoneTask, status: CapstoneTaskStatus) => {
        if (task.status === status) {
            return;
        }

        router.patch(route('learn.capstone.tasks.update', task.id), { status }, { preserveScroll: true });
    };

    return (
        <div className="flex gap-3 overflow-x-auto pb-2">
            {columns.map((column) => (
                <div
                    key={column.status}
                    className={clsx(
                        'flex w-56 shrink-0 flex-col rounded-xl border border-zinc-950/10 border-t-[3px] bg-zinc-50/80 dark:border-white/10 dark:bg-zinc-900/50',
                        columnAccent[column.status],
                    )}
                >
                    <div className="flex items-center justify-between px-3 py-2.5">
                        <h3 className="text-[11px] font-semibold tracking-wide text-zinc-600 uppercase dark:text-zinc-400">
                            {TASK_STATUS_LABEL[column.status]}
                        </h3>
                        <span className="rounded-full bg-zinc-200/80 px-1.5 py-0.5 text-[10px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                            {column.tasks.data.length}
                        </span>
                    </div>
                    <ul className="flex flex-1 flex-col gap-2 px-2 pb-2">
                        {column.tasks.data.map((task) => (
                            <li
                                key={task.id}
                                className="rounded-lg border border-zinc-950/5 bg-white p-2.5 shadow-sm dark:border-white/5 dark:bg-zinc-900"
                            >
                                <p className="text-xs font-semibold text-zinc-950 dark:text-white">{task.title}</p>
                                {task.description && (
                                    <p className="mt-1 line-clamp-2 text-[11px] text-zinc-500">{task.description}</p>
                                )}
                                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                                    <Badge color={task.priority === 'high' ? 'red' : task.priority === 'medium' ? 'amber' : 'zinc'}>
                                        {TASK_PRIORITY_LABEL[task.priority]}
                                    </Badge>
                                </div>
                                <select
                                    value={task.status}
                                    onChange={(e) => moveTask(task, e.target.value as CapstoneTaskStatus)}
                                    className="mt-2 w-full rounded-md border border-zinc-950/10 bg-zinc-50 px-2 py-1 text-[11px] dark:border-white/10 dark:bg-zinc-800"
                                >
                                    {Object.entries(TASK_STATUS_LABEL).map(([value, label]) => (
                                        <option key={value} value={value}>
                                            {label}
                                        </option>
                                    ))}
                                </select>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
}
