import { UserRoleBadge, roleDetails } from '@/components/admin/user-role-badge';
import { Avatar } from '@/components/catalyst/avatar';
import { useCoverImagePreview } from '@/hooks/use-cover-image-preview';
import { useInitials } from '@/hooks/use-initials';
import { composeFullName, formatSex } from '@/lib/user-profile';
import {
    BriefcaseIcon,
    CalendarDaysIcon,
    EnvelopeIcon,
    MapPinIcon,
    PhoneIcon,
    UserIcon,
} from '@heroicons/react/20/solid';

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

function PreviewRow({ icon: Icon, label, value }: { icon: typeof UserIcon; label: string; value: string }) {
    if (!value || value === '—') {
        return null;
    }

    return (
        <div className="flex items-start gap-2.5">
            <Icon className="mt-0.5 size-4 shrink-0 text-zinc-400" />
            <div className="min-w-0">
                <p className="text-[10px] font-medium tracking-wide text-zinc-400 uppercase">{label}</p>
                <p className="mt-0.5 text-sm text-zinc-700 dark:text-zinc-200">{value}</p>
            </div>
        </div>
    );
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
    const roleInfo = roleDetails(role);

    return (
        <div className="overflow-hidden rounded-xl border border-zinc-950/10 bg-white shadow-sm dark:border-white/10 dark:bg-zinc-900">
            <div className="border-b border-zinc-950/5 bg-gradient-to-r from-zinc-50 to-white px-4 py-3 dark:border-white/5 dark:from-zinc-800/60 dark:to-zinc-900">
                <p className="text-[11px] font-semibold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
                    Directory preview
                </p>
            </div>

            <div className="p-4">
                <div className="flex items-center gap-3">
                    <Avatar src={displayUrl} initials={getInitials(fullName)} alt={fullName} className="size-14 ring-2 ring-white dark:ring-zinc-900" />
                    <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-zinc-950 dark:text-white">{fullName}</p>
                        <div className="mt-1 flex flex-wrap items-center gap-1.5">
                            <UserRoleBadge role={role} />
                        </div>
                    </div>
                </div>

                <div className="mt-4 space-y-3 border-t border-zinc-950/5 pt-4 dark:border-white/5">
                    <PreviewRow icon={EnvelopeIcon} label="Email" value={email} />
                    <PreviewRow icon={PhoneIcon} label="Phone" value={phone} />
                    <PreviewRow icon={UserIcon} label="Sex" value={formatSex(sex)} />
                    <PreviewRow
                        icon={CalendarDaysIcon}
                        label="Birthdate"
                        value={birthdate ? new Date(birthdate).toLocaleDateString(undefined, { dateStyle: 'medium' }) : ''}
                    />
                    <PreviewRow icon={BriefcaseIcon} label="Occupation" value={occupation} />
                    <PreviewRow icon={MapPinIcon} label="Address" value={address} />
                </div>

                {bio && (
                    <p className="mt-3 border-t border-zinc-950/5 pt-3 text-xs leading-relaxed text-zinc-500 italic dark:border-white/5 dark:text-zinc-400">
                        {bio}
                    </p>
                )}
            </div>

            <div className="border-t border-zinc-950/5 bg-zinc-50/80 px-4 py-3 dark:border-white/5 dark:bg-zinc-800/40">
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    <span className="font-medium text-zinc-700 dark:text-zinc-300">{roleInfo.label}</span>
                    {' · '}
                    {roleInfo.description}
                </p>
                <p className="mt-1.5 text-[11px] text-zinc-400">
                    {mode === 'create' ? 'Saved on create' : 'Updates apply on save'}
                </p>
            </div>
        </div>
    );
}
