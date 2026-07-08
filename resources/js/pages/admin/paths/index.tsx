import { PathCard, PathIndexStats, PathTable } from '@/components/admin/path-card';
import { Button } from '@/components/catalyst/button';
import { Heading } from '@/components/catalyst/heading';
import { Text } from '@/components/catalyst/text';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type LearningPath, type PaginatedCollection } from '@/types/learning';
import { Bars3Icon, PlusIcon, Squares2X2Icon } from '@heroicons/react/20/solid';
import { Head } from '@inertiajs/react';
import clsx from 'clsx';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Learning Paths', href: '/admin/paths' },
];

const VIEW_STORAGE_KEY = 'admin.paths.viewMode';

type PathsViewMode = 'gallery' | 'table';

interface Props {
    paths: PaginatedCollection<LearningPath>;
    stats: {
        total: number;
        active: number;
        enrollments: number;
    };
}

function readStoredViewMode(): PathsViewMode {
    if (typeof window === 'undefined') {
        return 'gallery';
    }

    const stored = window.localStorage.getItem(VIEW_STORAGE_KEY);

    return stored === 'table' ? 'table' : 'gallery';
}

export default function AdminPathsIndex({ paths, stats }: Props) {
    const [viewMode, setViewMode] = useState<PathsViewMode>('gallery');

    useEffect(() => {
        setViewMode(readStoredViewMode());
    }, []);

    const switchView = (mode: PathsViewMode) => {
        setViewMode(mode);
        window.localStorage.setItem(VIEW_STORAGE_KEY, mode);
    };

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

            <div className="mt-6">
                <PathIndexStats total={stats.total} active={stats.active} enrollments={stats.enrollments} />
            </div>

            {paths.data.length === 0 ? (
                <div className="mt-8 rounded-xl border border-dashed border-slate-300 p-10 text-center dark:border-slate-700">
                    <Heading level={2}>No learning paths yet</Heading>
                    <Text className="mt-2">Create your first path to start building a curriculum for interns.</Text>
                    <Button className="mt-5" href={route('admin.paths.create')}>
                        <PlusIcon data-slot="icon" />
                        Create learning path
                    </Button>
                </div>
            ) : (
                <div className="mt-6 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {paths.data.length} {paths.data.length === 1 ? 'path' : 'paths'}
                        </p>
                        <div
                            className="inline-flex rounded-lg border border-slate-200/80 bg-white p-0.5 dark:border-slate-800 dark:bg-slate-900"
                            role="group"
                            aria-label="View mode"
                        >
                            <button
                                type="button"
                                onClick={() => switchView('gallery')}
                                aria-pressed={viewMode === 'gallery'}
                                className={clsx(
                                    'inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition',
                                    viewMode === 'gallery'
                                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                                        : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800',
                                )}
                            >
                                <Squares2X2Icon className="size-3.5" />
                                Gallery
                            </button>
                            <button
                                type="button"
                                onClick={() => switchView('table')}
                                aria-pressed={viewMode === 'table'}
                                className={clsx(
                                    'inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition',
                                    viewMode === 'table'
                                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                                        : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800',
                                )}
                            >
                                <Bars3Icon className="size-3.5" />
                                Table
                            </button>
                        </div>
                    </div>

                    {viewMode === 'gallery' ? (
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {paths.data.map((path) => (
                                <PathCard key={path.id} path={path} />
                            ))}
                        </div>
                    ) : (
                        <PathTable paths={paths.data} />
                    )}
                </div>
            )}
        </AppLayout>
    );
}
