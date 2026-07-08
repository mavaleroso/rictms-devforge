import { Avatar } from '@/components/catalyst/avatar';
import { useInitials } from '@/hooks/use-initials';
import { formatDisplayName } from '@/lib/user-profile';
import { type User } from '@/types';

export function UserInfo({ user, showEmail = false }: { user: User; showEmail?: boolean }) {
    const getInitials = useInitials();
    const displayName = formatDisplayName(user);

    return (
        <>
            <Avatar src={user.avatar_url ?? user.avatar} initials={getInitials(displayName)} alt={displayName} className="size-8" />
            <div className="grid min-w-0 flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{displayName}</span>
                {showEmail && <span className="truncate text-xs text-zinc-500 dark:text-zinc-400">{user.email}</span>}
            </div>
        </>
    );
}
