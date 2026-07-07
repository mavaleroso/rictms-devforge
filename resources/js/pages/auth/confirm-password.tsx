import { Head } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import { FormField } from '@/components/form/form-field';
import { Spinner } from '@/components/spinner';
import { Button } from '@/components/catalyst/button';
import { Label } from '@/components/catalyst/fieldset';
import { Input } from '@/components/catalyst/input';
import { useValidatedForm } from '@/hooks/use-validated-form';
import AuthLayout from '@/layouts/auth-layout';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useValidatedForm({
        password: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout
            title="Confirm your password"
            description="This is a secure area of the application. Please confirm your password before continuing."
        >
            <Head title="Confirm password" />

            <form className="grid gap-6" onSubmit={submit}>
                <FormField error={errors.password}>
                    <Label>Password</Label>
                    <Input
                        type="password"
                        name="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        value={data.password}
                        autoFocus
                        onChange={(e) => setData('password', e.target.value)}
                    />
                </FormField>

                <Button className="w-full" disabled={processing}>
                    {processing && <Spinner className="size-4" />}
                    Confirm password
                </Button>
            </form>
        </AuthLayout>
    );
}
