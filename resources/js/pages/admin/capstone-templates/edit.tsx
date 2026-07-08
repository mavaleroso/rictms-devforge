import { Button } from '@/components/catalyst/button';
import { FormField } from '@/components/form/form-field';
import { Input } from '@/components/catalyst/input';
import { Textarea } from '@/components/catalyst/textarea';
import { Switch, SwitchField } from '@/components/catalyst/switch';
import { Heading } from '@/components/catalyst/heading';
import AppLayout from '@/layouts/app-layout';
import { useValidatedForm } from '@/hooks/use-validated-form';
import type { BreadcrumbItem } from '@/types';
import type { CapstoneTemplate } from '@/types/capstone';
import { Head, Link } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface Props {
    template: { data: CapstoneTemplate };
}

export default function AdminCapstoneTemplatesEdit({ template: templateProp }: Props) {
    const template = templateProp.data;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Capstone Templates', href: '/admin/capstone-templates' },
        { title: template.name, href: route('admin.capstone-templates.edit', template.id) },
    ];

    const form = useValidatedForm({
        name: template.name,
        description: template.description ?? '',
        objectives: template.objectives ?? '',
        estimated_weeks: template.estimated_weeks,
        is_active: template.is_active,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        form.patch(route('admin.capstone-templates.update', template.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${template.name}`} />

            <Link href={route('admin.capstone-templates.index')} className="text-xs font-medium text-brand-600 dark:text-brand-400">
                ← Back to templates
            </Link>

            <Heading className="mt-3">{template.name}</Heading>

            <form onSubmit={submit} className="mt-6 max-w-2xl space-y-4 rounded-xl border border-zinc-950/10 bg-white p-5 dark:border-white/10 dark:bg-zinc-900">
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
                    <Input type="number" min={1} max={52} value={form.data.estimated_weeks} onChange={(e) => form.setData('estimated_weeks', Number(e.target.value))} />
                </FormField>
                <FormField label="Active">
                    <SwitchField>
                        <Switch checked={form.data.is_active} onChange={(checked) => form.setData('is_active', checked)} />
                    </SwitchField>
                </FormField>
                <Button type="submit" disabled={form.processing}>
                    Save template
                </Button>
            </form>

            {template.milestones && template.milestones.length > 0 && (
                <section className="mt-8 max-w-2xl">
                    <h2 className="text-sm font-semibold text-zinc-950 dark:text-white">Milestones</h2>
                    <ol className="mt-3 space-y-2">
                        {template.milestones.map((milestone, index) => (
                            <li key={milestone.id} className="rounded-lg border border-zinc-950/10 px-3 py-2 text-sm dark:border-white/10">
                                <span className="font-medium text-zinc-950 dark:text-white">{index + 1}. {milestone.title}</span>
                                {milestone.description && (
                                    <p className="mt-0.5 text-xs text-zinc-500">{milestone.description}</p>
                                )}
                            </li>
                        ))}
                    </ol>
                </section>
            )}
        </AppLayout>
    );
}
