import { AvatarField } from '@/components/admin/avatar-field';
import { FormField } from '@/components/form/form-field';
import { Button } from '@/components/catalyst/button';
import { Description, Label } from '@/components/catalyst/fieldset';
import { Subheading } from '@/components/catalyst/heading';
import { Input } from '@/components/catalyst/input';
import { Select } from '@/components/catalyst/select';
import { Textarea } from '@/components/catalyst/textarea';
import { formHasFileUpload, submitMultipartPatch } from '@/lib/inertia-upload';
import { composeFullName, SEX_OPTIONS, splitFullName } from '@/lib/user-profile';
import { surfaces } from '@/lib/theme';
import type { User } from '@/types';
import type { InertiaFormProps } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import clsx from 'clsx';
import type { FormEventHandler, ReactNode } from 'react';

export interface ProfileFormData {
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
    avatar: File | null;
    remove_avatar: boolean;
}

interface ProfileFormProps {
    form: InertiaFormProps<ProfileFormData>;
    user: User;
    mustVerifyEmail: boolean;
    verificationStatus?: string;
    onSubmit: FormEventHandler;
}

function FormSection({ title, description, children }: { title: string; description: string; children: ReactNode }) {
    return (
        <section className={clsx('p-5 sm:p-6', surfaces.card)}>
            <Subheading>{title}</Subheading>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
            <div className="mt-5 space-y-4">{children}</div>
        </section>
    );
}

function formatDateInput(value?: string | null): string {
    if (!value) {
        return '';
    }

    return value.slice(0, 10);
}

export function buildProfileFormData(user: User): ProfileFormData {
    const split = splitFullName(user.name);

    return {
        first_name: (user.first_name as string | undefined) ?? split.first_name,
        middle_name: (user.middle_name as string | undefined) ?? split.middle_name,
        last_name: (user.last_name as string | undefined) ?? split.last_name,
        email: user.email,
        phone: (user.phone as string | undefined) ?? '',
        sex: (user.sex as string | undefined) ?? '',
        birthdate: formatDateInput(user.birthdate as string | undefined),
        address: (user.address as string | undefined) ?? '',
        occupation: (user.occupation as string | undefined) ?? '',
        bio: (user.bio as string | undefined) ?? '',
        avatar: null,
        remove_avatar: false,
    };
}

export function submitProfileForm(form: InertiaFormProps<ProfileFormData>, onSuccess?: () => void) {
    const resetUploadState = () => {
        form.setData('avatar', null);
        form.setData('remove_avatar', false);
        onSuccess?.();
    };

    const options = {
        onSuccess: resetUploadState,
        successToast: { title: 'Profile saved', message: 'Your profile information has been updated.' },
    };

    if (formHasFileUpload(form.data as Record<string, unknown>) || form.data.remove_avatar) {
        submitMultipartPatch(form, route('profile.update'), options);
        return;
    }

    form.patch(route('profile.update'), options);
}

export function ProfileForm({ form, user, mustVerifyEmail, verificationStatus, onSubmit }: ProfileFormProps) {
    const { data, setData, processing, errors, recentlySuccessful } = form;
    const displayName = composeFullName(data.first_name, data.middle_name, data.last_name);

    return (
        <form onSubmit={onSubmit} className="space-y-5">
            <FormSection title="Personal details" description="Your name, photo, and basic demographic information.">
                <AvatarField
                    error={errors.avatar}
                    name={displayName || user.name}
                    existingUrl={user.avatar_url}
                    file={data.avatar}
                    removeAvatar={data.remove_avatar}
                    variant="stacked"
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

            <FormSection title="Contact & professional info" description="How we reach you and a short professional summary.">
                <div className="grid gap-4 sm:grid-cols-2">
                    <FormField error={errors.email}>
                        <Label>Email address</Label>
                        <Description>Used for sign-in and notifications.</Description>
                        <Input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                            autoComplete="username"
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
                    <Description>A short summary visible to mentors and on your learning profile.</Description>
                    <Textarea
                        value={data.bio}
                        onChange={(e) => setData('bio', e.target.value)}
                        rows={3}
                        placeholder="Brief background, interests, or goals…"
                    />
                </FormField>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="rounded-lg border border-amber-200/80 bg-amber-50/80 px-4 py-3 text-sm text-amber-950 dark:border-amber-500/20 dark:bg-amber-950/30 dark:text-amber-100">
                        <p>
                            Your email address is unverified.{' '}
                            <button
                                type="button"
                                className="font-medium underline"
                                onClick={() => router.post(route('verification.send'))}
                            >
                                Resend verification email
                            </button>
                        </p>
                        {verificationStatus === 'verification-link-sent' && (
                            <p className="mt-2 font-medium text-emerald-700 dark:text-emerald-300">
                                A new verification link has been sent to your email address.
                            </p>
                        )}
                    </div>
                )}
            </FormSection>

            <div className="flex items-center gap-4 rounded-xl border border-slate-200/80 bg-slate-50/80 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/60">
                <Button type="submit" color="dark/zinc" disabled={processing}>
                    {processing ? 'Saving…' : 'Save changes'}
                </Button>

                <Transition
                    show={recentlySuccessful}
                    enter="transition ease-in-out"
                    enterFrom="opacity-0"
                    leave="transition ease-in-out"
                    leaveTo="opacity-0"
                >
                    <span className="text-sm text-slate-600 dark:text-slate-300">Saved</span>
                </Transition>
            </div>
        </form>
    );
}
