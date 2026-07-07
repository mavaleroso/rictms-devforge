import { Head } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import { FormField } from '@/components/form/form-field';
import { Spinner } from '@/components/spinner';
import { Button } from '@/components/catalyst/button';
import { Label } from '@/components/catalyst/fieldset';
import { Input } from '@/components/catalyst/input';
import { Text, TextLink } from '@/components/catalyst/text';
import { useValidatedForm } from '@/hooks/use-validated-form';
import AuthLayout from '@/layouts/auth-layout';

interface RegisterForm {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useValidatedForm<RegisterForm>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout title="Create an account" description="Enter your details below to create your account">
            <Head title="Register" />
            <form className="grid gap-6" onSubmit={submit}>
                <FormField error={errors.name}>
                    <Label>Name</Label>
                    <Input
                        type="text"
                        required
                        autoFocus
                        tabIndex={1}
                        autoComplete="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        disabled={processing}
                        placeholder="Full name"
                    />
                </FormField>

                <FormField error={errors.email}>
                    <Label>Email address</Label>
                    <Input
                        type="email"
                        required
                        tabIndex={2}
                        autoComplete="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        disabled={processing}
                        placeholder="email@example.com"
                    />
                </FormField>

                <FormField error={errors.password}>
                    <Label>Password</Label>
                    <Input
                        type="password"
                        required
                        tabIndex={3}
                        autoComplete="new-password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        disabled={processing}
                        placeholder="Password"
                    />
                </FormField>

                <FormField error={errors.password_confirmation}>
                    <Label>Confirm password</Label>
                    <Input
                        type="password"
                        required
                        tabIndex={4}
                        autoComplete="new-password"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        disabled={processing}
                        placeholder="Confirm password"
                    />
                </FormField>

                <Button type="submit" className="w-full" tabIndex={5} disabled={processing}>
                    {processing && <Spinner className="size-4" />}
                    Create account
                </Button>

                <Text className="text-center">
                    Already have an account?{' '}
                    <TextLink href={route('login')} tabIndex={6}>
                        Log in
                    </TextLink>
                </Text>
            </form>
        </AuthLayout>
    );
}
