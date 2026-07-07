import { LevelEditor } from '@/components/admin/level-editor';
import { PathIconBadge } from '@/components/admin/path-icon';
import { Badge } from '@/components/catalyst/badge';
import { Button } from '@/components/catalyst/button';
import { Heading, Subheading } from '@/components/catalyst/heading';
import { Text } from '@/components/catalyst/text';
import { formatDuration } from '@/lib/path-icons';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type LearningPath, type Level } from '@/types/learning';
import { ArrowLeftIcon, ClockIcon } from '@heroicons/react/20/solid';
import { Head } from '@inertiajs/react';

interface Props {
    path: Pick<LearningPath, 'id' | 'name' | 'slug' | 'icon'>;
    level: { data: Level };
}

const difficultyColors: Record<string, 'lime' | 'amber' | 'orange' | 'zinc'> = {
    beginner: 'lime',
    intermediate: 'amber',
    advanced: 'orange',
};

export default function AdminLevelsEdit({ path, level: levelProp }: Props) {
    const level = levelProp.data;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Learning Paths', href: '/admin/paths' },
        { title: path.name, href: route('admin.paths.edit', path.id) },
        { title: `Level ${level.number}`, href: route('admin.levels.edit', [path.id, level.id]) },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Level ${level.number} — ${path.name}`} />

            <Button href={route('admin.paths.edit', path.id)} plain className="mb-4">
                <ArrowLeftIcon data-slot="icon" />
                Back to curriculum
            </Button>

            <div className="flex flex-col gap-6 rounded-xl border border-zinc-950/10 bg-zinc-50 p-6 dark:border-white/10 dark:bg-zinc-800/40 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex gap-4">
                    <PathIconBadge icon={path.icon} />
                    <div>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">{path.name}</p>
                        <div className="mt-1 flex flex-wrap items-center gap-3">
                            <Heading level={2}>
                                Level {level.number}: {level.title}
                            </Heading>
                            <Badge color={difficultyColors[level.difficulty] ?? 'zinc'}>{level.difficulty}</Badge>
                        </div>
                        <div className="mt-2 flex items-center gap-1 text-sm text-zinc-500 dark:text-zinc-400">
                            <ClockIcon className="size-4" />
                            {formatDuration(level.estimated_minutes)} estimated
                        </div>
                    </div>
                </div>
                <div className="text-sm text-zinc-500 dark:text-zinc-400">
                    <Subheading level={3} className="text-zinc-950 dark:text-white">
                        Content editor
                    </Subheading>
                    <Text className="mt-1">Manage overview, materials, videos, and quiz for this level.</Text>
                </div>
            </div>

            <div className="mt-8">
                <LevelEditor path={path} level={level} />
            </div>
        </AppLayout>
    );
}
