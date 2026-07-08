import { PathIconBadge } from '@/components/admin/path-icon';
import { Badge } from '@/components/catalyst/badge';
import { Button } from '@/components/catalyst/button';
import { Subheading } from '@/components/catalyst/heading';
import { Text } from '@/components/catalyst/text';
import { useCoverImagePreview } from '@/hooks/use-cover-image-preview';
import { formatDuration } from '@/lib/path-icons';
import { type LearningPath } from '@/types/learning';
import { AcademicCapIcon, BookOpenIcon, CheckCircleIcon, ClockIcon, FilmIcon, PencilSquareIcon, UsersIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';

interface PathCurriculumProps {
    path: LearningPath;
}

const difficultyColors: Record<string, 'lime' | 'amber' | 'orange' | 'zinc'> = {
    beginner: 'lime',
    intermediate: 'amber',
    advanced: 'orange',
};

export function PathCurriculum({ path }: PathCurriculumProps) {
    const levels = path.levels ?? [];

    if (levels.length === 0) {
        return (
            <div className="rounded-xl border border-dashed border-zinc-300 p-10 text-center dark:border-zinc-600">
                <AcademicCapIcon className="mx-auto size-10 text-zinc-400" />
                <Subheading className="mt-4">No levels yet</Subheading>
                <Text className="mt-2">Levels are seeded with the path. Contact engineering if this path is missing curriculum.</Text>
            </div>
        );
    }

    return (
        <ol className="space-y-3">
            {levels.map((level, index) => {
                const materials = level.materials_count ?? level.materials?.length ?? 0;
                const videos = level.videos_count ?? level.videos?.length ?? 0;
                const questions = level.quiz?.questions_count ?? level.quiz?.questions?.length ?? 0;
                const hasQuiz = !!level.quiz;

                return (
                    <li key={level.id}>
                        <div
                            className={clsx(
                                'group relative flex gap-4 rounded-xl border border-zinc-950/10 bg-white p-4 transition dark:border-white/10 dark:bg-zinc-900',
                                'hover:border-zinc-950/20 hover:shadow-sm dark:hover:border-white/20',
                            )}
                        >
                            <div className="flex flex-col items-center">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-zinc-950 text-sm font-semibold text-white dark:bg-white dark:text-zinc-950">
                                    {level.number}
                                </div>
                                {index < levels.length - 1 && <div className="mt-2 w-px flex-1 bg-zinc-200 dark:bg-zinc-700" aria-hidden />}
                            </div>

                            <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="font-semibold text-zinc-950 dark:text-white">{level.title}</p>
                                        <div className="mt-1.5 flex flex-wrap items-center gap-2">
                                            <Badge color={difficultyColors[level.difficulty] ?? 'zinc'}>{level.difficulty}</Badge>
                                            <span className="inline-flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
                                                <ClockIcon className="size-3.5" />
                                                {formatDuration(level.estimated_minutes)}
                                            </span>
                                        </div>
                                    </div>
                                    <Button href={route('admin.levels.edit', [path.id, level.id])} outline className="shrink-0">
                                        <PencilSquareIcon data-slot="icon" />
                                        Edit content
                                    </Button>
                                </div>

                                <div className="mt-3 flex flex-wrap gap-3 text-xs text-zinc-500 dark:text-zinc-400">
                                    <span className="inline-flex items-center gap-1">
                                        <BookOpenIcon className="size-3.5" />
                                        {materials} {materials === 1 ? 'material' : 'materials'}
                                    </span>
                                    <span className="inline-flex items-center gap-1">
                                        <FilmIcon className="size-3.5" />
                                        {videos} {videos === 1 ? 'video' : 'videos'}
                                    </span>
                                    <span className="inline-flex items-center gap-1">
                                        <CheckCircleIcon className={clsx('size-3.5', hasQuiz ? 'text-emerald-500' : 'text-zinc-400')} />
                                        {hasQuiz ? `${questions} quiz questions` : 'No quiz'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </li>
                );
            })}
        </ol>
    );
}

interface PathPreviewCardProps {
    name: string;
    description: string;
    icon: string;
    isActive: boolean;
    levelsCount?: number;
    coverUrl?: string | null;
    coverPreviewFile?: File | null;
}

export function PathPreviewCard({ name, description, icon, isActive, levelsCount, coverUrl, coverPreviewFile }: PathPreviewCardProps) {
    const imageUrl = useCoverImagePreview(coverPreviewFile ?? null, coverUrl ?? null);

    return (
        <div className="rounded-xl border border-zinc-950/10 bg-zinc-50 p-5 dark:border-white/10 dark:bg-zinc-800/50">
            <p className="text-xs font-semibold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">Catalog preview</p>
            {imageUrl && <img src={imageUrl} alt="" className="mt-4 aspect-video w-full rounded-lg object-cover" />}
            <div className={imageUrl ? 'mt-4 flex gap-4' : 'mt-4 flex gap-4'}>
                {!imageUrl && <PathIconBadge icon={icon} />}
                <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                        <p className="font-semibold text-zinc-950 dark:text-white">{name || 'Untitled path'}</p>
                        <Badge color={isActive ? 'green' : 'zinc'}>{isActive ? 'Published' : 'Draft'}</Badge>
                    </div>
                    <p className="mt-2 line-clamp-3 text-sm text-zinc-500 dark:text-zinc-400">
                        {description || 'Add a description to help interns understand what they will learn.'}
                    </p>
                    {levelsCount !== undefined && <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">{levelsCount} levels</p>}
                </div>
            </div>
        </div>
    );
}

interface PathStatsGridProps {
    levelsCount: number;
    enrollmentsCount: number;
    totalMinutes: number;
    isActive: boolean;
}

export function PathStatsGrid({ levelsCount, enrollmentsCount, totalMinutes, isActive }: PathStatsGridProps) {
    const stats = [
        { label: 'Levels', value: String(levelsCount), icon: AcademicCapIcon },
        { label: 'Enrolled', value: String(enrollmentsCount), icon: UsersIcon },
        { label: 'Duration', value: formatDuration(totalMinutes), icon: ClockIcon },
        { label: 'Status', value: isActive ? 'Published' : 'Draft', icon: CheckCircleIcon },
    ];

    return (
        <div className="grid gap-3 sm:grid-cols-2">
            {stats.map((stat) => (
                <div key={stat.label} className="rounded-xl border border-zinc-950/10 bg-white p-4 dark:border-white/10 dark:bg-zinc-900">
                    <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                        <stat.icon className="size-4" />
                        <span className="text-xs font-medium">{stat.label}</span>
                    </div>
                    <p className="mt-2 text-lg font-semibold text-zinc-950 dark:text-white">{stat.value}</p>
                </div>
            ))}
        </div>
    );
}
