import { UserForm } from '@/components/admin/user-form';
import { useConfirmDialog } from '@/components/confirm-dialog';
import { Button } from '@/components/catalyst/button';
import { Heading } from '@/components/catalyst/heading';
import { Text } from '@/components/catalyst/text';
import { useValidatedForm } from '@/hooks/use-validated-form';
import { formHasFileUpload } from '@/lib/inertia-upload';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { ArrowLeftIcon } from '@heroicons/react/20/solid';
import { Head } from '@inertiajs/react';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Users', href: '/admin/users' },
    { title: 'Create user', href: '/admin/users/create' },
];

export default function AdminUsersCreate() {
    const { confirm, ConfirmDialog } = useConfirmDialog();
    const form = useValidatedForm({
        first_name: '',
        middle_name: '',
        last_name: '',
        email: '',
        phone: '',
        sex: '',
        birthdate: '',
        address: '',
        occupation: '',
        bio: '',
        password: '',
        password_confirmation: '',
        role: 'intern',
        avatar: null as File | null,
        remove_avatar: false,
    });

    const submit: FormEventHandler = async (e) => {
        e.preventDefault();

        const fullName = [form.data.first_name, form.data.last_name].filter(Boolean).join(' ') || 'this user';

        const confirmed = await confirm({
            title: 'Create user account?',
            description: `A ${form.data.role} account will be created for ${fullName}.`,
            confirmLabel: 'Create user',
            tone: 'success',
        });

        if (confirmed) {
            form.post(route('admin.users.store'), {
                forceFormData: formHasFileUpload(form.data as Record<string, unknown>),
                successToast: { title: 'User created', message: 'The new account is ready to use.' },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create user" />
            <ConfirmDialog />

            <Button href={route('admin.users.index')} plain className="mb-3">
                <ArrowLeftIcon data-slot="icon" />
                All users
            </Button>

            <Heading>Create user</Heading>
            <Text className="mt-1">Add profile details, access role, and sign-in credentials.</Text>

            <div className="mt-6">
                <UserForm form={form} onSubmit={submit} submitLabel="Create user" mode="create" />
            </div>
        </AppLayout>
    );
}
