import { Badge } from '@/components/catalyst/badge';
import { Button } from '@/components/catalyst/button';
import { Dialog, DialogActions, DialogBody, DialogTitle } from '@/components/catalyst/dialog';
import { FormField } from '@/components/form/form-field';
import { Input } from '@/components/catalyst/input';
import { Textarea } from '@/components/catalyst/textarea';
import { useValidatedForm } from '@/hooks/use-validated-form';
import { TASK_PRIORITY_LABEL, TASK_STATUS_LABEL } from '@/lib/capstone-labels';
import type { CapstoneTask, CapstoneTaskStatus } from '@/types/capstone';
import {
    DndContext,
    DragEndEvent,
    PointerSensor,
    closestCorners,
    useDroppable,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import clsx from 'clsx';
import { router } from '@inertiajs/react';
import { FormEventHandler, useMemo, useState } from 'react';

interface MilestoneOption {
    id: number;
    title: string;
}

interface KanbanBoardProps {
    columns: { status: CapstoneTaskStatus; tasks: { data: CapstoneTask[] } }[];
    milestones?: MilestoneOption[];
    milestoneFilter?: number | 'all';
}

const columnAccent: Record<CapstoneTaskStatus, string> = {
    backlog: 'border-t-zinc-400',
    todo: 'border-t-blue-500',
    in_progress: 'border-t-amber-500',
    in_review: 'border-t-brand-500',
    done: 'border-t-lime-500',
};

function TaskCard({
    task,
    milestoneTitle,
    onEdit,
}: {
    task: CapstoneTask;
    milestoneTitle?: string;
    onEdit: (task: CapstoneTask) => void;
}) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: `task-${task.id}`,
        data: { task },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <li
            ref={setNodeRef}
            style={style}
            className={clsx(
                'rounded-lg border border-zinc-950/5 bg-white p-2.5 shadow-sm dark:border-white/5 dark:bg-zinc-900',
                isDragging && 'opacity-70 ring-2 ring-brand-400',
            )}
        >
            <button type="button" className="w-full text-left" {...attributes} {...listeners}>
                <p className="text-xs font-semibold text-zinc-950 dark:text-white">{task.title}</p>
                {task.description && <p className="mt-1 line-clamp-2 text-[11px] text-zinc-500">{task.description}</p>}
            </button>
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <Badge color={task.priority === 'high' ? 'red' : task.priority === 'medium' ? 'amber' : 'zinc'}>
                    {TASK_PRIORITY_LABEL[task.priority]}
                </Badge>
                {milestoneTitle && <span className="text-[10px] text-zinc-400">{milestoneTitle}</span>}
                {task.due_date && <span className="text-[10px] text-zinc-400">Due {task.due_date}</span>}
            </div>
            <div className="mt-2 flex gap-1">
                <Button outline className="!px-2 !py-0.5 !text-[10px]" onClick={() => onEdit(task)}>
                    Edit
                </Button>
                <Button
                    outline
                    className="!px-2 !py-0.5 !text-[10px]"
                    onClick={() => {
                        if (confirm('Delete this task?')) {
                            router.delete(route('learn.capstone.tasks.destroy', task.id), { preserveScroll: true });
                        }
                    }}
                >
                    Delete
                </Button>
            </div>
        </li>
    );
}

function Column({
    status,
    tasks,
    milestoneMap,
    onEdit,
}: {
    status: CapstoneTaskStatus;
    tasks: CapstoneTask[];
    milestoneMap: Record<number, string>;
    onEdit: (task: CapstoneTask) => void;
}) {
    const { setNodeRef, isOver } = useDroppable({ id: status });

    return (
        <div
            ref={setNodeRef}
            className={clsx(
                'flex w-56 shrink-0 flex-col rounded-xl border border-zinc-950/10 border-t-[3px] bg-zinc-50/80 dark:border-white/10 dark:bg-zinc-900/50',
                columnAccent[status],
                isOver && 'bg-brand-50/40 dark:bg-brand-950/20',
            )}
        >
            <div className="flex items-center justify-between px-3 py-2.5">
                <h3 className="text-[11px] font-semibold tracking-wide text-zinc-600 uppercase dark:text-zinc-400">
                    {TASK_STATUS_LABEL[status]}
                </h3>
                <span className="rounded-full bg-zinc-200/80 px-1.5 py-0.5 text-[10px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                    {tasks.length}
                </span>
            </div>
            <SortableContext items={tasks.map((t) => `task-${t.id}`)} strategy={verticalListSortingStrategy}>
                <ul className="flex flex-1 flex-col gap-2 px-2 pb-2">
                    {tasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            milestoneTitle={task.milestone_id ? milestoneMap[task.milestone_id] : undefined}
                            onEdit={onEdit}
                        />
                    ))}
                </ul>
            </SortableContext>
        </div>
    );
}

export function KanbanBoard({ columns, milestones = [], milestoneFilter = 'all' }: KanbanBoardProps) {
    const [editing, setEditing] = useState<CapstoneTask | null>(null);
    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

    const milestoneMap = useMemo(
        () => Object.fromEntries(milestones.map((m) => [m.id, m.title])),
        [milestones],
    );

    const filteredColumns = columns.map((column) => ({
        ...column,
        tasks: {
            data: column.tasks.data.filter(
                (task) => milestoneFilter === 'all' || task.milestone_id === milestoneFilter,
            ),
        },
    }));

    const form = useValidatedForm({
        title: '',
        description: '',
        priority: 'medium',
        due_date: '',
        milestone_id: '' as string | number,
        status: 'todo' as CapstoneTaskStatus,
    });

    const openEdit = (task: CapstoneTask) => {
        form.setData({
            title: task.title,
            description: task.description ?? '',
            priority: task.priority,
            due_date: task.due_date ?? '',
            milestone_id: task.milestone_id ?? '',
            status: task.status,
        });
        setEditing(task);
    };

    const saveEdit: FormEventHandler = (e) => {
        e.preventDefault();
        if (!editing) {
            return;
        }

        form.patch(route('learn.capstone.tasks.update', editing.id), {
            preserveScroll: true,
            onSuccess: () => setEditing(null),
        });
    };

    const onDragEnd = (event: DragEndEvent) => {
        const task = event.active.data.current?.task as CapstoneTask | undefined;
        const overId = event.over?.id;
        if (!task || !overId) {
            return;
        }

        const nextStatus = String(overId).replace(/^task-/, '');
        const resolved = (Object.keys(TASK_STATUS_LABEL) as CapstoneTaskStatus[]).includes(nextStatus as CapstoneTaskStatus)
            ? (nextStatus as CapstoneTaskStatus)
            : filteredColumns.find((c) => c.tasks.data.some((t) => `task-${t.id}` === String(overId)))?.status;

        if (!resolved || task.status === resolved) {
            return;
        }

        router.patch(route('learn.capstone.tasks.update', task.id), { status: resolved }, { preserveScroll: true });
    };

    return (
        <>
            <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={onDragEnd}>
                <div className="flex gap-3 overflow-x-auto pb-2">
                    {filteredColumns.map((column) => (
                        <Column
                            key={column.status}
                            status={column.status}
                            tasks={column.tasks.data}
                            milestoneMap={milestoneMap}
                            onEdit={openEdit}
                        />
                    ))}
                </div>
            </DndContext>

            <Dialog open={editing !== null} onClose={() => setEditing(null)}>
                <DialogTitle>Edit task</DialogTitle>
                <DialogBody>
                    <form id="edit-task-form" onSubmit={saveEdit} className="space-y-3">
                        <FormField label="Title" error={form.errors.title}>
                            <Input value={form.data.title} onChange={(e) => form.setData('title', e.target.value)} />
                        </FormField>
                        <FormField label="Description">
                            <Textarea rows={3} value={form.data.description} onChange={(e) => form.setData('description', e.target.value)} />
                        </FormField>
                        <div className="grid gap-3 sm:grid-cols-2">
                            <FormField label="Priority">
                                <select
                                    value={form.data.priority}
                                    onChange={(e) => form.setData('priority', e.target.value)}
                                    className="w-full rounded-lg border border-zinc-950/10 px-3 py-2 text-sm dark:border-white/10 dark:bg-zinc-950"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </FormField>
                            <FormField label="Due date">
                                <Input type="date" value={form.data.due_date} onChange={(e) => form.setData('due_date', e.target.value)} />
                            </FormField>
                        </div>
                        <FormField label="Milestone">
                            <select
                                value={form.data.milestone_id}
                                onChange={(e) => form.setData('milestone_id', e.target.value ? Number(e.target.value) : '')}
                                className="w-full rounded-lg border border-zinc-950/10 px-3 py-2 text-sm dark:border-white/10 dark:bg-zinc-950"
                            >
                                <option value="">None</option>
                                {milestones.map((m) => (
                                    <option key={m.id} value={m.id}>
                                        {m.title}
                                    </option>
                                ))}
                            </select>
                        </FormField>
                    </form>
                </DialogBody>
                <DialogActions>
                    <Button outline onClick={() => setEditing(null)}>
                        Cancel
                    </Button>
                    <Button type="submit" form="edit-task-form" disabled={form.processing}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
