import { PathIconBadge } from '@/components/admin/path-icon';
import { Badge } from '@/components/catalyst/badge';
import { Button } from '@/components/catalyst/button';
import { ProgressBar } from '@/components/learning/progress-bar';
import { formatDuration } from '@/lib/path-icons';
import type { Enrollment, LearningPath } from '@/types/learning';
import { AcademicCapIcon, ClockIcon, PlayIcon } from '@heroicons/react/20/solid';
import { router } from '@inertiajs/react';

interface LearnPathHeroProps {
    path: LearningPath;
    enrollment: Enrollment | null;
}

export function LearnPathHero({ path, enrollment }: LearnPathHeroProps) {
    const levels = path.levels?.length ?? path.levels_count ?? 0;
    const duration = path.total_estimated_minutes ?? path.levels?.reduce((sum, l) => sum + l.estimated_minutes, 0) ?? 0;

    return (
        <section className="overflow-hidden rounded-2xl border border-zinc-950/10 bg-zinc-900 text-white dark:border-white/10">
            <div className="relative">
                {path.cover_image_url ? (
                    <>
                        <img src={path.cover_image_url} alt="" className="h-48 w-full object-cover sm:h-56 lg:h-64" />
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-zinc-950/20" />
                    </>
                ) : (
                    <div className="flex h-48 items-center justify-center bg-gradient-to-br from-violet-900 to-zinc-900 sm:h-56">
                        <PathIconBadge icon={path.icon} className="size-20" />
                    </div>
                )}
                <div className="relative px-6 pb-6 sm:px-8 sm:pb-8">
                    {!path.cover_image_url && (
                        <div className="mb-4">
                            <PathIconBadge icon={path.icon} className="size-14" />
                        </div>
                    )}
                    <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">{path.name}</h1>
                    <div className="mt-3 flex flex-wrap gap-2">
                        <Badge color="zinc" className="bg-white/10 text-white ring-white/20">
                            <AcademicCapIcon className="size-3" />
                            {levels} levels
                        </Badge>
                        {duration > 0 && (
                            <Badge color="zinc" className="bg-white/10 text-white ring-white/20">
                                <ClockIcon className="size-3" />
                                {formatDuration(duration)}
                            </Badge>
                        )}
                    </div>
                    {path.description && <p className="mt-4 max-w-3xl text-sm text-zinc-300 sm:text-base">{path.description}</p>}
                </div>
            </div>

            <div className="border-t border-white/10 bg-zinc-950/50 px-6 py-5 sm:px-8">
                {!enrollment ? (
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-zinc-300">Enroll to unlock levels sequentially and track your progress.</p>
                        <Button color="white" onClick={() => router.post(route('learn.paths.enroll', path.id))}>
                            Enroll for free
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="max-w-md flex-1">
                            <ProgressBar percentage={enrollment.progress_percentage} label="Your progress" variant="accent" />
                        </div>
                        {enrollment.current_level && (
                            <Button href={route('learn.levels.show', [path.id, enrollment.current_level.id])} color="white">
                                <PlayIcon data-slot="icon" />
                                Continue — Level {enrollment.current_level.number}
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}
