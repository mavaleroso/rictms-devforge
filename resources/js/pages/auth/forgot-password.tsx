import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import { Spinner } from '@/components/spinner';
import { TextLink } from '@/components/catalyst/text';
import { Button } from '@/components/catalyst/button';
import { ErrorMessage, Field, Label } from '@/components/catalyst/fieldset';
import { Input } from '@/components/catalyst/input';
import { Text } from '@/components/catalyst/text';
import AuthLayout from '@/layouts/auth-layout';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <AuthLayout title="Forgot password" description="Enter your email to receive a password reset link">
            <Head title="Forgot password" />

            {status && <p className="text-center text-sm font-medium text-green-600">{status}</p>}

            <form className="grid gap-6" onSubmit={submit}>
                <Field>
                    <Label>Email address</Label>
                    <Input
                        type="email"
                        name="email"
                        autoComplete="off"
                        value={data.email}
                        autoFocus
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="email@example.com"
                    />
                    {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
                </Field>

                <Button className="w-full" disabled={processing}>
                    {processing && <Spinner className="size-4" />}
                    Email password reset link
                </Button>

                <Text className="text-center">
                    Or, return to <TextLink href={route('login')}>log in</TextLink>
                </Text>
            </form>
        </AuthLayout>
    );
}
