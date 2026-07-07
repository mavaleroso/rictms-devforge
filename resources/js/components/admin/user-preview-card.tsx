import { UserRoleBadge } from '@/components/admin/user-role-badge';
import { Avatar } from '@/components/catalyst/avatar';
import { useCoverImagePreview } from '@/hooks/use-cover-image-preview';
import { useInitials } from '@/hooks/use-initials';
import { composeFullName, formatSex } from '@/lib/user-profile';

interface UserPreviewCardProps {
    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
    phone: string;
    sex: string;
    birthdate: string;
    occupation: string;
    address: string;
    bio: string;
    role: string;
    avatarFile: File | null;
    existingAvatarUrl?: string | null;
    removeAvatar?: boolean;
    mode: 'create' | 'edit';
}

export function UserPreviewCard({
    firstName,
    middleName,
    lastName,
    email,
    phone,
    sex,
    birthdate,
    occupation,
    address,
    bio,
    role,
    avatarFile,
    existingAvatarUrl,
    removeAvatar = false,
    mode,
}: UserPreviewCardProps) {
    const getInitials = useInitials();
    const displayUrl = useCoverImagePreview(avatarFile, existingAvatarUrl, removeAvatar);
    const fullName = composeFullName(firstName, middleName, lastName) || 'New user';

    return (
        <div className="overflow-hidden rounded-xl border border-zinc-950/10 bg-white text-sm dark:border-white/10 dark:bg-zinc-900">
            <div className="border-b border-zinc-950/5 bg-zinc-50 px-4 py-2.5 dark:border-white/5 dark:bg-zinc-800/40">
                <p className="text-[11px] font-semibold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">Preview</p>
            </div>

            <div className="p-4">
                <div className="flex items-start gap-3">
                    <Avatar src={displayUrl} initials={getInitials(fullName)} alt={fullName} className="size-12" />
                    <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                            <p className="font-semibold text-zinc-950 dark:text-white">{fullName}</p>
                            <UserRoleBadge role={role} />
                        </div>
                        <p className="mt-0.5 truncate text-xs text-zinc-500">{email || 'email@example.com'}</p>
                    </div>
                </div>

                <dl className="mt-3 space-y-1.5 text-xs text-zinc-600 dark:text-zinc-300">
                    <div className="flex justify-between gap-2">
                        <dt className="text-zinc-400">Phone</dt>
                        <dd className="text-right">{phone || '—'}</dd>
                    </div>
                    <div className="flex justify-between gap-2">
                        <dt className="text-zinc-400">Sex</dt>
                        <dd className="text-right">{formatSex(sex)}</dd>
                    </div>
                    <div className="flex justify-between gap-2">
                        <dt className="text-zinc-400">Birthdate</dt>
                        <dd className="text-right">{birthdate ? new Date(birthdate).toLocaleDateString() : '—'}</dd>
                    </div>
                    <div className="flex justify-between gap-2">
                        <dt className="text-zinc-400">Occupation</dt>
                        <dd className="text-right">{occupation || '—'}</dd>
                    </div>
                </dl>

                {(address || bio) && (
                    <div className="mt-3 space-y-2 border-t border-zinc-950/5 pt-3 text-xs text-zinc-600 dark:border-white/5 dark:text-zinc-300">
                        {address && <p className="line-clamp-2">{address}</p>}
                        {bio && <p className="line-clamp-3 italic">{bio}</p>}
                    </div>
                )}

                <p className="mt-3 text-[11px] text-zinc-400">
                    {mode === 'create' ? 'Account will be created after save.' : 'Changes apply immediately after save.'}
                </p>
            </div>
        </div>
    );
}
