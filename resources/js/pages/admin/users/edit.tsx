import { UserForm } from '@/components/admin/user-form';
import { UserRoleBadge } from '@/components/admin/user-role-badge';
import { useConfirmDialog } from '@/components/confirm-dialog';
import { Avatar } from '@/components/catalyst/avatar';
import { Badge } from '@/components/catalyst/badge';
import { Button } from '@/components/catalyst/button';
import { Heading, Subheading } from '@/components/catalyst/heading';
import { Text } from '@/components/catalyst/text';
import { useInitials } from '@/hooks/use-initials';
import { formHasFileUpload, submitMultipartPatch } from '@/lib/inertia-upload';
import { composeFullName, formatDisplayName, formatSex, splitFullName } from '@/lib/user-profile';
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
    const displayName = formatDisplayName(user);
    const getInitials = useInitials();
    const { confirm, ConfirmDialog } = useConfirmDialog();

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Users', href: '/admin/users' },
        { title: displayName, href: route('admin.users.edit', user.id) },
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
            <Head title={`Edit ${displayName}`} />
            <ConfirmDialog />

            <Button href={route('admin.users.index')} plain className="mb-4">
                <ArrowLeftIcon data-slot="icon" />
                All users
            </Button>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-center gap-4">
                    <Avatar src={user.avatar_url} initials={getInitials(displayName)} alt={displayName} className="size-14" />
                    <div>
                        <div className="flex flex-wrap items-center gap-2">
                            <Heading level={2}>{displayName}</Heading>
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
                        <Text className="mt-1">{user.email}</Text>
                        <Text className="mt-1 text-sm text-zinc-500">
                            {[user.occupation, formatSex(user.sex)].filter(Boolean).join(' · ') || 'No occupation set'}
                            {' · '}
                            Joined {user.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}
                        </Text>
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <UserForm
                    form={form}
                    onSubmit={submit}
                    submitLabel="Save changes"
                    mode="edit"
                    existingAvatarUrl={user.avatar_url}
                    cancelHref={route('admin.users.index')}
                />
            </div>

            <section className="mt-8 overflow-hidden rounded-xl border border-red-200/80 dark:border-red-500/25">
                <div className="border-b border-red-200/60 bg-red-50/80 px-5 py-4 dark:border-red-500/20 dark:bg-red-950/30">
                    <Subheading className="text-red-900 dark:text-red-200">Danger zone</Subheading>
                    <Text className="mt-1 text-sm text-red-800/90 dark:text-red-300/90">
                        Permanently remove this account. Enrollment history may be affected.
                    </Text>
                </div>
                <div className="flex flex-col gap-3 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:bg-zinc-900">
                    <Text className="text-sm text-zinc-600 dark:text-zinc-400">This action cannot be undone.</Text>
                    <Button type="button" color="red" onClick={destroy}>
                        <TrashIcon data-slot="icon" />
                        Delete user
                    </Button>
                </div>
            </section>
        </AppLayout>
    );
}
