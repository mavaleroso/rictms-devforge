import { AvatarField } from '@/components/admin/avatar-field';
import { UserPreviewCard } from '@/components/admin/user-preview-card';
import { USER_ROLES, roleDetails } from '@/components/admin/user-role-badge';
import { FormField } from '@/components/form/form-field';
import { Button } from '@/components/catalyst/button';
import { Description, Label } from '@/components/catalyst/fieldset';
import { Subheading } from '@/components/catalyst/heading';
import { Input } from '@/components/catalyst/input';
import { Select } from '@/components/catalyst/select';
import { Textarea } from '@/components/catalyst/textarea';
import { SEX_OPTIONS } from '@/lib/user-profile';
import type { InertiaFormProps } from '@inertiajs/react';
import { CheckIcon, KeyIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import type { FormEventHandler, ReactNode } from 'react';

export interface UserFormData {
    first_name: string;
    middle_name: string;
    last_name: string;
    email: string;
    phone: string;
    sex: string;
    birthdate: string;
    address: string;
    occupation: string;
    bio: string;
    password: string;
    password_confirmation: string;
    role: string;
    avatar: File | null;
    remove_avatar: boolean;
}

interface UserFormProps {
    form: InertiaFormProps<UserFormData>;
    onSubmit: FormEventHandler;
    submitLabel: string;
    mode: 'create' | 'edit';
    existingAvatarUrl?: string | null;
    cancelHref?: string;
}

function FormSection({ title, description, children }: { title: string; description: string; children: ReactNode }) {
    return (
        <section className="rounded-xl border border-zinc-950/10 bg-white p-5 dark:border-white/10 dark:bg-zinc-900 sm:p-6">
            <Subheading>{title}</Subheading>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{description}</p>
            <div className="mt-5 space-y-4">{children}</div>
        </section>
    );
}

export function UserForm({ form, onSubmit, submitLabel, mode, existingAvatarUrl, cancelHref }: UserFormProps) {
    const { data, setData, processing, errors } = form;
    const displayName = [data.first_name, data.last_name].filter(Boolean).join(' ');

    return (
        <form onSubmit={onSubmit}>
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_19rem]">
                <div className="space-y-5">
                    <FormSection title="Personal details" description="Legal name and demographic information for the user profile.">
                        <AvatarField
                            error={errors.avatar}
                            name={displayName}
                            existingUrl={existingAvatarUrl}
                            file={data.avatar}
                            removeAvatar={data.remove_avatar}
                            onFileChange={(file) => setData('avatar', file)}
                            onRemoveAvatar={(remove) => setData('remove_avatar', remove)}
                        />

                        <div className="grid gap-4 sm:grid-cols-3">
                            <FormField error={errors.first_name}>
                                <Label>First name</Label>
                                <Input
                                    value={data.first_name}
                                    onChange={(e) => setData('first_name', e.target.value)}
                                    required
                                    autoComplete="given-name"
                                    placeholder="Jane"
                                />
                            </FormField>
                            <FormField error={errors.middle_name}>
                                <Label>Middle name</Label>
                                <Input
                                    value={data.middle_name}
                                    onChange={(e) => setData('middle_name', e.target.value)}
                                    autoComplete="additional-name"
                                    placeholder="Optional"
                                />
                            </FormField>
                            <FormField error={errors.last_name}>
                                <Label>Last name</Label>
                                <Input
                                    value={data.last_name}
                                    onChange={(e) => setData('last_name', e.target.value)}
                                    required
                                    autoComplete="family-name"
                                    placeholder="Cooper"
                                />
                            </FormField>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <FormField error={errors.sex}>
                                <Label>Sex</Label>
                                <Select value={data.sex} onChange={(e) => setData('sex', e.target.value)}>
                                    <option value="">Not specified</option>
                                    {SEX_OPTIONS.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </Select>
                            </FormField>
                            <FormField error={errors.birthdate}>
                                <Label>Birthdate</Label>
                                <Input
                                    type="date"
                                    value={data.birthdate}
                                    onChange={(e) => setData('birthdate', e.target.value)}
                                />
                            </FormField>
                        </div>
                    </FormSection>

                    <FormSection title="Contact & professional info" description="How to reach this user and their role outside the platform.">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <FormField error={errors.email}>
                                <Label>Email address</Label>
                                <Description>Used for sign-in and system notifications.</Description>
                                <Input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                    autoComplete="email"
                                    placeholder="jane@company.com"
                                />
                            </FormField>
                            <FormField error={errors.phone}>
                                <Label>Phone number</Label>
                                <Input
                                    type="tel"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    autoComplete="tel"
                                    placeholder="+63 9XX XXX XXXX"
                                />
                            </FormField>
                        </div>

                        <FormField error={errors.occupation}>
                            <Label>Occupation</Label>
                            <Input
                                value={data.occupation}
                                onChange={(e) => setData('occupation', e.target.value)}
                                placeholder="e.g. Software Engineer"
                            />
                        </FormField>

                        <FormField error={errors.address}>
                            <Label>Address</Label>
                            <Textarea
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                rows={2}
                                placeholder="Street, city, province, postal code"
                            />
                        </FormField>

                        <FormField error={errors.bio}>
                            <Label>Bio</Label>
                            <Description>Short summary shown on directory cards and mentor views.</Description>
                            <Textarea
                                value={data.bio}
                                onChange={(e) => setData('bio', e.target.value)}
                                rows={3}
                                placeholder="Brief professional background or mentoring focus…"
                            />
                        </FormField>
                    </FormSection>

                    <FormSection title="Platform access" description="Determines which areas of DevForge this account can use.">
                        <FormField error={errors.role}>
                            <Label>Role</Label>
                            <div className="mt-2 grid gap-3 sm:grid-cols-3">
                                {USER_ROLES.map((role) => {
                                    const details = roleDetails(role);
                                    const Icon = details.icon;
                                    const selected = data.role === role;

                                    return (
                                        <button
                                            key={role}
                                            type="button"
                                            onClick={() => setData('role', role)}
                                            className={clsx(
                                                'relative rounded-xl border p-4 text-left transition',
                                                selected
                                                    ? 'border-brand-500/50 bg-brand-500/[0.05] ring-2 ring-brand-500/25'
                                                    : 'border-zinc-950/10 hover:border-zinc-950/20 hover:bg-zinc-50 dark:border-white/10 dark:hover:border-white/20 dark:hover:bg-zinc-800/40',
                                            )}
                                        >
                                            {selected && (
                                                <span className="absolute top-3 right-3 flex size-5 items-center justify-center rounded-full bg-brand-600 text-white">
                                                    <CheckIcon className="size-3" />
                                                </span>
                                            )}
                                            <span
                                                className={clsx(
                                                    'flex size-9 items-center justify-center rounded-lg',
                                                    selected
                                                        ? 'bg-brand-500/15 text-brand-600 dark:text-brand-400'
                                                        : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400',
                                                )}
                                            >
                                                <Icon className="size-5" />
                                            </span>
                                            <p className="mt-3 text-sm font-semibold text-zinc-950 dark:text-white">{details.label}</p>
                                            <p className="mt-1 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">{details.description}</p>
                                        </button>
                                    );
                                })}
                            </div>
                        </FormField>
                    </FormSection>

                    <FormSection
                        title={mode === 'create' ? 'Sign-in credentials' : 'Password reset'}
                        description={
                            mode === 'create'
                                ? 'Set a temporary password. The user can change it after first login.'
                                : 'Leave blank to keep the current password unchanged.'
                        }
                    >
                        <div className="grid gap-4 sm:grid-cols-2">
                            <FormField error={errors.password}>
                                <Label>{mode === 'create' ? 'Password' : 'New password'}</Label>
                                <Input
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    required={mode === 'create'}
                                    autoComplete="new-password"
                                    placeholder={mode === 'edit' ? 'Leave blank to keep current' : undefined}
                                />
                            </FormField>
                            <FormField error={errors.password_confirmation}>
                                <Label>Confirm password</Label>
                                <Input
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    required={mode === 'create'}
                                    autoComplete="new-password"
                                />
                            </FormField>
                        </div>
                    </FormSection>

                    <div className="flex items-center justify-end gap-3 rounded-xl border border-zinc-950/10 bg-zinc-50/80 px-4 py-3 dark:border-white/10 dark:bg-zinc-800/40 xl:hidden">
                        {cancelHref && (
                            <Button href={cancelHref} plain>
                                Cancel
                            </Button>
                        )}
                        <Button type="submit" color="dark/zinc" disabled={processing}>
                            {processing ? 'Saving…' : submitLabel}
                        </Button>
                    </div>
                </div>

                <aside className="space-y-4 xl:sticky xl:top-6 xl:self-start">
                    <UserPreviewCard
                        firstName={data.first_name}
                        middleName={data.middle_name}
                        lastName={data.last_name}
                        email={data.email}
                        phone={data.phone}
                        sex={data.sex}
                        birthdate={data.birthdate}
                        occupation={data.occupation}
                        address={data.address}
                        bio={data.bio}
                        role={data.role}
                        avatarFile={data.avatar}
                        existingAvatarUrl={existingAvatarUrl}
                        removeAvatar={data.remove_avatar}
                        mode={mode}
                    />

                    <div className="hidden rounded-xl border border-zinc-950/10 bg-white p-4 dark:border-white/10 dark:bg-zinc-900 xl:block">
                        <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                            <KeyIcon className="size-4" />
                            <span>{mode === 'create' ? 'New account setup' : 'Profile update'}</span>
                        </div>
                        <div className="mt-4 flex flex-col gap-2">
                            {cancelHref && (
                                <Button href={cancelHref} plain className="w-full">
                                    Cancel
                                </Button>
                            )}
                            <Button type="submit" color="dark/zinc" className="w-full" disabled={processing}>
                                {processing ? 'Saving…' : submitLabel}
                            </Button>
                        </div>
                    </div>
                </aside>
            </div>
        </form>
    );
}
