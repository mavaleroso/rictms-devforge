import { UserActiveToggle } from '@/components/admin/user-active-toggle';
import { UserIndexStats } from '@/components/admin/user-index-stats';
import { UserRoleBadge } from '@/components/admin/user-role-badge';
import { Avatar } from '@/components/catalyst/avatar';
import { Button } from '@/components/catalyst/button';
import { Heading } from '@/components/catalyst/heading';
import { Text } from '@/components/catalyst/text';
import { DataTableMetaText, ServerDataTable, type DataTableColumnMeta } from '@/components/data-table';
import { useInitials } from '@/hooks/use-initials';
import { formatDisplayName } from '@/lib/user-profile';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { PencilSquareIcon, PlusIcon, UsersIcon } from '@heroicons/react/20/solid';
import { Head, usePage } from '@inertiajs/react';
import { type ColumnDef } from '@tanstack/react-table';
import clsx from 'clsx';
import { useMemo } from 'react';

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
    is_active: boolean;
    email_verified_at?: string | null;
    created_at?: string | null;
    enrollments_count?: number;
    mentored_enrollments_count?: number;
}

interface Props {
    stats: {
        total: number;
        admins: number;
        mentors: number;
        interns: number;
    };
}

interface PageProps extends Props {
    auth: {
        user: {
            id: number;
        };
    };
}

function formatJoinedDate(value?: string | null): string {
    if (!value) {
        return '—';
    }

    return new Date(value).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

function roleActivityLabel(user: AdminUser, role: string): string | null {
    if (role === 'mentor' && user.mentored_enrollments_count !== undefined) {
        const count = user.mentored_enrollments_count;
        return `${count} active ${count === 1 ? 'mentee' : 'mentees'}`;
    }

    if (role === 'intern' && user.enrollments_count !== undefined) {
        const count = user.enrollments_count;
        return `${count} active ${count === 1 ? 'path' : 'paths'}`;
    }

    if (role === 'admin') {
        return 'Platform administrator';
    }

    return null;
}

function UserStatusCell({
    user,
    currentUserId,
}: {
    user: AdminUser;
    currentUserId: number;
}) {
    const isSelf = user.id === currentUserId;

    return (
        <UserActiveToggle
            userId={user.id}
            userName={formatDisplayName(user)}
            isActive={user.is_active}
            disabled={isSelf}
            disabledReason={isSelf ? 'Cannot change your own status' : undefined}
        />
    );
}

function useUserColumns(getInitials: (name: string) => string, currentUserId: number): ColumnDef<AdminUser, unknown>[] {
    return useMemo(
        () => [
            {
                id: 'name',
                accessorKey: 'name',
                header: 'Member',
                enableSorting: true,
                cell: ({ row }) => {
                    const user = row.original;
                    const displayName = formatDisplayName(user);

                    return (
                        <div className={clsx('flex items-center gap-3', !user.is_active && 'opacity-60')}>
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
                id: 'role',
                header: 'Role',
                enableSorting: false,
                cell: ({ row }) => {
                    const user = row.original;
                    const role = user.role ?? user.roles[0] ?? 'intern';
                    const activity = roleActivityLabel(user, role);

                    return (
                        <div className="space-y-1">
                            <UserRoleBadge role={role} withIcon className="!px-2 !py-0.5 !text-[11px] !leading-4" />
                            {activity && <p className="text-[11px] text-zinc-500 dark:text-zinc-400">{activity}</p>}
                        </div>
                    );
                },
            },
            {
                id: 'contact',
                header: 'Contact',
                enableSorting: false,
                cell: ({ row }) => {
                    const user = row.original;

                    return (
                        <DataTableMetaText
                            primary={user.phone || 'No phone on file'}
                            secondary={user.occupation || 'No occupation listed'}
                        />
                    );
                },
            },
            {
                id: 'status',
                header: 'Status',
                enableSorting: false,
                cell: ({ row }) => <UserStatusCell user={row.original} currentUserId={currentUserId} />,
            },
            {
                id: 'created_at',
                accessorKey: 'created_at',
                header: 'Joined',
                enableSorting: true,
                meta: { align: 'right', cellClassName: 'tabular-nums' } satisfies DataTableColumnMeta,
                cell: ({ row }) => (
                    <span className="text-xs text-zinc-600 dark:text-zinc-300">{formatJoinedDate(row.original.created_at)}</span>
                ),
            },
            {
                id: 'actions',
                header: '',
                enableSorting: false,
                meta: { align: 'right', headerClassName: 'w-12', cellClassName: 'w-12' } satisfies DataTableColumnMeta,
                cell: ({ row }) => (
                    <Button
                        href={route('admin.users.edit', row.original.id)}
                        outline
                        className="!px-2.5 !py-1 !text-xs opacity-70 transition-opacity group-hover:opacity-100 focus:opacity-100"
                        aria-label={`Edit ${row.original.name}`}
                    >
                        <PencilSquareIcon data-slot="icon" />
                        Edit
                    </Button>
                ),
            },
        ],
        [getInitials, currentUserId],
    );
}

export default function AdminUsersIndex({ stats }: Props) {
    const { auth } = usePage<PageProps>().props;
    const getInitials = useInitials();
    const columns = useUserColumns(getInitials, auth.user.id);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />

            <section className="relative overflow-hidden rounded-2xl border border-zinc-950/10 bg-gradient-to-br from-zinc-50 via-white to-violet-50/50 p-6 shadow-sm sm:p-8 dark:border-white/10 dark:from-zinc-900 dark:via-zinc-900 dark:to-violet-950/30">
                <div
                    className="pointer-events-none absolute -top-24 -right-24 size-64 rounded-full bg-violet-400/10 blur-3xl dark:bg-violet-500/10"
                    aria-hidden
                />
                <div
                    className="pointer-events-none absolute -bottom-20 -left-16 size-48 rounded-full bg-blue-400/10 blur-3xl dark:bg-blue-500/10"
                    aria-hidden
                />

                <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-start gap-4">
                        <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/25">
                            <UsersIcon className="size-7" />
                        </div>
                        <div>
                            <Heading>User directory</Heading>
                            <Text className="mt-2 max-w-2xl">
                                Manage platform accounts, assign roles, and keep profile details up to date for your
                                team.
                            </Text>
                        </div>
                    </div>

                    <Button href={route('admin.users.create')} className="shrink-0 self-start lg:self-center">
                        <PlusIcon data-slot="icon" />
                        Add user
                    </Button>
                </div>
            </section>

            <div className="mt-8">
                <UserIndexStats stats={stats} />
            </div>

            <div className="mt-8">
                <ServerDataTable
                    columns={columns}
                    queryKey="admin.users.table"
                    fetchUrl={route('admin.users.table')}
                    title="Directory"
                    description="Search, sort, and manage user accounts from a single workspace view."
                    searchPlaceholder="Search members..."
                    emptyTitle="No matching members"
                    emptyDescription={
                        stats.total === 0
                            ? 'Your directory is empty. Add the first user account to begin managing access and roles.'
                            : 'No users match the current search. Clear the filter or try another name, email, or role-related keyword.'
                    }
                    emptyAction={
                        stats.total === 0 ? (
                            <Button href={route('admin.users.create')}>
                                <PlusIcon data-slot="icon" />
                                Add user
                            </Button>
                        ) : undefined
                    }
                />
            </div>
        </AppLayout>
    );
}
