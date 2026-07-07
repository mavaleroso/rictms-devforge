import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import { Spinner } from '@/components/spinner';
import { Button } from '@/components/catalyst/button';
import { ErrorMessage, Field, Label } from '@/components/catalyst/fieldset';
import { Input } from '@/components/catalyst/input';
import { Text, TextLink } from '@/components/catalyst/text';
import AuthLayout from '@/layouts/auth-layout';

interface RegisterForm {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm<RegisterForm>({
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
                <Field>
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
                    {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
                </Field>

                <Field>
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
                    {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
                </Field>

                <Field>
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
                    {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
                </Field>

                <Field>
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
                    {errors.password_confirmation && <ErrorMessage>{errors.password_confirmation}</ErrorMessage>}
                </Field>

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
