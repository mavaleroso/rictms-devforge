import { Head } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import { FormField } from '@/components/form/form-field';
import { Spinner } from '@/components/spinner';
import { Button } from '@/components/catalyst/button';
import { Label } from '@/components/catalyst/fieldset';
import { Input } from '@/components/catalyst/input';
import { useValidatedForm } from '@/hooks/use-validated-form';
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
    const { data, setData, post, processing, errors, reset } = useValidatedForm<ResetPasswordForm>({
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
                <FormField error={errors.email}>
                    <Label>Email</Label>
                    <Input
                        type="email"
                        name="email"
                        autoComplete="email"
                        value={data.email}
                        readOnly
                        onChange={(e) => setData('email', e.target.value)}
                    />
                </FormField>

                <FormField error={errors.password}>
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
                </FormField>

                <FormField error={errors.password_confirmation}>
                    <Label>Confirm password</Label>
                    <Input
                        type="password"
                        name="password_confirmation"
                        autoComplete="new-password"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        placeholder="Confirm password"
                    />
                </FormField>

                <Button type="submit" className="w-full" disabled={processing}>
                    {processing && <Spinner className="size-4" />}
                    Reset password
                </Button>
            </form>
        </AuthLayout>
    );
}
