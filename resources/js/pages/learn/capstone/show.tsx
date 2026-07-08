import { CapstoneNav } from '@/components/capstone/capstone-nav';
import { MilestoneTracker } from '@/components/capstone/milestone-tracker';
import { ProgressBar } from '@/components/learning/progress-bar';
import { Badge } from '@/components/catalyst/badge';
import { Button } from '@/components/catalyst/button';
import { Heading } from '@/components/catalyst/heading';
import { Text } from '@/components/catalyst/text';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { CapstoneProject, CapstoneProjectStats, CapstoneTemplate } from '@/types/capstone';
import { RocketLaunchIcon, Squares2X2Icon } from '@heroicons/react/20/solid';
import { Head, router } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Learn', href: '/learn/paths' },
    { title: 'Capstone', href: '/learn/capstone' },
];

interface Props {
    project: { data: CapstoneProject } | null;
    project_stats: CapstoneProjectStats | null;
    templates: { data: CapstoneTemplate[] } | null;
    can_start: boolean;
}

export default function CapstoneShow({ project: projectProp, project_stats, templates, can_start }: Props) {
    const project = projectProp?.data ?? null;
    const templateList = templates?.data ?? [];

    const startProject = (templateId: number) => {
        router.post(route('learn.capstone.start'), { template_id: templateId });
    };

    if (!project) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Capstone" />
                <section className="rounded-2xl border border-zinc-950/10 bg-gradient-to-br from-indigo-50 via-white to-brand-50 p-6 dark:border-white/10 dark:from-indigo-950/20 dark:via-zinc-900 dark:to-brand-950/20 sm:p-8">
                    <Badge color="violet">Level 20</Badge>
                    <Heading className="mt-3">Capstone project</Heading>
                    <Text className="mt-2 max-w-2xl">
                        Choose a template to kick off your final project. Track tasks on a kanban board, log daily
                        progress, and earn mentor sign-off on each milestone.
                    </Text>
                </section>

                {can_start && templateList.length > 0 && (
                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                        {templateList.map((template) => (
                            <article
                                key={template.id}
                                className="rounded-xl border border-zinc-950/10 bg-white p-5 dark:border-white/10 dark:bg-zinc-900"
                            >
                                <div className="flex items-start gap-3">
                                    <span className="flex size-10 items-center justify-center rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400">
                                        <RocketLaunchIcon className="size-5" />
                                    </span>
                                    <div>
                                        <h2 className="text-sm font-semibold text-zinc-950 dark:text-white">{template.name}</h2>
                                        <p className="mt-1 text-xs text-zinc-500">{template.estimated_weeks} weeks · {template.milestones?.length ?? 0} milestones</p>
                                    </div>
                                </div>
                                <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-300">{template.description}</p>
                                <Button className="mt-4" onClick={() => startProject(template.id)}>
                                    Start this project
                                </Button>
                            </article>
                        ))}
                    </div>
                )}
            </AppLayout>
        );
    }

    const milestones = project.milestones ?? [];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Capstone" />

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <Heading>{project.title}</Heading>
                    <Text className="mt-1">{project.description}</Text>
                </div>
                <CapstoneNav current="overview" />
            </div>

            {project_stats && (
                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-xl border border-zinc-950/10 bg-white p-4 dark:border-white/10 dark:bg-zinc-900 sm:col-span-2">
                        <div className="mb-2 flex justify-between text-xs text-zinc-500">
                            <span>Milestone progress</span>
                            <span>{project_stats.milestones_approved}/{project_stats.milestones_total} approved</span>
                        </div>
                        <ProgressBar percentage={project_stats.progress} variant="accent" />
                    </div>
                    <div className="rounded-xl border border-zinc-950/10 bg-white p-4 dark:border-white/10 dark:bg-zinc-900">
                        <p className="text-[10px] font-semibold tracking-wide text-zinc-500 uppercase">Tasks done</p>
                        <p className="mt-1 text-2xl font-bold tabular-nums text-zinc-950 dark:text-white">
                            {project_stats.tasks_done}
                            <span className="text-sm font-normal text-zinc-400"> / {project_stats.tasks_total}</span>
                        </p>
                        <Button href={route('learn.capstone.board')} outline className="mt-3 !text-xs">
                            <Squares2X2Icon data-slot="icon" />
                            Open board
                        </Button>
                    </div>
                </div>
            )}

            <section className="mt-8">
                <h2 className="mb-3 text-sm font-semibold text-zinc-950 dark:text-white">Milestones</h2>
                <MilestoneTracker milestones={milestones} />
            </section>
        </AppLayout>
    );
}
