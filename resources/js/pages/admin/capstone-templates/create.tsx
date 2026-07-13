import { Button } from '@/components/catalyst/button';
import { Heading } from '@/components/catalyst/heading';
import { Input } from '@/components/catalyst/input';
import { Switch, SwitchField } from '@/components/catalyst/switch';
import { Textarea } from '@/components/catalyst/textarea';
import { Text } from '@/components/catalyst/text';
import { FormField } from '@/components/form/form-field';
import { useValidatedForm } from '@/hooks/use-validated-form';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { ArrowLeftIcon } from '@heroicons/react/20/solid';
import { Head, Link } from '@inertiajs/react';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Capstone Templates', href: '/admin/capstone-templates' },
    { title: 'Create', href: '/admin/capstone-templates/create' },
];

export default function AdminCapstoneTemplatesCreate() {
    const form = useValidatedForm({
        name: '',
        description: '',
        objectives: '',
        estimated_weeks: 8,
        is_active: true,
        requires_kickoff: true,
        allow_parallel_milestones: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        form.post(route('admin.capstone-templates.store'), {
            successToast: { title: 'Template created', message: 'Add milestones and tasks on the next screen.' },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Capstone Template" />

            <Link href={route('admin.capstone-templates.index')} className="text-xs font-medium text-brand-600 dark:text-brand-400">
                ← Back to templates
            </Link>

            <Heading className="mt-3">Create template</Heading>
            <Text className="mt-2 max-w-2xl">Define the blueprint details. You can add milestones and starter tasks after saving.</Text>

            <form
                onSubmit={submit}
                className="mt-6 max-w-2xl space-y-4 rounded-xl border border-zinc-950/10 bg-white p-5 dark:border-white/10 dark:bg-zinc-900"
            >
                <FormField label="Name" error={form.errors.name}>
                    <Input value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} placeholder="e.g. Full-stack product MVP" />
                </FormField>
                <FormField label="Description" error={form.errors.description}>
                    <Textarea
                        rows={3}
                        value={form.data.description}
                        onChange={(e) => form.setData('description', e.target.value)}
                        placeholder="What the intern will build and why it matters."
                    />
                </FormField>
                <FormField label="Objectives" error={form.errors.objectives}>
                    <Textarea
                        rows={4}
                        value={form.data.objectives}
                        onChange={(e) => form.setData('objectives', e.target.value)}
                        placeholder="Learning outcomes and deliverable expectations."
                    />
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
                <div className="flex flex-wrap gap-3 pt-2">
                    <Button type="submit" disabled={form.processing}>
                        Create template
                    </Button>
                    <Button href={route('admin.capstone-templates.index')} plain>
                        <ArrowLeftIcon data-slot="icon" />
                        Cancel
                    </Button>
                </div>
            </form>
        </AppLayout>
    );
}
