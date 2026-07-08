import { Head } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import { FormField } from '@/components/form/form-field';
import { Spinner } from '@/components/spinner';
import { TextLink } from '@/components/catalyst/text';
import { Button } from '@/components/catalyst/button';
import { Label } from '@/components/catalyst/fieldset';
import { Input } from '@/components/catalyst/input';
import { Text } from '@/components/catalyst/text';
import { useValidatedForm } from '@/hooks/use-validated-form';
import AuthLayout from '@/layouts/auth-layout';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useValidatedForm({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <AuthLayout
            title="Forgot password"
            description="Enter your email and we'll send a link to reset your password."
        >
            <Head title="Forgot password" />

            {status && (
                <p className="mb-4 text-center text-sm font-medium text-emerald-600 dark:text-emerald-400">{status}</p>
            )}

            <form className="grid gap-4" onSubmit={submit}>
                <FormField error={errors.email}>
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
                </FormField>

                <Button color="dark/zinc" className="w-full" disabled={processing}>
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
