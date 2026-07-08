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
import { CheckCircleIcon } from '@heroicons/react/20/solid';

interface RegisterForm {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

const signupBenefits = [
    'Structured paths across four ICT disciplines',
    'Hands-on labs with editor, compiler, and tester',
    'Quizzes, challenges, and mentor-reviewed capstones',
] as const;

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
        <AuthLayout
            variant="register"
            aside="tracks"
            title="Create your account"
            description="Join the academy and start building job-ready skills with guided levels, practical labs, and measurable progress."
        >
            <Head title="Register" />

            <ul className="mb-4 space-y-2 border-b border-slate-200/80 pb-4 dark:border-slate-800">
                {signupBenefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
                        <CheckCircleIcon className="mt-0.5 size-4 shrink-0 text-brand-600 dark:text-brand-400" />
                        {benefit}
                    </li>
                ))}
            </ul>

            <form className="grid gap-4" onSubmit={submit}>
                <FormField error={errors.name}>
                    <Label>Full name</Label>
                    <Input
                        type="text"
                        required
                        autoFocus
                        tabIndex={1}
                        autoComplete="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        disabled={processing}
                        placeholder="Your name"
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
                        placeholder="you@company.com"
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
                        placeholder="Create a password"
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
                        placeholder="Repeat your password"
                    />
                </FormField>

                <Button type="submit" color="dark/zinc" className="w-full" tabIndex={5} disabled={processing}>
                    {processing && <Spinner className="size-4" />}
                    Create free account
                </Button>

                <Text className="text-center text-sm">
                    Already have an account?{' '}
                    <TextLink href={route('login')} tabIndex={6}>
                        Sign in
                    </TextLink>
                </Text>
            </form>
        </AuthLayout>
    );
}
