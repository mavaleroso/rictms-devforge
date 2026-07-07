import { UserForm } from '@/components/admin/user-form';
import { UserRoleBadge } from '@/components/admin/user-role-badge';
import { useConfirmDialog } from '@/components/confirm-dialog';
import { Avatar } from '@/components/catalyst/avatar';
import { Badge } from '@/components/catalyst/badge';
import { Button } from '@/components/catalyst/button';
import { Heading } from '@/components/catalyst/heading';
import { Text } from '@/components/catalyst/text';
import { useInitials } from '@/hooks/use-initials';
import { formHasFileUpload, submitMultipartPatch } from '@/lib/inertia-upload';
import { composeFullName, formatSex, splitFullName } from '@/lib/user-profile';
import { useValidatedForm } from '@/hooks/use-validated-form';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { ArrowLeftIcon, CheckCircleIcon, TrashIcon } from '@heroicons/react/20/solid';
import { Head, router } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface AdminUser {
    id: number;
    name: string;
    first_name?: string | null;
    middle_name?: string | null;
    last_name?: string | null;
    email: string;
    phone?: string | null;
    sex?: string | null;
    birthdate?: string | null;
    address?: string | null;
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
    user: { data: AdminUser };
}

export default function AdminUsersEdit({ user: userProp }: Props) {
    const user = userProp.data;
    const role = user.role ?? user.roles[0] ?? 'intern';
    const split = splitFullName(user.name);
    const getInitials = useInitials();
    const { confirm, ConfirmDialog } = useConfirmDialog();

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Users', href: '/admin/users' },
        { title: user.name, href: route('admin.users.edit', user.id) },
    ];

    const form = useValidatedForm({
        first_name: user.first_name ?? split.first_name,
        middle_name: user.middle_name ?? split.middle_name,
        last_name: user.last_name ?? split.last_name,
        email: user.email,
        phone: user.phone ?? '',
        sex: user.sex ?? '',
        birthdate: user.birthdate ?? '',
        address: user.address ?? '',
        occupation: user.occupation ?? '',
        bio: user.bio ?? '',
        password: '',
        password_confirmation: '',
        role,
        avatar: null as File | null,
        remove_avatar: false,
    });

    const saveUser = () => {
        const onSuccess = () => {
            form.setData('avatar', null);
            form.setData('remove_avatar', false);
            form.setData('password', '');
            form.setData('password_confirmation', '');
        };

        const hasAvatarFile = formHasFileUpload(form.data as Record<string, unknown>);
        const removingAvatar = form.data.remove_avatar;

        if (hasAvatarFile || removingAvatar) {
            submitMultipartPatch(form, route('admin.users.update', user.id), {
                onSuccess,
                successToast: { title: 'User updated', message: 'Profile and access settings have been saved.' },
            });
            return;
        }

        form.patch(route('admin.users.update', user.id), {
            onSuccess,
            successToast: { title: 'User updated', message: 'Profile and access settings have been saved.' },
        });
    };

    const submit: FormEventHandler = async (e) => {
        e.preventDefault();

        const fullName = composeFullName(form.data.first_name, form.data.middle_name, form.data.last_name);

        const confirmed = await confirm({
            title: 'Save user changes?',
            description: `Updates to ${fullName || user.name}'s profile will take effect immediately.`,
            confirmLabel: 'Save changes',
        });

        if (confirmed) {
            saveUser();
        }
    };

    const destroy = async () => {
        const confirmed = await confirm({
            title: 'Delete user account?',
            description: `${user.name} will lose access to the platform. This action cannot be undone.`,
            confirmLabel: 'Delete user',
            variant: 'danger',
        });

        if (confirmed) {
            router.delete(route('admin.users.destroy', user.id));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${user.name}`} />
            <ConfirmDialog />

            <Button href={route('admin.users.index')} plain className="mb-3">
                <ArrowLeftIcon data-slot="icon" />
                All users
            </Button>

            <div className="flex flex-col gap-3 rounded-xl border border-zinc-950/10 bg-white p-4 dark:border-white/10 dark:bg-zinc-900 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <Avatar src={user.avatar_url} initials={getInitials(user.name)} alt={user.name} className="size-12" />
                    <div>
                        <div className="flex flex-wrap items-center gap-2">
                            <Heading level={2}>{user.name}</Heading>
                            <UserRoleBadge role={role} />
                            {user.email_verified_at ? (
                                <Badge color="green" className="gap-1">
                                    <CheckCircleIcon className="size-3" />
                                    Verified
                                </Badge>
                            ) : (
                                <Badge color="amber">Unverified</Badge>
                            )}
                        </div>
                        <Text className="mt-0.5 text-sm">{user.email}</Text>
                    </div>
                </div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">
                    <p>{user.occupation || 'No occupation set'}</p>
                    <p>{formatSex(user.sex)} · Joined {user.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}</p>
                </div>
            </div>

            <div className="mt-6">
                <UserForm
                    form={form}
                    onSubmit={submit}
                    submitLabel="Save changes"
                    mode="edit"
                    existingAvatarUrl={user.avatar_url}
                />
            </div>

            <div className="mt-6 flex flex-col gap-3 rounded-xl border border-red-200/80 bg-red-50/60 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-red-500/20 dark:bg-red-950/20">
                <Text className="text-sm text-red-800 dark:text-red-300">Permanently delete this account and revoke access.</Text>
                <Button type="button" color="red" onClick={destroy}>
                    <TrashIcon data-slot="icon" />
                    Delete user
                </Button>
            </div>
        </AppLayout>
    );
}
