import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import { Spinner } from '@/components/spinner';
import { Button } from '@/components/catalyst/button';
import { ErrorMessage, Field, Label } from '@/components/catalyst/fieldset';
import { Input } from '@/components/catalyst/input';
import AuthLayout from '@/layouts/auth-layout';

interface ResetPasswordProps {
    token: string;
    email: string;
}

interface ResetPasswordForm {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export default function ResetPassword({ token, email }: ResetPasswordProps) {
    const { data, setData, post, processing, errors, reset } = useForm<ResetPasswordForm>({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout title="Reset password" description="Please enter your new password below">
            <Head title="Reset password" />

            <form className="grid gap-6" onSubmit={submit}>
                <Field>
                    <Label>Email</Label>
                    <Input
                        type="email"
                        name="email"
                        autoComplete="email"
                        value={data.email}
                        readOnly
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
                </Field>

                <Field>
                    <Label>Password</Label>
                    <Input
                        type="password"
                        name="password"
                        autoComplete="new-password"
                        value={data.password}
                        autoFocus
                        onChange={(e) => setData('password', e.target.value)}
                        placeholder="Password"
                    />
                    {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
                </Field>

                <Field>
                    <Label>Confirm password</Label>
                    <Input
                        type="password"
                        name="password_confirmation"
                        autoComplete="new-password"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        placeholder="Confirm password"
                    />
                    {errors.password_confirmation && <ErrorMessage>{errors.password_confirmation}</ErrorMessage>}
                </Field>

                <Button type="submit" className="w-full" disabled={processing}>
                    {processing && <Spinner className="size-4" />}
                    Reset password
                </Button>
            </form>
        </AuthLayout>
    );
}
