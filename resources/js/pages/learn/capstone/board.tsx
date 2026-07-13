import { CapstoneNav } from '@/components/capstone/capstone-nav';
import { KanbanBoard } from '@/components/capstone/kanban-board';
import { Button } from '@/components/catalyst/button';
import { FormField } from '@/components/form/form-field';
import { Input } from '@/components/catalyst/input';
import { Textarea } from '@/components/catalyst/textarea';
import { Heading } from '@/components/catalyst/heading';
import AppLayout from '@/layouts/app-layout';
import { useValidatedForm } from '@/hooks/use-validated-form';
import type { BreadcrumbItem } from '@/types';
import type { CapstoneProject, KanbanColumn } from '@/types/capstone';
import { PlusIcon } from '@heroicons/react/20/solid';
import { Head } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Learn', href: '/learn/paths' },
    { title: 'Capstone', href: '/learn/capstone' },
    { title: 'Board', href: '/learn/capstone/board' },
];

interface Props {
    project: { data: CapstoneProject };
    columns: KanbanColumn[];
    milestones: { id: number; title: string }[];
}

export default function CapstoneBoard({ project: projectProp, columns, milestones }: Props) {
    const project = projectProp.data;
    const [showForm, setShowForm] = useState(false);
    const [milestoneFilter, setMilestoneFilter] = useState<number | 'all'>('all');

    const form = useValidatedForm({
        title: '',
        description: '',
        priority: 'medium',
        due_date: '',
        milestone_id: '' as string | number,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        form.transform((data) => ({
            ...data,
            milestone_id: data.milestone_id === '' ? null : Number(data.milestone_id),
            due_date: data.due_date || null,
        }));
        form.post(route('learn.capstone.tasks.store'), {
            onSuccess: () => {
                form.reset();
                setShowForm(false);
            },
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Task board" />

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <Heading>{project.title}</Heading>
                <div className="flex flex-wrap items-center gap-2">
                    <CapstoneNav current="board" />
                    <Button outline className="!text-xs" onClick={() => setShowForm((v) => !v)}>
                        <PlusIcon data-slot="icon" />
                        Add task
                    </Button>
                </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
                <label className="text-xs font-medium text-zinc-500">Filter by milestone</label>
                <select
                    value={milestoneFilter}
                    onChange={(e) => setMilestoneFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                    className="rounded-lg border border-zinc-950/10 px-3 py-1.5 text-xs dark:border-white/10 dark:bg-zinc-950"
                >
                    <option value="all">All milestones</option>
                    {milestones.map((m) => (
                        <option key={m.id} value={m.id}>
                            {m.title}
                        </option>
                    ))}
                </select>
                <p className="text-[11px] text-zinc-400">Drag cards across columns to update status</p>
            </div>

            {showForm && (
                <form onSubmit={submit} className="mt-4 rounded-xl border border-zinc-950/10 bg-white p-4 dark:border-white/10 dark:bg-zinc-900">
                    <div className="grid gap-3 sm:grid-cols-2">
                        <FormField label="Title" error={form.errors.title}>
                            <Input value={form.data.title} onChange={(e) => form.setData('title', e.target.value)} />
                        </FormField>
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
                        <FormField label="Due date">
                            <Input type="date" value={form.data.due_date} onChange={(e) => form.setData('due_date', e.target.value)} />
                        </FormField>
                    </div>
                    <FormField label="Description" className="mt-3">
                        <Textarea rows={2} value={form.data.description} onChange={(e) => form.setData('description', e.target.value)} />
                    </FormField>
                    <div className="mt-3 flex gap-2">
                        <Button type="submit" disabled={form.processing}>
                            Create task
                        </Button>
                        <Button type="button" outline onClick={() => setShowForm(false)}>
                            Cancel
                        </Button>
                    </div>
                </form>
            )}

            <div className="mt-6">
                <KanbanBoard columns={columns} milestones={milestones} milestoneFilter={milestoneFilter} />
            </div>
        </AppLayout>
    );
}
