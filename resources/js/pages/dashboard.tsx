import { DashboardAdminStats, DashboardQuickActions } from '@/components/dashboard/dashboard-admin';
import { DashboardHero, resolveDisplayName } from '@/components/dashboard/dashboard-hero';
import { DashboardInternPanel } from '@/components/dashboard/dashboard-intern';
import { DashboardMentorPanel, type DashboardMentorStats } from '@/components/dashboard/dashboard-mentor';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { type Enrollment, type LearningPath } from '@/types/learning';
import { Head, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/dashboard' }];

interface AdminStats {
    total_users: number;
    interns: number;
    mentors: number;
    active_enrollments: number;
    completed_enrollments: number;
    learning_paths: number;
}

interface Props {
    role: 'admin' | 'mentor' | 'intern';
    stats?: AdminStats;
    mentor_stats?: DashboardMentorStats;
    assigned_interns?: { data: Enrollment[] };
    enrollment?: Enrollment | { data: Enrollment } | null;
    available_paths?: Pick<LearningPath, 'id' | 'name' | 'slug' | 'description'>[] | null;
}

function unwrapEnrollment(enrollment: Props['enrollment']): Enrollment | null {
    if (!enrollment) {
        return null;
    }

    if ('data' in enrollment) {
        return enrollment.data;
    }

    return enrollment;
}

export default function Dashboard({ role, stats, mentor_stats, assigned_interns, enrollment, available_paths }: Props) {
    const { auth } = usePage<SharedData>().props;
    const displayName = auth.user ? resolveDisplayName(auth.user) : 'there';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <DashboardHero displayName={displayName} role={role} />

            {role === 'admin' && stats && (
                <div className="mt-8 space-y-8">
                    <DashboardAdminStats stats={stats} />
                    <div>
                        <h2 className="mb-4 text-sm font-semibold text-zinc-950 dark:text-white">Quick actions</h2>
                        <DashboardQuickActions />
                    </div>
                </div>
            )}

            {role === 'mentor' && mentor_stats && assigned_interns && (
                <div className="mt-8">
                    <DashboardMentorPanel stats={mentor_stats} assignedInterns={assigned_interns.data} />
                </div>
            )}

            {role === 'intern' && (
                <div className="mt-8">
                    <DashboardInternPanel enrollment={unwrapEnrollment(enrollment)} availablePaths={available_paths ?? null} />
                </div>
            )}
        </AppLayout>
    );
}
