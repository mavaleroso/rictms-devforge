import { Button } from '@/components/catalyst/button';
import { Field, Label } from '@/components/catalyst/fieldset';
import { Input } from '@/components/catalyst/input';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';

interface Props {
    github: {
        connected: boolean;
        username: string | null;
    };
    evaluation: {
        driver: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Integrations', href: '/settings/integrations' }];

export default function SettingsIntegrations({ github, evaluation }: Props) {
    const connectForm = useForm({
        github_username: github.username ?? '',
        github_token: '',
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Integrations" />
            <SettingsLayout>
            <section className="overflow-hidden rounded-2xl border border-zinc-950/10 bg-white shadow-sm dark:border-white/10 dark:bg-zinc-900">
                <div className="border-b border-zinc-950/5 bg-gradient-to-r from-zinc-900 to-zinc-800 px-5 py-4 dark:border-white/5">
                    <p className="text-sm font-semibold text-white">GitHub</p>
                    <p className="mt-0.5 text-xs text-zinc-300">Submit challenge solutions from a repository file</p>
                </div>
                <div className="p-5">
                    {github.connected ? (
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <p className="text-sm font-medium text-zinc-950 dark:text-white">Connected as @{github.username}</p>
                                <p className="mt-0.5 text-xs text-zinc-500">Use the GitHub tab in coding challenges to submit from a repo.</p>
                            </div>
                            <Link
                                href={route('integrations.github.destroy')}
                                method="delete"
                                as="button"
                                className="text-xs font-medium text-red-600 hover:underline"
                            >
                                Disconnect
                            </Link>
                        </div>
                    ) : (
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                connectForm.patch(route('integrations.github.update'));
                            }}
                            className="space-y-4"
                        >
                            <Field>
                                <Label>GitHub username</Label>
                                <Input
                                    value={connectForm.data.github_username}
                                    onChange={(e) => connectForm.setData('github_username', e.target.value)}
                                />
                                {connectForm.errors.github_username && (
                                    <p className="mt-1 text-xs text-red-600">{connectForm.errors.github_username}</p>
                                )}
                            </Field>
                            <Field>
                                <Label>Personal access token</Label>
                                <Input
                                    type="password"
                                    value={connectForm.data.github_token}
                                    onChange={(e) => connectForm.setData('github_token', e.target.value)}
                                    placeholder="ghp_..."
                                />
                                <p className="mt-1 text-[11px] text-zinc-500">Needs repo read access. Stored encrypted.</p>
                                {connectForm.errors.github_token && (
                                    <p className="mt-1 text-xs text-red-600">{connectForm.errors.github_token}</p>
                                )}
                            </Field>
                            <Button type="submit" disabled={connectForm.processing}>
                                Connect GitHub
                            </Button>
                        </form>
                    )}
                </div>
            </section>

            <section className="rounded-2xl border border-zinc-950/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-900">
                <p className="text-sm font-semibold text-zinc-950 dark:text-white">Code evaluation</p>
                <p className="mt-1 text-xs text-zinc-500">
                    Current driver: <span className="font-mono font-medium">{evaluation.driver}</span>
                    {evaluation.driver === 'docker' && ' — submissions run in isolated Docker containers (CI-style).'}
                </p>
            </section>
            </SettingsLayout>
        </AppLayout>
    );
}
