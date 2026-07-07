import { LearnCurriculum } from '@/components/learning/learn-curriculum';
import { LearnPathHero } from '@/components/learning/learn-path-hero';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type Enrollment, type LearningPath } from '@/types/learning';
import { Head } from '@inertiajs/react';

interface Props {
    path: { data: LearningPath };
    enrollment: { data: Enrollment } | null;
}

export default function LearnPathsShow({ path: pathProp, enrollment }: Props) {
    const path = pathProp.data;
    const enrolled = enrollment?.data ?? null;
    const levels = path.levels ?? [];

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'My learning', href: '/learn/paths' },
        { title: path.name, href: route('learn.paths.show', path.id) },
    ];

    const openLevelId = enrolled?.current_level?.id;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={path.name} />

            <LearnPathHero path={path} enrollment={enrolled} />

            {enrolled && levels.length > 0 && (
                <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
                    <LearnCurriculum pathId={path.id} levels={levels} defaultOpenLevelId={openLevelId} />

                    <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
                        <div className="rounded-xl border border-zinc-950/10 bg-zinc-50 p-5 dark:border-white/10 dark:bg-zinc-800/40">
                            <h3 className="font-semibold text-zinc-950 dark:text-white">How it works</h3>
                            <ol className="mt-3 list-decimal space-y-2 pl-4 text-sm text-zinc-600 dark:text-zinc-300">
                                <li>Complete readings and videos in each level</li>
                                <li>Pass the level quiz to unlock the next section</li>
                                <li>Track progress from your dashboard anytime</li>
                            </ol>
                        </div>
                        {path.description && (
                            <div className="rounded-xl border border-zinc-950/10 bg-white p-5 dark:border-white/10 dark:bg-zinc-900">
                                <h3 className="font-semibold text-zinc-950 dark:text-white">About this path</h3>
                                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">{path.description}</p>
                            </div>
                        )}
                    </aside>
                </div>
            )}

            {!enrolled && path.description && (
                <div className="mt-10 rounded-xl border border-zinc-950/10 bg-white p-6 dark:border-white/10 dark:bg-zinc-900">
                    <h2 className="text-lg font-semibold text-zinc-950 dark:text-white">What you&apos;ll learn</h2>
                    <p className="mt-3 text-zinc-600 dark:text-zinc-300">{path.description}</p>
                </div>
            )}
        </AppLayout>
    );
}
