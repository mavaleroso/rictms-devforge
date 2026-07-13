import { Badge } from '@/components/catalyst/badge';
import { Button } from '@/components/catalyst/button';
import { Heading, Subheading } from '@/components/catalyst/heading';
import { Input } from '@/components/catalyst/input';
import { Switch, SwitchField } from '@/components/catalyst/switch';
import { Text } from '@/components/catalyst/text';
import { Textarea } from '@/components/catalyst/textarea';
import { useConfirmDialog } from '@/components/confirm-dialog';
import { FormField } from '@/components/form/form-field';
import { useValidatedForm } from '@/hooks/use-validated-form';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { CapstoneTemplate, CapstoneTemplateMilestone, CapstoneTemplateTask } from '@/types/capstone';
import { PlusIcon, TrashIcon } from '@heroicons/react/20/solid';
import { Head, Link, router } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface Props {
    template: { data: CapstoneTemplate };
}

function asList<T>(value: T[] | { data: T[] } | undefined | null): T[] {
    if (!value) {
        return [];
    }

    return Array.isArray(value) ? value : value.data;
}

function TemplateMetaForm({ template }: { template: CapstoneTemplate }) {
    const form = useValidatedForm({
        name: template.name,
        description: template.description ?? '',
        objectives: template.objectives ?? '',
        estimated_weeks: template.estimated_weeks,
        is_active: template.is_active,
        requires_kickoff: template.requires_kickoff ?? true,
        allow_parallel_milestones: template.allow_parallel_milestones ?? false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        form.patch(route('admin.capstone-templates.update', template.id), {
            successToast: { title: 'Template saved', message: 'Blueprint details were updated.' },
        });
    };

    return (
        <form
            onSubmit={submit}
            className="max-w-2xl space-y-4 rounded-xl border border-zinc-950/10 bg-white p-5 dark:border-white/10 dark:bg-zinc-900"
        >
            <FormField label="Name" error={form.errors.name}>
                <Input value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} />
            </FormField>
            <FormField label="Description" error={form.errors.description}>
                <Textarea rows={3} value={form.data.description} onChange={(e) => form.setData('description', e.target.value)} />
            </FormField>
            <FormField label="Objectives" error={form.errors.objectives}>
                <Textarea rows={4} value={form.data.objectives} onChange={(e) => form.setData('objectives', e.target.value)} />
            </FormField>
            <FormField label="Estimated weeks" error={form.errors.estimated_weeks}>
                <Input
                    type="number"
                    min={1}
                    max={52}
                    value={form.data.estimated_weeks}
                    onChange={(e) => form.setData('estimated_weeks', Number(e.target.value))}
                />
            </FormField>
            <FormField label="Active">
                <SwitchField>
                    <Switch checked={form.data.is_active} onChange={(checked) => form.setData('is_active', checked)} />
                </SwitchField>
            </FormField>
            <FormField label="Requires kickoff">
                <SwitchField>
                    <Switch checked={form.data.requires_kickoff} onChange={(checked) => form.setData('requires_kickoff', checked)} />
                </SwitchField>
            </FormField>
            <FormField label="Allow parallel milestones">
                <SwitchField>
                    <Switch
                        checked={form.data.allow_parallel_milestones}
                        onChange={(checked) => form.setData('allow_parallel_milestones', checked)}
                    />
                </SwitchField>
            </FormField>
            <Button type="submit" disabled={form.processing}>
                Save template
            </Button>
        </form>
    );
}

function AddMilestoneForm({ templateId }: { templateId: number }) {
    const form = useValidatedForm({
        title: '',
        description: '',
        requires_mentor_signoff: true,
        allows_parallel: false,
        is_final_showcase: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        form.post(route('admin.capstone-templates.milestones.store', templateId), {
            onSuccess: () => form.reset(),
            successToast: { title: 'Milestone added' },
        });
    };

    return (
        <form
            onSubmit={submit}
            className="space-y-3 rounded-xl border border-dashed border-zinc-300 bg-zinc-50/80 p-4 dark:border-zinc-700 dark:bg-zinc-900/40"
        >
            <p className="text-xs font-semibold text-zinc-950 dark:text-white">Add milestone</p>
            <FormField label="Title" error={form.errors.title}>
                <Input value={form.data.title} onChange={(e) => form.setData('title', e.target.value)} placeholder="e.g. Kickoff & scope" />
            </FormField>
            <FormField label="Description" error={form.errors.description}>
                <Textarea rows={2} value={form.data.description} onChange={(e) => form.setData('description', e.target.value)} />
            </FormField>
            <div className="grid gap-3 sm:grid-cols-3">
                <FormField label="Mentor sign-off">
                    <SwitchField>
                        <Switch
                            checked={form.data.requires_mentor_signoff}
                            onChange={(checked) => form.setData('requires_mentor_signoff', checked)}
                        />
                    </SwitchField>
                </FormField>
                <FormField label="Allows parallel">
                    <SwitchField>
                        <Switch checked={form.data.allows_parallel} onChange={(checked) => form.setData('allows_parallel', checked)} />
                    </SwitchField>
                </FormField>
                <FormField label="Final showcase">
                    <SwitchField>
                        <Switch checked={form.data.is_final_showcase} onChange={(checked) => form.setData('is_final_showcase', checked)} />
                    </SwitchField>
                </FormField>
            </div>
            <Button type="submit" disabled={form.processing} className="!text-xs">
                <PlusIcon data-slot="icon" />
                Add milestone
            </Button>
        </form>
    );
}

function MilestoneEditor({
    milestone,
    tasks,
    templateId,
}: {
    milestone: CapstoneTemplateMilestone;
    tasks: CapstoneTemplateTask[];
    templateId: number;
}) {
    const { confirm, ConfirmDialog } = useConfirmDialog();
    const form = useValidatedForm({
        title: milestone.title,
        description: milestone.description ?? '',
        requires_mentor_signoff: milestone.requires_mentor_signoff ?? true,
        allows_parallel: milestone.allows_parallel ?? false,
        is_final_showcase: milestone.is_final_showcase ?? false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        form.patch(route('admin.capstone-template-milestones.update', milestone.id), {
            successToast: { title: 'Milestone updated' },
        });
    };

    const remove = async () => {
        const confirmed = await confirm({
            title: `Delete “${milestone.title}”?`,
            description: 'Linked template tasks for this milestone will also be removed. This cannot be undone.',
            confirmLabel: 'Delete milestone',
            variant: 'danger',
        });

        if (confirmed) {
            router.delete(route('admin.capstone-template-milestones.destroy', milestone.id));
        }
    };

    return (
        <article className="rounded-xl border border-zinc-950/10 bg-white p-4 dark:border-white/10 dark:bg-zinc-900">
            <ConfirmDialog />
            <form onSubmit={submit} className="space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-zinc-950 dark:text-white">Milestone #{milestone.sort_order}</p>
                        {milestone.is_final_showcase && <Badge color="amber">Showcase</Badge>}
                        {milestone.requires_mentor_signoff && <Badge color="blue">Sign-off</Badge>}
                    </div>
                    <Button type="button" plain className="!text-xs text-red-600 dark:text-red-400" onClick={remove}>
                        <TrashIcon data-slot="icon" />
                        Delete
                    </Button>
                </div>
                <FormField label="Title" error={form.errors.title}>
                    <Input value={form.data.title} onChange={(e) => form.setData('title', e.target.value)} />
                </FormField>
                <FormField label="Description" error={form.errors.description}>
                    <Textarea rows={2} value={form.data.description} onChange={(e) => form.setData('description', e.target.value)} />
                </FormField>
                <div className="grid gap-3 sm:grid-cols-3">
                    <FormField label="Mentor sign-off">
                        <SwitchField>
                            <Switch
                                checked={form.data.requires_mentor_signoff}
                                onChange={(checked) => form.setData('requires_mentor_signoff', checked)}
                            />
                        </SwitchField>
                    </FormField>
                    <FormField label="Allows parallel">
                        <SwitchField>
                            <Switch checked={form.data.allows_parallel} onChange={(checked) => form.setData('allows_parallel', checked)} />
                        </SwitchField>
                    </FormField>
                    <FormField label="Final showcase">
                        <SwitchField>
                            <Switch checked={form.data.is_final_showcase} onChange={(checked) => form.setData('is_final_showcase', checked)} />
                        </SwitchField>
                    </FormField>
                </div>
                <Button type="submit" disabled={form.processing} outline className="!text-xs">
                    Save milestone
                </Button>
            </form>

            <div className="mt-5 border-t border-zinc-950/5 pt-4 dark:border-white/5">
                <p className="text-xs font-semibold text-zinc-950 dark:text-white">Tasks</p>
                <ul className="mt-2 space-y-2">
                    {tasks.length === 0 && <li className="text-xs text-zinc-500">No tasks linked to this milestone yet.</li>}
                    {tasks.map((task) => (
                        <TaskRow key={task.id} task={task} />
                    ))}
                </ul>
                <AddTaskForm templateId={templateId} milestoneId={milestone.id} />
            </div>
        </article>
    );
}

function TaskRow({ task }: { task: CapstoneTemplateTask }) {
    const { confirm, ConfirmDialog } = useConfirmDialog();

    const remove = async () => {
        const confirmed = await confirm({
            title: `Delete “${task.title}”?`,
            description: 'This starter task will be removed from the template.',
            confirmLabel: 'Delete task',
            variant: 'danger',
        });

        if (confirmed) {
            router.delete(route('admin.capstone-template-tasks.destroy', task.id));
        }
    };

    return (
        <li className="flex items-start justify-between gap-3 rounded-lg border border-zinc-950/10 px-3 py-2 dark:border-white/10">
            <ConfirmDialog />
            <div className="min-w-0">
                <p className="text-sm font-medium text-zinc-950 dark:text-white">{task.title}</p>
                {task.description && <p className="mt-0.5 text-xs text-zinc-500">{task.description}</p>}
            </div>
            <Button type="button" plain className="shrink-0 !text-xs text-red-600 dark:text-red-400" onClick={remove}>
                <TrashIcon data-slot="icon" />
                Delete
            </Button>
        </li>
    );
}

function AddTaskForm({ templateId, milestoneId }: { templateId: number; milestoneId: number }) {
    const form = useValidatedForm({
        title: '',
        description: '',
        capstone_template_milestone_id: milestoneId,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        form.post(route('admin.capstone-templates.tasks.store', templateId), {
            onSuccess: () => form.reset('title', 'description'),
            successToast: { title: 'Task added' },
        });
    };

    return (
        <form onSubmit={submit} className="mt-3 grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
            <FormField label="Task title" error={form.errors.title}>
                <Input value={form.data.title} onChange={(e) => form.setData('title', e.target.value)} placeholder="Starter task" />
            </FormField>
            <FormField label="Description" error={form.errors.description}>
                <Input value={form.data.description} onChange={(e) => form.setData('description', e.target.value)} placeholder="Optional" />
            </FormField>
            <div className="flex items-end">
                <Button type="submit" disabled={form.processing} outline className="!text-xs">
                    <PlusIcon data-slot="icon" />
                    Add task
                </Button>
            </div>
        </form>
    );
}

export default function AdminCapstoneTemplatesEdit({ template: templateProp }: Props) {
    const template = templateProp.data;
    const milestones = asList(template.milestones).slice().sort((a, b) => a.sort_order - b.sort_order);
    const tasks = asList(template.tasks);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Capstone Templates', href: '/admin/capstone-templates' },
        { title: template.name, href: route('admin.capstone-templates.edit', template.id) },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${template.name}`} />

            <Link href={route('admin.capstone-templates.index')} className="text-xs font-medium text-brand-600 dark:text-brand-400">
                ← Back to templates
            </Link>

            <div className="mt-3 flex flex-wrap items-center gap-3">
                <Heading>{template.name}</Heading>
                <Badge color={template.is_active ? 'lime' : 'zinc'}>{template.is_active ? 'Active' : 'Inactive'}</Badge>
            </div>
            <Text className="mt-2 max-w-2xl">Update blueprint details, milestones, and starter tasks for this capstone.</Text>

            <section className="mt-6">
                <Subheading>Template details</Subheading>
                <div className="mt-3">
                    <TemplateMetaForm template={template} />
                </div>
            </section>

            <section className="mt-8 max-w-2xl space-y-4">
                <div>
                    <Subheading>Milestones</Subheading>
                    <Text className="mt-1">Define the review gates interns progress through. Link starter tasks under each milestone.</Text>
                </div>

                {milestones.map((milestone) => (
                    <MilestoneEditor
                        key={milestone.id}
                        milestone={milestone}
                        templateId={template.id}
                        tasks={tasks.filter((task) => task.capstone_template_milestone_id === milestone.id)}
                    />
                ))}

                <AddMilestoneForm templateId={template.id} />
            </section>
        </AppLayout>
    );
}
