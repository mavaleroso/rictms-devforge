import { PathIconBadge } from '@/components/admin/path-icon';
import { Button } from '@/components/catalyst/button';
import { ProgressBar } from '@/components/learning/progress-bar';
import { formatDuration } from '@/lib/path-icons';
import type { Enrollment } from '@/types/learning';
import { PlayIcon } from '@heroicons/react/20/solid';

interface LearnContinueBannerProps {
    enrollment: Enrollment;
}

export function LearnContinueBanner({ enrollment }: LearnContinueBannerProps) {
    const path = enrollment.learning_path;
    const coverUrl = path?.cover_image_url;

    return (
        <section className="overflow-hidden rounded-2xl border border-zinc-950/10 bg-gradient-to-br from-violet-950 via-zinc-900 to-zinc-950 text-white shadow-lg dark:border-white/10">
            <div className="grid lg:grid-cols-[1fr_minmax(0,22rem)]">
                <div className="flex flex-col justify-center p-6 sm:p-8">
                    <p className="text-xs font-semibold tracking-widest text-violet-300 uppercase">Continue learning</p>
                    <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">{path?.name}</h2>
                    <p className="mt-2 max-w-lg text-sm text-zinc-300">
                        {enrollment.current_level
                            ? `Resume Level ${enrollment.current_level.number}: ${enrollment.current_level.title}`
                            : 'Pick up where you left off in your current path.'}
                    </p>
                    <div className="mt-6 max-w-sm">
                        <ProgressBar percentage={enrollment.progress_percentage} label="Course progress" variant="accent" />
                    </div>
                    {enrollment.current_level && path && (
                        <div className="mt-6">
                            <Button
                                href={route('learn.levels.show', [path.id, enrollment.current_level.id])}
                                color="white"
                            >
                                <PlayIcon data-slot="icon" />
                                Resume course
                            </Button>
                        </div>
                    )}
                </div>
                <div className="relative hidden min-h-[12rem] lg:block">
                    {coverUrl ? (
                        <img src={coverUrl} alt="" className="absolute inset-0 size-full object-cover opacity-90" />
                    ) : (
                        <div className="flex size-full items-center justify-center bg-violet-900/40">
                            <PathIconBadge icon={path?.icon} className="size-20" />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/40 to-transparent" />
                </div>
            </div>
        </section>
    );
}
