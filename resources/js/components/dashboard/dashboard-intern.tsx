import { LearnContinueBanner } from '@/components/learning/learn-continue-banner';
import { LearnPathCard } from '@/components/learning/learn-path-card';
import { Button } from '@/components/catalyst/button';
import { type Enrollment, type LearningPath } from '@/types/learning';
import { AcademicCapIcon, ArrowRightIcon } from '@heroicons/react/20/solid';

interface DashboardInternPanelProps {
    enrollment: Enrollment | null;
    availablePaths: Pick<LearningPath, 'id' | 'name' | 'slug' | 'description'>[] | null;
}

export function DashboardInternPanel({ enrollment, availablePaths }: DashboardInternPanelProps) {
    if (enrollment) {
        return (
            <div className="space-y-6">
                <LearnContinueBanner enrollment={enrollment} />
                <div className="flex flex-wrap gap-3">
                    <Button href={route('learn.paths.index')} outline>
                        Browse all paths
                        <ArrowRightIcon data-slot="icon" />
                    </Button>
                </div>
            </div>
        );
    }

    const paths = availablePaths ?? [];

    return (
        <div className="space-y-6">
            <section className="overflow-hidden rounded-2xl border border-dashed border-zinc-300 bg-zinc-50/50 p-8 text-center dark:border-zinc-600 dark:bg-zinc-900/50 sm:p-10">
                <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg">
                    <AcademicCapIcon className="size-7" />
                </span>
                <h2 className="mt-5 text-lg font-semibold text-zinc-950 dark:text-white">Start your learning journey</h2>
                <p className="mx-auto mt-2 max-w-md text-sm text-zinc-500 dark:text-zinc-400">
                    Enroll in a structured learning path with lessons, videos, and quizzes. Complete levels in order to
                    advance through the program.
                </p>
                <Button href={route('learn.paths.index')} className="mt-6">
                    Browse learning paths
                    <ArrowRightIcon data-slot="icon" />
                </Button>
            </section>

            {paths.length > 0 && (
                <section>
                    <div className="mb-4">
                        <h2 className="text-sm font-semibold text-zinc-950 dark:text-white">Recommended paths</h2>
                        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                            {paths.length} published {paths.length === 1 ? 'path' : 'paths'} available to enroll
                        </p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {paths.slice(0, 3).map((path) => (
                            <LearnPathCard key={path.id} path={path as LearningPath} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
