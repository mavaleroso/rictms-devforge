import { LearnContinueBanner } from '@/components/learning/learn-continue-banner';
import { LearnPathCard } from '@/components/learning/learn-path-card';
import { Heading } from '@/components/catalyst/heading';
import { Text } from '@/components/catalyst/text';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type Enrollment, type LearningPath, type PaginatedCollection } from '@/types/learning';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'My learning', href: '/learn/paths' },
];

interface Props {
    paths: PaginatedCollection<LearningPath>;
    enrollment: { data: Enrollment } | null;
}

export default function LearnPathsIndex({ paths, enrollment }: Props) {
    const active = enrollment?.data;
    const enrolledPathId = active?.learning_path?.id;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My learning" />

            <div className="mb-8">
                <Heading>My learning</Heading>
                <Text className="mt-2 max-w-2xl">
                    Browse structured paths with lessons, videos, and quizzes — complete levels in order to advance.
                </Text>
            </div>

            {active && (
                <div className="mb-10">
                    <LearnContinueBanner enrollment={active} />
                </div>
            )}

            <div>
                <h2 className="text-lg font-semibold text-zinc-950 dark:text-white">All courses</h2>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    {paths.data.length} {paths.data.length === 1 ? 'path' : 'paths'} available
                </p>
                <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {paths.data.map((path) => (
                        <LearnPathCard key={path.id} path={path} enrolled={path.id === enrolledPathId} />
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
