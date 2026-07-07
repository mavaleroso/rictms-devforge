import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import { Spinner } from '@/components/spinner';
import { TextLink } from '@/components/catalyst/text';
import { Button } from '@/components/catalyst/button';
import AuthLayout from '@/layouts/auth-layout';

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <AuthLayout title="Verify email" description="Please verify your email address by clicking on the link we just emailed to you.">
            <Head title="Email verification" />

            {status === 'verification-link-sent' && (
                <p className="text-center text-sm font-medium text-green-600">
                    A new verification link has been sent to the email address you provided during registration.
                </p>
            )}

            <form onSubmit={submit} className="grid gap-6 text-center">
                <Button outline disabled={processing}>
                    {processing && <Spinner className="size-4" />}
                    Resend verification email
                </Button>

                <TextLink href={route('logout')} method="post" className="mx-auto text-sm">
                    Log out
                </TextLink>
            </form>
        </AuthLayout>
    );
}
