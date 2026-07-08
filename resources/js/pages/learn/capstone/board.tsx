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
}

export default function CapstoneBoard({ project: projectProp, columns }: Props) {
    const project = projectProp.data;
    const [showForm, setShowForm] = useState(false);

    const form = useValidatedForm({
        title: '',
        description: '',
        priority: 'medium',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
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
                <KanbanBoard columns={columns} />
            </div>
        </AppLayout>
    );
}
