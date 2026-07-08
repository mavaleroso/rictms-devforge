import { PathIconBadge } from '@/components/admin/path-icon';
import { Badge } from '@/components/catalyst/badge';
import { Button } from '@/components/catalyst/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/catalyst/table';
import { formatDuration } from '@/lib/path-icons';
import { surfaces } from '@/lib/theme';
import { type LearningPath } from '@/types/learning';
import { AcademicCapIcon, ArrowRightIcon, ClockIcon, UsersIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';

interface PathCardProps {
    path: LearningPath;
}

export function PathCard({ path }: PathCardProps) {
    const levels = path.levels_count ?? 0;
    const enrolled = path.enrollments_count ?? 0;

    return (
        <article
            className={clsx(
                'group flex h-full flex-col overflow-hidden transition hover:border-slate-300 hover:shadow-sm dark:hover:border-slate-700',
                surfaces.card,
            )}
        >
            {path.cover_image_url ? (
                <img src={path.cover_image_url} alt="" className="aspect-[16/7] w-full object-cover" />
            ) : (
                <div className="flex aspect-[16/7] items-center justify-center bg-slate-100 dark:bg-slate-800/80">
                    <PathIconBadge icon={path.icon} className="size-9 rounded-lg" />
                </div>
            )}

            <div className="flex flex-1 flex-col gap-2.5 p-3.5">
                <div className="flex items-start justify-between gap-2">
                    <h3 className="line-clamp-2 text-sm font-semibold text-slate-900 dark:text-white">{path.name}</h3>
                    <Badge color={path.is_active ? 'lime' : 'zinc'} className="shrink-0 !text-[10px]">
                        {path.is_active ? 'Live' : 'Draft'}
                    </Badge>
                </div>

                <p className="line-clamp-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                    {path.description ?? 'No description yet.'}
                </p>

                <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="inline-flex items-center gap-1">
                        <AcademicCapIcon className="size-3.5" />
                        {levels} {levels === 1 ? 'level' : 'levels'}
                    </span>
                    <span className="inline-flex items-center gap-1">
                        <UsersIcon className="size-3.5" />
                        {enrolled}
                    </span>
                    {path.total_estimated_minutes !== undefined && path.total_estimated_minutes > 0 && (
                        <span className="inline-flex items-center gap-1">
                            <ClockIcon className="size-3.5" />
                            {formatDuration(path.total_estimated_minutes)}
                        </span>
                    )}
                </div>

                <div className="flex items-center justify-between gap-2 border-t border-slate-200/70 pt-2.5 dark:border-slate-800">
                    <code className="truncate text-[10px] text-slate-400">{path.slug}</code>
                    <Button href={route('admin.paths.edit', path.id)} outline className="!px-2.5 !py-1 !text-xs">
                        Manage
                        <ArrowRightIcon data-slot="icon" className="!size-3.5" />
                    </Button>
                </div>
            </div>
        </article>
    );
}

interface PathTableProps {
    paths: LearningPath[];
}

export function PathTable({ paths }: PathTableProps) {
    return (
        <div className={clsx('overflow-hidden', surfaces.card)}>
            <Table dense striped className="[--gutter:theme(spacing.4)]">
                <TableHead>
                    <TableRow>
                        <TableHeader>Path</TableHeader>
                        <TableHeader>Status</TableHeader>
                        <TableHeader>Levels</TableHeader>
                        <TableHeader>Enrolled</TableHeader>
                        <TableHeader>Duration</TableHeader>
                        <TableHeader className="text-right">Actions</TableHeader>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {paths.map((path) => {
                        const levels = path.levels_count ?? 0;
                        const enrolled = path.enrollments_count ?? 0;

                        return (
                            <TableRow key={path.id} href={route('admin.paths.edit', path.id)} title={`Manage ${path.name}`}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        {path.cover_image_url ? (
                                            <img
                                                src={path.cover_image_url}
                                                alt=""
                                                className="size-9 shrink-0 rounded-lg object-cover ring-1 ring-slate-200/80 dark:ring-slate-700"
                                            />
                                        ) : (
                                            <PathIconBadge icon={path.icon} className="size-9 rounded-lg" />
                                        )}
                                        <div className="min-w-0">
                                            <p className="truncate font-medium text-slate-900 dark:text-white">{path.name}</p>
                                            <p className="truncate text-xs text-slate-500 dark:text-slate-400">{path.slug}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge color={path.is_active ? 'lime' : 'zinc'} className="!text-[10px]">
                                        {path.is_active ? 'Live' : 'Draft'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-slate-600 dark:text-slate-300">{levels}</TableCell>
                                <TableCell className="text-slate-600 dark:text-slate-300">{enrolled}</TableCell>
                                <TableCell className="text-slate-600 dark:text-slate-300">
                                    {path.total_estimated_minutes && path.total_estimated_minutes > 0
                                        ? formatDuration(path.total_estimated_minutes)
                                        : '—'}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button href={route('admin.paths.edit', path.id)} plain className="!text-xs">
                                        Manage
                                        <ArrowRightIcon data-slot="icon" className="!size-3.5" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
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
        <div className="grid gap-3 sm:grid-cols-3">
            {items.map((item) => (
                <div key={item.label} className={clsx('px-4 py-3', surfaces.cardMuted)}>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{item.label}</p>
                    <p className="mt-0.5 text-xl font-semibold text-slate-900 dark:text-white">{item.value}</p>
                </div>
            ))}
        </div>
    );
}
