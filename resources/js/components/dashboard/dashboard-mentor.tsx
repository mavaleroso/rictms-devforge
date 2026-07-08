import { EnrollmentProgressBar, EnrollmentStatusBadge } from '@/components/admin/enrollment-status-badge';
import { Avatar } from '@/components/catalyst/avatar';
import { Button } from '@/components/catalyst/button';
import { DataTableMetaText } from '@/components/data-table';
import { useInitials } from '@/hooks/use-initials';
import { formatDisplayName } from '@/lib/user-profile';
import { type Enrollment, type EnrollmentStatus } from '@/types/learning';
import { ArrowRightIcon, UserGroupIcon } from '@heroicons/react/20/solid';

interface PersonSummary {
    id: number;
    name: string;
    first_name?: string | null;
    middle_name?: string | null;
    last_name?: string | null;
    email?: string;
    avatar_url?: string | null;
}

interface MentorEnrollment extends Enrollment {
    user?: PersonSummary;
    learning_path?: { id: number; name: string };
}

export interface DashboardMentorStats {
    assigned: number;
    in_progress: number;
    completed: number;
}

interface DashboardMentorPanelProps {
    stats: DashboardMentorStats;
    assignedInterns: MentorEnrollment[];
}

export function DashboardMentorPanel({ stats, assignedInterns }: DashboardMentorPanelProps) {
    const getInitials = useInitials();

    const statItems = [
        { label: 'Assigned interns', value: stats.assigned },
        { label: 'In progress', value: stats.in_progress },
        { label: 'Completed', value: stats.completed },
    ];

    return (
        <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
                {statItems.map((item) => (
                    <div
                        key={item.label}
                        className="rounded-2xl border border-zinc-950/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-900"
                    >
                        <p className="text-xs font-semibold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
                            {item.label}
                        </p>
                        <p className="mt-2 text-3xl font-semibold tabular-nums text-zinc-950 dark:text-white">{item.value}</p>
                    </div>
                ))}
            </div>

            <section className="overflow-hidden rounded-2xl border border-zinc-950/10 bg-white shadow-sm dark:border-white/10 dark:bg-zinc-900">
                <div className="flex items-center justify-between gap-4 border-b border-zinc-950/8 px-5 py-4 dark:border-white/8 sm:px-6">
                    <div className="flex items-center gap-3">
                        <span className="flex size-10 items-center justify-center rounded-xl bg-blue-600 text-white">
                            <UserGroupIcon className="size-5" />
                        </span>
                        <div>
                            <h2 className="text-sm font-semibold text-zinc-950 dark:text-white">Your interns</h2>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">Track progress across assigned learning paths</p>
                        </div>
                    </div>
                    <Button href={route('mentor.interns.index')} outline className="!text-xs">
                        View all
                        <ArrowRightIcon data-slot="icon" />
                    </Button>
                </div>

                {assignedInterns.length === 0 ? (
                    <div className="px-6 py-14 text-center">
                        <p className="text-sm font-medium text-zinc-950 dark:text-white">No interns assigned yet</p>
                        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                            When an admin enrolls an intern with you as mentor, they will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-zinc-950/5 dark:divide-white/5">
                        {assignedInterns.map((enrollment) => {
                            const user = enrollment.user;

                            if (!user) {
                                return null;
                            }

                            const displayName = formatDisplayName(user);

                            return (
                                <div
                                    key={enrollment.id}
                                    className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                                >
                                    <div className="flex min-w-0 items-center gap-3">
                                        <Avatar
                                            src={user.avatar_url}
                                            initials={getInitials(displayName)}
                                            alt={displayName}
                                            className="size-10 ring-1 ring-zinc-950/8 dark:ring-white/10"
                                        />
                                        <div className="min-w-0">
                                            <DataTableMetaText
                                                primary={displayName}
                                                secondary={enrollment.learning_path?.name ?? 'Unknown path'}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-4 sm:justify-end">
                                        <EnrollmentProgressBar value={enrollment.progress_percentage} className="w-36" />
                                        <EnrollmentStatusBadge status={enrollment.status as EnrollmentStatus} />
                                        <Button
                                            href={route('mentor.interns.show', user.id)}
                                            outline
                                            className="!px-2.5 !py-1 !text-xs"
                                        >
                                            Details
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>
        </div>
    );
}
