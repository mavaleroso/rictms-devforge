import { EnrollmentFormPanel } from '@/components/admin/enrollment-form-panel';
import { EnrollmentIndexStats } from '@/components/admin/enrollment-index-stats';
import { EnrollmentProgressBar, EnrollmentStatusBadge } from '@/components/admin/enrollment-status-badge';
import { Avatar } from '@/components/catalyst/avatar';
import { Heading } from '@/components/catalyst/heading';
import { Text } from '@/components/catalyst/text';
import { DataTableMetaText, ServerDataTable, type DataTableColumnMeta } from '@/components/data-table';
import { useInitials } from '@/hooks/use-initials';
import { formatDisplayName } from '@/lib/user-profile';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type Enrollment, type EnrollmentStatus, type LearningPath } from '@/types/learning';
import { AcademicCapIcon } from '@heroicons/react/20/solid';
import { Head } from '@inertiajs/react';
import { type ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Enrollments', href: '/admin/enrollments' },
];

interface PersonSummary {
    id: number;
    name: string;
    first_name?: string | null;
    middle_name?: string | null;
    last_name?: string | null;
    email?: string;
    avatar_url?: string | null;
}

interface AdminEnrollment extends Enrollment {
    user?: PersonSummary;
    mentor?: PersonSummary | null;
    learning_path?: LearningPath;
}

interface PersonOption extends PersonSummary {
    email: string;
}

interface Props {
    stats: {
        total: number;
        active: number;
        completed: number;
        with_mentor: number;
    };
    interns: PersonOption[];
    mentors: PersonOption[];
    paths: Pick<LearningPath, 'id' | 'name'>[];
}

function formatDate(value?: string | null): string {
    if (!value) {
        return '—';
    }

    return new Date(value).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

function useEnrollmentColumns(getInitials: (name: string) => string): ColumnDef<AdminEnrollment, unknown>[] {
    return useMemo(
        () => [
            {
                id: 'intern',
                header: 'Intern',
                enableSorting: false,
                cell: ({ row }) => {
                    const user = row.original.user;

                    if (!user) {
                        return '—';
                    }

                    const displayName = formatDisplayName(user);

                    return (
                        <div className="flex items-center gap-3">
                            <Avatar
                                src={user.avatar_url}
                                initials={getInitials(displayName)}
                                alt={displayName}
                                className="size-9 ring-1 ring-zinc-950/8 dark:ring-white/10"
                            />
                            <DataTableMetaText primary={displayName} secondary={user.email} />
                        </div>
                    );
                },
            },
            {
                id: 'path',
                header: 'Learning path',
                enableSorting: false,
                cell: ({ row }) => {
                    const path = row.original.learning_path;
                    const currentLevel = row.original.current_level;

                    return (
                        <DataTableMetaText
                            primary={path?.name ?? 'Unknown path'}
                            secondary={currentLevel ? `Current: Level ${currentLevel.number} · ${currentLevel.title}` : 'Not started yet'}
                        />
                    );
                },
            },
            {
                id: 'mentor',
                header: 'Mentor',
                enableSorting: false,
                cell: ({ row }) => {
                    const mentor = row.original.mentor;

                    if (!mentor) {
                        return <span className="text-xs text-zinc-400">Unassigned</span>;
                    }

                    const displayName = formatDisplayName(mentor);

                    return (
                        <div className="flex items-center gap-2.5">
                            <Avatar
                                src={mentor.avatar_url}
                                initials={getInitials(displayName)}
                                alt={displayName}
                                className="size-8 ring-1 ring-zinc-950/8 dark:ring-white/10"
                            />
                            <DataTableMetaText primary={displayName} secondary={mentor.email} />
                        </div>
                    );
                },
            },
            {
                id: 'progress',
                header: 'Progress',
                enableSorting: false,
                cell: ({ row }) => <EnrollmentProgressBar value={row.original.progress_percentage} />,
            },
            {
                id: 'status',
                header: 'Status',
                accessorKey: 'status',
                enableSorting: true,
                cell: ({ row }) => <EnrollmentStatusBadge status={row.original.status as EnrollmentStatus} />,
            },
            {
                id: 'started_at',
                header: 'Started',
                enableSorting: true,
                meta: { align: 'right', cellClassName: 'tabular-nums' } satisfies DataTableColumnMeta,
                cell: ({ row }) => (
                    <span className="text-xs text-zinc-600 dark:text-zinc-300">{formatDate(row.original.started_at)}</span>
                ),
            },
        ],
        [getInitials],
    );
}

export default function AdminEnrollmentsIndex({ stats, interns, mentors, paths }: Props) {
    const getInitials = useInitials();
    const columns = useEnrollmentColumns(getInitials);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Enrollments" />

            <section className="relative overflow-hidden rounded-2xl border border-zinc-950/10 bg-gradient-to-br from-zinc-50 via-white to-blue-50/50 p-6 shadow-sm sm:p-8 dark:border-white/10 dark:from-zinc-900 dark:via-zinc-900 dark:to-blue-950/30">
                <div
                    className="pointer-events-none absolute -top-24 -right-24 size-64 rounded-full bg-blue-400/10 blur-3xl dark:bg-blue-500/10"
                    aria-hidden
                />
                <div
                    className="pointer-events-none absolute -bottom-20 -left-16 size-48 rounded-full bg-violet-400/10 blur-3xl dark:bg-violet-500/10"
                    aria-hidden
                />

                <div className="relative flex items-start gap-4">
                    <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/25">
                        <AcademicCapIcon className="size-7" />
                    </div>
                    <div>
                        <Heading>Enrollments</Heading>
                        <Text className="mt-2 max-w-2xl">
                            Assign interns to learning paths, pair them with mentors, and monitor progress across the
                            program.
                        </Text>
                    </div>
                </div>
            </section>

            <div className="mt-8">
                <EnrollmentIndexStats stats={stats} />
            </div>

            <div className="mt-8">
                <EnrollmentFormPanel interns={interns} mentors={mentors} paths={paths} />
            </div>

            <div className="mt-8">
                <ServerDataTable
                    columns={columns}
                    queryKey="admin.enrollments.table"
                    fetchUrl={route('admin.enrollments.table')}
                    title="Enrollment records"
                    description="Track intern placements, mentor assignments, and completion progress."
                    searchPlaceholder="Search intern, path, or mentor..."
                    emptyTitle="No enrollments yet"
                    emptyDescription="Use the form above to enroll an intern in a published learning path."
                />
            </div>
        </AppLayout>
    );
}
