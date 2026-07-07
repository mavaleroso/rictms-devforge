import { PathCard, PathIndexStats } from '@/components/admin/path-card';
import { Button } from '@/components/catalyst/button';
import { Heading } from '@/components/catalyst/heading';
import { Text } from '@/components/catalyst/text';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type LearningPath, type PaginatedCollection } from '@/types/learning';
import { PlusIcon } from '@heroicons/react/20/solid';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Learning Paths', href: '/admin/paths' },
];

interface Props {
    paths: PaginatedCollection<LearningPath>;
    stats: {
        total: number;
        active: number;
        enrollments: number;
    };
}

export default function AdminPathsIndex({ paths, stats }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Learning Paths" />

            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <Heading>Learning paths</Heading>
                    <Text className="mt-2 max-w-2xl">
                        Design structured curricula, manage levels, and publish paths for intern enrollment.
                    </Text>
                </div>
                <Button href={route('admin.paths.create')}>
                    <PlusIcon data-slot="icon" />
                    New path
                </Button>
            </div>

            <div className="mt-8">
                <PathIndexStats total={stats.total} active={stats.active} enrollments={stats.enrollments} />
            </div>

            {paths.data.length === 0 ? (
                <div className="mt-10 rounded-xl border border-dashed border-zinc-300 p-12 text-center dark:border-zinc-600">
                    <Heading level={2}>No learning paths yet</Heading>
                    <Text className="mt-2">Create your first path to start building a curriculum for interns.</Text>
                    <Button className="mt-6" href={route('admin.paths.create')}>
                        <PlusIcon data-slot="icon" />
                        Create learning path
                    </Button>
                </div>
            ) : (
                <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {paths.data.map((path) => (
                        <PathCard key={path.id} path={path} />
                    ))}
                </div>
            )}
        </AppLayout>
    );
}
