import { CapstoneNav } from '@/components/capstone/capstone-nav';
import { MilestoneTracker } from '@/components/capstone/milestone-tracker';
import { ProgressBar } from '@/components/learning/progress-bar';
import { Badge } from '@/components/catalyst/badge';
import { Button } from '@/components/catalyst/button';
import { Heading } from '@/components/catalyst/heading';
import { Text } from '@/components/catalyst/text';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { CapstoneLevelStatus, CapstoneProject, CapstoneProjectStats, CapstoneTemplate } from '@/types/capstone';
import { RocketLaunchIcon, Squares2X2Icon } from '@heroicons/react/20/solid';
import { Head, router } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Learn', href: '/learn/paths' },
    { title: 'Capstone', href: '/learn/capstone' },
];

interface Props {
    project: { data: CapstoneProject } | null;
    project_stats: CapstoneProjectStats | null;
    level_status: CapstoneLevelStatus | null;
    next_action: string | null;
    templates: { data: CapstoneTemplate[] } | null;
    can_start: boolean;
    has_mentor: boolean;
}

export default function CapstoneShow({
    project: projectProp,
    project_stats,
    level_status,
    next_action,
    templates,
    can_start,
    has_mentor,
}: Props) {
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
                    {!has_mentor && (
                        <p className="mt-3 text-sm text-amber-700 dark:text-amber-300">
                            You do not have a mentor assigned yet. You can start a project, but mentor-reviewed milestones will be blocked until one is assigned.
                        </p>
                    )}
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
                                        <p className="mt-1 text-xs text-zinc-500">
                                            {template.estimated_weeks} weeks · {template.milestones?.length ?? 0} milestones
                                            {template.requires_kickoff ? ' · kickoff required' : ''}
                                        </p>
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
                    <div className="flex flex-wrap items-center gap-2">
                        <Heading>{project.title}</Heading>
                        <Badge color={project.status === 'completed' ? 'lime' : project.status === 'draft' ? 'amber' : 'zinc'}>
                            {project.status.replace('_', ' ')}
                        </Badge>
                    </div>
                    <Text className="mt-1">{project.description}</Text>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <CapstoneNav current="overview" />
                    {project.status !== 'completed' && project.status !== 'archived' && (
                        <Button
                            outline
                            className="!text-xs"
                            onClick={() => {
                                if (confirm('Archive this project? You can start a new template afterward.')) {
                                    router.post(route('learn.capstone.archive'));
                                }
                            }}
                        >
                            Archive
                        </Button>
                    )}
                </div>
            </div>

            {next_action && (
                <div className="mt-4 rounded-xl border border-brand-200/70 bg-brand-50/60 px-4 py-3 text-sm text-brand-900 dark:border-brand-500/30 dark:bg-brand-950/30 dark:text-brand-100">
                    <span className="font-semibold">What’s next: </span>
                    {next_action}
                </div>
            )}

            {project.needs_kickoff && (
                <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-500/30 dark:bg-amber-950/30 dark:text-amber-100">
                    Waiting for mentor kickoff approval. Milestone submissions stay locked until kickoff is approved.
                </div>
            )}

            {level_status && project.status === 'completed' && !level_status.is_complete && (
                <div className="mt-4 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm text-violet-900 dark:border-violet-500/30 dark:bg-violet-950/30 dark:text-violet-100">
                    Capstone milestones are approved. Finish any remaining Level {level_status.level_number} materials, quiz, or challenges to complete the learning path.
                </div>
            )}

            {project_stats && (
                <div className="mt-6 grid gap-4 sm:grid-cols-4">
                    <div className="rounded-xl border border-zinc-950/10 bg-white p-4 dark:border-white/10 dark:bg-zinc-900 sm:col-span-2">
                        <div className="mb-2 flex justify-between text-xs text-zinc-500">
                            <span>Milestone progress</span>
                            <span>
                                {project_stats.milestones_approved}/{project_stats.milestones_total} approved
                            </span>
                        </div>
                        <ProgressBar percentage={project_stats.progress} variant="accent" />
                        {project_stats.active_milestone_title && (
                            <p className="mt-2 text-xs text-zinc-500">Active: {project_stats.active_milestone_title}</p>
                        )}
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
                    <div className="rounded-xl border border-zinc-950/10 bg-white p-4 dark:border-white/10 dark:bg-zinc-900">
                        <p className="text-[10px] font-semibold tracking-wide text-zinc-500 uppercase">Pace</p>
                        <p className="mt-1 text-2xl font-bold tabular-nums text-zinc-950 dark:text-white">
                            {project_stats.elapsed_weeks ?? 0}
                            <span className="text-sm font-normal text-zinc-400"> / {project_stats.estimated_weeks ?? 4} wks</span>
                        </p>
                        <p className="mt-2 text-xs text-zinc-500">{project_stats.hours_logged ?? 0}h journaled</p>
                    </div>
                </div>
            )}

            <section className="mt-8">
                <h2 className="mb-3 text-sm font-semibold text-zinc-950 dark:text-white">Milestones</h2>
                <MilestoneTracker
                    milestones={milestones}
                    hasMentor={has_mentor}
                    projectActive={project.status === 'active'}
                />
            </section>
        </AppLayout>
    );
}
