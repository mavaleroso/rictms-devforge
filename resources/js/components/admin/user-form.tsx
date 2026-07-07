import { AvatarField } from '@/components/admin/avatar-field';
import { UserPreviewCard } from '@/components/admin/user-preview-card';
import { USER_ROLES, UserRoleBadge, roleDetails } from '@/components/admin/user-role-badge';
import { FormField } from '@/components/form/form-field';
import { Button } from '@/components/catalyst/button';
import { Description, Label } from '@/components/catalyst/fieldset';
import { Input } from '@/components/catalyst/input';
import { Listbox, ListboxOption } from '@/components/catalyst/listbox';
import { Select } from '@/components/catalyst/select';
import { Textarea } from '@/components/catalyst/textarea';
import { SEX_OPTIONS } from '@/lib/user-profile';
import type { InertiaFormProps } from '@inertiajs/react';
import clsx from 'clsx';
import type { FormEventHandler } from 'react';

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
}

export function UserForm({ form, onSubmit, submitLabel, mode, existingAvatarUrl }: UserFormProps) {
    const { data, setData, processing, errors } = form;

    return (
        <form onSubmit={onSubmit}>
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_17rem]">
                <div className="space-y-4">
                    <section className="rounded-xl border border-zinc-950/10 bg-white p-4 dark:border-white/10 dark:bg-zinc-900 sm:p-5">
                        <div className="grid gap-4 lg:grid-cols-[9rem_minmax(0,1fr)]">
                            <AvatarField
                                compact
                                error={errors.avatar}
                                name={[data.first_name, data.last_name].filter(Boolean).join(' ')}
                                existingUrl={existingAvatarUrl}
                                file={data.avatar}
                                removeAvatar={data.remove_avatar}
                                onFileChange={(file) => setData('avatar', file)}
                                onRemoveAvatar={(remove) => setData('remove_avatar', remove)}
                            />

                            <div className="grid gap-3 sm:grid-cols-3">
                                <FormField error={errors.first_name}>
                                    <Label>First name</Label>
                                    <Input
                                        value={data.first_name}
                                        onChange={(e) => setData('first_name', e.target.value)}
                                        required
                                        autoComplete="given-name"
                                    />
                                </FormField>
                                <FormField error={errors.middle_name}>
                                    <Label>Middle name</Label>
                                    <Input
                                        value={data.middle_name}
                                        onChange={(e) => setData('middle_name', e.target.value)}
                                        autoComplete="additional-name"
                                    />
                                </FormField>
                                <FormField error={errors.last_name}>
                                    <Label>Last name</Label>
                                    <Input
                                        value={data.last_name}
                                        onChange={(e) => setData('last_name', e.target.value)}
                                        required
                                        autoComplete="family-name"
                                    />
                                </FormField>
                            </div>
                        </div>

                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                            <FormField error={errors.email}>
                                <Label>Email</Label>
                                <Input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                    autoComplete="email"
                                />
                            </FormField>
                            <FormField error={errors.phone}>
                                <Label>Phone</Label>
                                <Input
                                    type="tel"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    autoComplete="tel"
                                    placeholder="+63 9XX XXX XXXX"
                                />
                            </FormField>
                            <FormField error={errors.sex}>
                                <Label>Sex</Label>
                                <Select value={data.sex} onChange={(e) => setData('sex', e.target.value)}>
                                    <option value="">Not specified</option>
                                    {SEX_OPTIONS.filter((option) => option.value).map((option) => (
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
                            <FormField error={errors.occupation} className="sm:col-span-2">
                                <Label>Occupation</Label>
                                <Input
                                    value={data.occupation}
                                    onChange={(e) => setData('occupation', e.target.value)}
                                    placeholder="e.g. Software Engineer"
                                />
                            </FormField>
                            <FormField error={errors.address} className="sm:col-span-2">
                                <Label>Address</Label>
                                <Textarea
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    rows={2}
                                    placeholder="Street, city, province, postal code"
                                />
                            </FormField>
                            <FormField error={errors.bio} className="sm:col-span-2">
                                <Label>Bio</Label>
                                <Textarea
                                    value={data.bio}
                                    onChange={(e) => setData('bio', e.target.value)}
                                    rows={2}
                                    placeholder="Short professional summary"
                                />
                            </FormField>
                        </div>
                    </section>

                    <section className="rounded-xl border border-zinc-950/10 bg-white p-4 dark:border-white/10 dark:bg-zinc-900 sm:p-5">
                        <p className="text-xs font-semibold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">Access</p>
                        <FormField error={errors.role} className="mt-3">
                            <Label>Role</Label>
                            <div className="mt-2 grid gap-2 sm:grid-cols-3">
                                {USER_ROLES.map((role) => {
                                    const details = roleDetails(role);
                                    const selected = data.role === role;

                                    return (
                                        <button
                                            key={role}
                                            type="button"
                                            onClick={() => setData('role', role)}
                                            className={clsx(
                                                'rounded-lg border px-3 py-2.5 text-left transition',
                                                selected
                                                    ? 'border-violet-500/40 bg-violet-500/[0.06] ring-1 ring-violet-500/30'
                                                    : 'border-zinc-950/10 hover:bg-zinc-50 dark:border-white/10 dark:hover:bg-zinc-800/50',
                                            )}
                                        >
                                            <p className="text-sm font-medium text-zinc-950 dark:text-white">{details.label}</p>
                                            <p className="mt-0.5 line-clamp-2 text-xs text-zinc-500 dark:text-zinc-400">{details.description}</p>
                                        </button>
                                    );
                                })}
                            </div>
                        </FormField>
                    </section>

                    <section className="rounded-xl border border-zinc-950/10 bg-white p-4 dark:border-white/10 dark:bg-zinc-900 sm:p-5">
                        <p className="text-xs font-semibold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
                            {mode === 'create' ? 'Password' : 'Reset password'}
                        </p>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                            <FormField error={errors.password}>
                                <Label>{mode === 'create' ? 'Password' : 'New password'}</Label>
                                <Input
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    required={mode === 'create'}
                                    autoComplete="new-password"
                                />
                            </FormField>
                            <FormField error={errors.password_confirmation}>
                                <Label>Confirm</Label>
                                <Input
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    required={mode === 'create'}
                                    autoComplete="new-password"
                                />
                            </FormField>
                        </div>
                    </section>

                    <div className="flex justify-end xl:hidden">
                        <Button type="submit" color="dark/zinc" disabled={processing}>
                            {processing ? 'Saving…' : submitLabel}
                        </Button>
                    </div>
                </div>

                <aside className="space-y-3 xl:sticky xl:top-6 xl:self-start">
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
                    <Button type="submit" color="dark/zinc" className="hidden w-full xl:inline-flex" disabled={processing}>
                        {processing ? 'Saving…' : submitLabel}
                    </Button>
                </aside>
            </div>
        </form>
    );
}
