import { UserRoleBadge } from '@/components/admin/user-role-badge';
import { Avatar } from '@/components/catalyst/avatar';
import { Button } from '@/components/catalyst/button';
import { Heading } from '@/components/catalyst/heading';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/catalyst/table';
import { Text } from '@/components/catalyst/text';
import { useInitials } from '@/hooks/use-initials';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { PencilSquareIcon, PlusIcon, UserGroupIcon, UserIcon, UsersIcon } from '@heroicons/react/20/solid';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Users', href: '/admin/users' },
];

interface AdminUser {
    id: number;
    name: string;
    first_name?: string | null;
    last_name?: string | null;
    email: string;
    phone?: string | null;
    occupation?: string | null;
    bio?: string | null;
    avatar_url?: string | null;
    roles: string[];
    role?: string;
    email_verified_at?: string | null;
    created_at?: string | null;
    enrollments_count?: number;
    mentored_enrollments_count?: number;
}

interface Props {
    users: { data: AdminUser[] };
    stats: {
        total: number;
        admins: number;
        mentors: number;
        interns: number;
    };
}

function UserStats({ stats }: { stats: Props['stats'] }) {
    const items = [
        { label: 'Total users', value: stats.total, icon: UsersIcon, tone: 'text-zinc-600 dark:text-zinc-300' },
        { label: 'Admins', value: stats.admins, icon: UserIcon, tone: 'text-violet-600 dark:text-violet-400' },
        { label: 'Mentors', value: stats.mentors, icon: UserGroupIcon, tone: 'text-blue-600 dark:text-blue-400' },
        { label: 'Interns', value: stats.interns, icon: UsersIcon, tone: 'text-lime-700 dark:text-lime-400' },
    ];

    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {items.map((item) => (
                <div
                    key={item.label}
                    className="rounded-xl border border-zinc-950/10 bg-white p-5 dark:border-white/10 dark:bg-zinc-900"
                >
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <p className="text-xs font-semibold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">{item.label}</p>
                            <p className="mt-2 text-3xl font-semibold text-zinc-950 dark:text-white">{item.value}</p>
                        </div>
                        <span className={`flex size-10 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800 ${item.tone}`}>
                            <item.icon className="size-5" />
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function AdminUsersIndex({ users, stats }: Props) {
    const getInitials = useInitials();
    const rows = users.data;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />

            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <Heading>Users</Heading>
                    <Text className="mt-2 max-w-2xl">
                        Manage platform accounts, roles, and profile details for admins, mentors, and interns.
                    </Text>
                </div>
                <Button href={route('admin.users.create')}>
                    <PlusIcon data-slot="icon" />
                    Add user
                </Button>
            </div>

            <div className="mt-8">
                <UserStats stats={stats} />
            </div>

            <div className="mt-8 overflow-hidden rounded-2xl border border-zinc-950/10 bg-white dark:border-white/10 dark:bg-zinc-900">
                <div className="border-b border-zinc-950/5 px-6 py-4 dark:border-white/5">
                    <h2 className="font-semibold text-zinc-950 dark:text-white">All accounts</h2>
                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{rows.length} users in the directory</p>
                </div>

                {rows.length === 0 ? (
                    <div className="px-6 py-16 text-center">
                        <Heading level={2}>No users yet</Heading>
                        <Text className="mt-2">Create the first account to start managing your team.</Text>
                        <Button href={route('admin.users.create')} className="mt-6">
                            <PlusIcon data-slot="icon" />
                            Add user
                        </Button>
                    </div>
                ) : (
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableHeader>User</TableHeader>
                                <TableHeader>Role</TableHeader>
                                <TableHeader>Contact</TableHeader>
                                <TableHeader>Profile</TableHeader>
                                <TableHeader>Joined</TableHeader>
                                <TableHeader className="text-right">Actions</TableHeader>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((user) => {
                                const role = user.role ?? user.roles[0] ?? 'intern';

                                return (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar
                                                    src={user.avatar_url}
                                                    initials={getInitials(user.name)}
                                                    alt={user.name}
                                                    className="size-11"
                                                />
                                                <div className="min-w-0">
                                                    <p className="font-medium text-zinc-950 dark:text-white">{user.name}</p>
                                                    <p className="truncate text-sm text-zinc-500 dark:text-zinc-400">{user.email}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <UserRoleBadge role={role} />
                                        </TableCell>
                                        <TableCell className="text-sm text-zinc-600 dark:text-zinc-300">
                                            <p>{user.phone || '—'}</p>
                                            {user.email_verified_at ? (
                                                <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">Verified</p>
                                            ) : (
                                                <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">Unverified</p>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-sm text-zinc-600 dark:text-zinc-300">
                                            <p>{user.occupation || '—'}</p>
                                            {user.bio && <p className="mt-1 line-clamp-1 text-xs text-zinc-500">{user.bio}</p>}
                                        </TableCell>
                                        <TableCell className="text-sm text-zinc-500 dark:text-zinc-400">
                                            {user.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button href={route('admin.users.edit', user.id)} plain>
                                                <PencilSquareIcon data-slot="icon" />
                                                Edit
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                )}
            </div>
        </AppLayout>
    );
}
