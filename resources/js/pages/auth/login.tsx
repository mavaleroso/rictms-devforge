import { Head } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import { FormField } from '@/components/form/form-field';
import { Spinner } from '@/components/spinner';
import { Button } from '@/components/catalyst/button';
import { Checkbox, CheckboxField } from '@/components/catalyst/checkbox';
import { Label } from '@/components/catalyst/fieldset';
import { Input } from '@/components/catalyst/input';
import { Text, TextLink } from '@/components/catalyst/text';
import { useValidatedForm } from '@/hooks/use-validated-form';
import AuthLayout from '@/layouts/auth-layout';

interface LoginForm {
    email: string;
    password: string;
    remember: boolean;
}

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useValidatedForm<LoginForm>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout title="Log in to your account" description="Enter your email and password below to log in">
            <Head title="Log in" />

            <form className="grid gap-6" onSubmit={submit}>
                <FormField error={errors.email}>
                    <Label>Email address</Label>
                    <Input
                        type="email"
                        required
                        autoFocus
                        tabIndex={1}
                        autoComplete="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="email@example.com"
                    />
                </FormField>

                <FormField error={errors.password}>
                    <div className="flex items-center justify-between">
                        <Label>Password</Label>
                        {canResetPassword && (
                            <Text>
                                <TextLink href={route('password.request')} tabIndex={5}>
                                    Forgot password?
                                </TextLink>
                            </Text>
                        )}
                    </div>
                    <Input
                        type="password"
                        required
                        tabIndex={2}
                        autoComplete="current-password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        placeholder="Password"
                    />
                </FormField>

                <CheckboxField>
                    <Checkbox checked={data.remember} onChange={(checked) => setData('remember', checked)} tabIndex={3} />
                    <Label>Remember me</Label>
                </CheckboxField>

                <Button type="submit" className="w-full" tabIndex={4} disabled={processing}>
                    {processing && <Spinner className="size-4" />}
                    Log in
                </Button>

                <Text className="text-center">
                    Don&apos;t have an account?{' '}
                    <TextLink href={route('register')} tabIndex={5}>
                        Sign up
                    </TextLink>
                </Text>
            </form>

            {status && <p className="text-center text-sm font-medium text-green-600">{status}</p>}
        </AuthLayout>
    );
}
