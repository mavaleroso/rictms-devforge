import { PathIconBadge } from '@/components/admin/path-icon';
import { formatDuration } from '@/lib/path-icons';
import { Badge } from '@/components/catalyst/badge';
import { Button } from '@/components/catalyst/button';
import { Subheading } from '@/components/catalyst/heading';
import { Text } from '@/components/catalyst/text';
import { type LearningPath } from '@/types/learning';
import { AcademicCapIcon, ArrowRightIcon, UsersIcon } from '@heroicons/react/20/solid';

interface PathCardProps {
    path: LearningPath;
}

export function PathCard({ path }: PathCardProps) {
    const levels = path.levels_count ?? 0;
    const enrolled = path.enrollments_count ?? 0;

    return (
        <article className="flex h-full flex-col overflow-hidden rounded-xl border border-zinc-950/10 bg-white transition hover:border-zinc-950/20 hover:shadow-md dark:border-white/10 dark:bg-zinc-900 dark:hover:border-white/20">
            {path.cover_image_url ? (
                <img src={path.cover_image_url} alt="" className="aspect-[2/1] w-full object-cover" />
            ) : (
                <div className="flex aspect-[2/1] items-center justify-center bg-zinc-100 dark:bg-zinc-800">
                    <PathIconBadge icon={path.icon} className="size-14" />
                </div>
            )}
            <div className="flex flex-1 flex-col p-5">
            <div className="flex items-start gap-4">
                <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                        <Subheading level={3} className="line-clamp-2">
                            {path.name}
                        </Subheading>
                        <Badge color={path.is_active ? 'green' : 'zinc'}>{path.is_active ? 'Live' : 'Draft'}</Badge>
                    </div>
                    <Text className="mt-2 line-clamp-2">{path.description ?? 'No description yet.'}</Text>
                </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-3 text-xs text-zinc-500 dark:text-zinc-400">
                <span className="inline-flex items-center gap-1">
                    <AcademicCapIcon className="size-3.5" />
                    {levels} {levels === 1 ? 'level' : 'levels'}
                </span>
                <span className="inline-flex items-center gap-1">
                    <UsersIcon className="size-3.5" />
                    {enrolled} enrolled
                </span>
                {path.total_estimated_minutes !== undefined && path.total_estimated_minutes > 0 && (
                    <span>{formatDuration(path.total_estimated_minutes)} total</span>
                )}
            </div>

            <div className="mt-auto flex items-center justify-between gap-3 pt-5">
                <code className="truncate text-xs text-zinc-400">{path.slug}</code>
                <Button href={route('admin.paths.edit', path.id)} outline>
                    Manage
                    <ArrowRightIcon data-slot="icon" />
                </Button>
            </div>
            </div>
        </article>
    );
}

interface PathIndexStatsProps {
    total: number;
    active: number;
    enrollments: number;
}

export function PathIndexStats({ total, active, enrollments }: PathIndexStatsProps) {
    const items = [
        { label: 'Total paths', value: total },
        { label: 'Published', value: active },
        { label: 'Total enrollments', value: enrollments },
    ];

    return (
        <div className="grid gap-4 sm:grid-cols-3">
            {items.map((item) => (
                <div
                    key={item.label}
                    className="rounded-xl border border-zinc-950/10 bg-zinc-50 px-5 py-4 dark:border-white/10 dark:bg-zinc-800/40"
                >
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">{item.label}</p>
                    <p className="mt-1 text-2xl font-semibold text-zinc-950 dark:text-white">{item.value}</p>
                </div>
            ))}
        </div>
    );
}
