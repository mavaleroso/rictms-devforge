import { Avatar } from '@/components/catalyst/avatar';
import { useInitials } from '@/hooks/use-initials';
import { type User } from '@/types';

export function UserInfo({ user, showEmail = false }: { user: User; showEmail?: boolean }) {
    const getInitials = useInitials();

    return (
        <>
                    <Avatar src={user.avatar_url ?? user.avatar} initials={getInitials(user.name)} alt={user.name} className="size-8" />
            <div className="grid min-w-0 flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                {showEmail && <span className="truncate text-xs text-zinc-500 dark:text-zinc-400">{user.email}</span>}
            </div>
        </>
    );
}
