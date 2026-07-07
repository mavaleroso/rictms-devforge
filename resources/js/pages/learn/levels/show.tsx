import { Badge } from '@/components/catalyst/badge';
import { Button } from '@/components/catalyst/button';
import { LearnCourseSidebar } from '@/components/learning/learn-course-sidebar';
import { MaterialViewer } from '@/components/learning/material-viewer';
import { VideoPlayer } from '@/components/learning/video-player';
import { levelStatus, progressStatusColor, progressStatusLabel } from '@/lib/learn-status';
import { formatDuration } from '@/lib/path-icons';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { type Enrollment, type LearningPath, type Level } from '@/types/learning';
import { CheckCircleIcon, QuestionMarkCircleIcon } from '@heroicons/react/20/solid';
import { Head, usePage } from '@inertiajs/react';

interface Props {
    path: { data: LearningPath };
    level: { data: Level };
    enrollment: { data: Enrollment } | null;
}

export default function LearnLevelsShow({ path: pathProp, level: levelProp, enrollment }: Props) {
    const path = pathProp.data;
    const level = levelProp.data;
    const enrolled = enrollment?.data ?? null;
    const levels = path.levels ?? [];
    const { flash } = usePage<SharedData & { flash?: { quiz_result?: { score: number; passed: boolean } } }>().props;

    const status = levelStatus(level);
    const featuredVideo = level.videos?.[0];
    const otherVideos = level.videos?.slice(1) ?? [];

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'My learning', href: '/learn/paths' },
        { title: path.name, href: route('learn.paths.show', path.id) },
        { title: `Level ${level.number}`, href: route('learn.levels.show', [path.id, level.id]) },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${level.title} — ${path.name}`} />

            <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_20rem]">
                <div className="min-w-0 space-y-6">
                    <header>
                        <p className="text-sm font-medium text-violet-600 dark:text-violet-400">
                            Level {level.number} of {levels.length}
                        </p>
                        <h1 className="mt-1 text-2xl font-bold tracking-tight text-zinc-950 dark:text-white sm:text-3xl">{level.title}</h1>
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                            <Badge color={progressStatusColor[status]}>{progressStatusLabel[status]}</Badge>
                            <Badge color="zinc">{level.difficulty}</Badge>
                            <span className="text-sm text-zinc-500">{formatDuration(level.estimated_minutes)}</span>
                        </div>
                    </header>

                    {flash?.quiz_result && (
                        <div
                            className={
                                flash.quiz_result.passed
                                    ? 'rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-950/30 dark:text-emerald-200'
                                    : 'rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-500/30 dark:bg-amber-950/30 dark:text-amber-200'
                            }
                        >
                            Quiz result: {flash.quiz_result.score}% — {flash.quiz_result.passed ? 'Passed! Next level unlocked.' : 'Not passed yet. Review materials and try again.'}
                        </div>
                    )}

                    {(level.overview || level.objectives) && (
                        <section className="rounded-xl border border-zinc-950/10 bg-white p-5 dark:border-white/10 dark:bg-zinc-900">
                            <h2 className="font-semibold text-zinc-950 dark:text-white">About this level</h2>
                            {level.overview && <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">{level.overview}</p>}
                            {level.objectives && (
                                <div className="mt-4">
                                    <p className="text-xs font-semibold tracking-wide text-zinc-500 uppercase">Objectives</p>
                                    <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-600 dark:text-zinc-300">{level.objectives}</p>
                                </div>
                            )}
                        </section>
                    )}

                    {featuredVideo && <VideoPlayer video={featuredVideo} featured />}

                    {level.materials && level.materials.length > 0 && (
                        <section className="space-y-4">
                            <h2 className="text-lg font-semibold text-zinc-950 dark:text-white">Readings</h2>
                            {level.materials.map((material) => (
                                <MaterialViewer key={material.id} material={material} />
                            ))}
                        </section>
                    )}

                    {otherVideos.length > 0 && (
                        <section className="space-y-4">
                            <h2 className="text-lg font-semibold text-zinc-950 dark:text-white">More videos</h2>
                            {otherVideos.map((video) => (
                                <VideoPlayer key={video.id} video={video} />
                            ))}
                        </section>
                    )}

                    {level.quiz && (
                        <section className="rounded-xl border border-violet-500/20 bg-gradient-to-br from-violet-50 to-white p-6 dark:from-violet-950/30 dark:to-zinc-900">
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div className="flex gap-3">
                                    <span className="flex size-10 items-center justify-center rounded-lg bg-violet-500/15 text-violet-600 dark:text-violet-400">
                                        <QuestionMarkCircleIcon className="size-6" />
                                    </span>
                                    <div>
                                        <h2 className="font-semibold text-zinc-950 dark:text-white">{level.quiz.title}</h2>
                                        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
                                            Pass with {level.quiz.passing_score}% · {level.quiz.attempts_used ?? 0}/{level.quiz.max_attempts} attempts used
                                        </p>
                                        {level.quiz.passed && (
                                            <p className="mt-2 flex items-center gap-1 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                                                <CheckCircleIcon className="size-4" />
                                                Quiz passed
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <Button href={route('learn.quizzes.show', level.quiz.id)} color={level.quiz.passed ? undefined : 'dark/zinc'} outline={level.quiz.passed}>
                                    {level.quiz.passed ? 'Review quiz' : 'Take quiz'}
                                </Button>
                            </div>
                        </section>
                    )}
                </div>

                {levels.length > 0 && (
                    <LearnCourseSidebar
                        pathId={path.id}
                        pathName={path.name}
                        levels={levels}
                        currentLevelId={level.id}
                        enrollment={enrolled}
                    />
                )}
            </div>
        </AppLayout>
    );
}
