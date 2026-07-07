import { Badge } from '@/components/catalyst/badge';
import { Button } from '@/components/catalyst/button';
import { Heading } from '@/components/catalyst/heading';
import { Text } from '@/components/catalyst/text';
import { TextLink } from '@/components/catalyst/text';
import { ProgressBar } from '@/components/learning/progress-bar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/catalyst/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type Enrollment, type LearningPath } from '@/types/learning';
import { Head } from '@inertiajs/react';

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
    assigned_interns?: { data: Enrollment[] };
    pending_reviews?: number;
    enrollment?: { data: Enrollment } | null;
    available_paths?: Pick<LearningPath, 'id' | 'name' | 'slug' | 'description'>[];
}

function StatCard({ label, value }: { label: string; value: number }) {
    return (
        <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-700">
            <p className="text-sm text-zinc-500">{label}</p>
            <p className="mt-1 text-2xl font-semibold text-zinc-950 dark:text-white">{value}</p>
        </div>
    );
}

export default function Dashboard({ role, stats, assigned_interns, enrollment, available_paths }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <Heading>Dashboard</Heading>

            {role === 'admin' && stats && (
                <div className="mt-6 space-y-8">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <StatCard label="Total users" value={stats.total_users} />
                        <StatCard label="Interns" value={stats.interns} />
                        <StatCard label="Mentors" value={stats.mentors} />
                        <StatCard label="Active enrollments" value={stats.active_enrollments} />
                        <StatCard label="Completed enrollments" value={stats.completed_enrollments} />
                        <StatCard label="Active paths" value={stats.learning_paths} />
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <Button href={route('admin.paths.index')}>Manage paths</Button>
                        <Button href={route('admin.enrollments.index')} outline>
                            Enrollments
                        </Button>
                        <Button href={route('admin.users.index')} outline>
                            Users
                        </Button>
                    </div>
                </div>
            )}

            {role === 'mentor' && assigned_interns && (
                <div className="mt-6">
                    <Heading level={2}>Assigned interns</Heading>
                    {assigned_interns.data.length === 0 ? (
                        <Text className="mt-4">No interns assigned yet.</Text>
                    ) : (
                        <Table className="mt-4">
                            <TableHead>
                                <TableRow>
                                    <TableHeader>Intern</TableHeader>
                                    <TableHeader>Path</TableHeader>
                                    <TableHeader>Progress</TableHeader>
                                    <TableHeader className="text-right">View</TableHeader>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {assigned_interns.data.map((e) => (
                                    <TableRow key={e.id}>
                                        <TableCell>{e.user?.name}</TableCell>
                                        <TableCell>{e.learning_path?.name}</TableCell>
                                        <TableCell>
                                            <div className="w-28">
                                                <ProgressBar percentage={e.progress_percentage} />
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <TextLink href={route('mentor.interns.show', e.user?.id)}>Details</TextLink>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                    <Button className="mt-4" href={route('mentor.interns.index')} outline>
                        View all interns
                    </Button>
                </div>
            )}

            {role === 'intern' && (
                <div className="mt-6 space-y-8">
                    {enrollment?.data ? (
                        <div className="rounded-lg border border-zinc-200 p-6 dark:border-zinc-700">
                            <Badge className="mb-2">Active path</Badge>
                            <Heading level={2}>{enrollment.data.learning_path?.name}</Heading>
                            <div className="mt-4 max-w-md">
                                <ProgressBar percentage={enrollment.data.progress_percentage} label="Overall progress" />
                            </div>
                            {enrollment.data.current_level && (
                                <div className="mt-6">
                                    <Text>
                                        Current level: L{enrollment.data.current_level.number} — {enrollment.data.current_level.title}
                                    </Text>
                                    <Button
                                        className="mt-4"
                                        href={route('learn.levels.show', [
                                            enrollment.data.learning_path?.id,
                                            enrollment.data.current_level.id,
                                        ])}
                                    >
                                        Continue learning
                                    </Button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div>
                            <Heading level={2}>Get started</Heading>
                            <Text className="mt-2">Enroll in a learning path to begin your journey.</Text>
                            {available_paths && available_paths.length > 0 && (
                                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                    {available_paths.map((path) => (
                                        <div key={path.id} className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-700">
                                            <Heading level={3}>{path.name}</Heading>
                                            <Button className="mt-3" href={route('learn.paths.show', path.id)} outline>
                                                View path
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <Button className="mt-4" href={route('learn.paths.index')}>
                                Browse paths
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </AppLayout>
    );
}
