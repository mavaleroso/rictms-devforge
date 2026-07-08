import { Badge } from '@/components/catalyst/badge';
import { Button } from '@/components/catalyst/button';
import { Heading } from '@/components/catalyst/heading';
import { Text } from '@/components/catalyst/text';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { CapstoneTemplate } from '@/types/capstone';
import { PencilSquareIcon, RocketLaunchIcon } from '@heroicons/react/20/solid';
import { Head, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Capstone Templates', href: '/admin/capstone-templates' },
];

interface Props {
    templates: { data: CapstoneTemplate[] };
    stats: { total: number; active: number; milestones: number };
}

export default function AdminCapstoneTemplatesIndex({ templates, stats }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Capstone Templates" />

            <Heading>Capstone templates</Heading>
            <Text className="mt-2 max-w-2xl">Blueprint projects interns can choose when they reach Level 20.</Text>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                    { label: 'Templates', value: stats.total },
                    { label: 'Active', value: stats.active },
                    { label: 'Milestones', value: stats.milestones },
                ].map((item) => (
                    <div key={item.label} className="rounded-xl border border-zinc-950/10 bg-white p-4 dark:border-white/10 dark:bg-zinc-900">
                        <p className="text-[10px] font-semibold tracking-wide text-zinc-500 uppercase">{item.label}</p>
                        <p className="mt-1 text-2xl font-bold text-zinc-950 dark:text-white">{item.value}</p>
                    </div>
                ))}
            </div>

            <div className="mt-8 space-y-3">
                {templates.data.map((template) => (
                    <article
                        key={template.id}
                        className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-zinc-950/10 bg-white px-4 py-3 dark:border-white/10 dark:bg-zinc-900"
                    >
                        <div className="flex items-center gap-3">
                            <span className="flex size-9 items-center justify-center rounded-lg bg-brand-500/10 text-brand-600">
                                <RocketLaunchIcon className="size-4" />
                            </span>
                            <div>
                                <p className="text-sm font-semibold text-zinc-950 dark:text-white">{template.name}</p>
                                <p className="text-xs text-zinc-500">
                                    {template.estimated_weeks} weeks · {template.milestones?.length ?? template.milestones_count ?? 0} milestones
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge color={template.is_active ? 'lime' : 'zinc'}>{template.is_active ? 'Active' : 'Inactive'}</Badge>
                            <Button href={route('admin.capstone-templates.edit', template.id)} outline className="!text-xs">
                                <PencilSquareIcon data-slot="icon" />
                                Edit
                            </Button>
                        </div>
                    </article>
                ))}
            </div>
        </AppLayout>
    );
}
