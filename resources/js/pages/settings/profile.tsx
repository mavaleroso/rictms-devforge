import { ProfileForm, buildProfileFormData, submitProfileForm } from '@/components/settings/profile-form';
import HeadingSmall from '@/components/heading-small';
import { useValidatedForm } from '@/hooks/use-validated-form';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: '/settings/profile',
    },
];

export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
    const { auth } = usePage<SharedData>().props;
    const form = useValidatedForm(buildProfileFormData(auth.user));

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        submitProfileForm(form);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title="Profile information"
                        description="Update your personal details, contact information, and profile photo."
                    />

                    <ProfileForm
                        form={form}
                        user={auth.user}
                        mustVerifyEmail={mustVerifyEmail}
                        verificationStatus={status}
                        onSubmit={submit}
                    />
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
