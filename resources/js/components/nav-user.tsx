import { UserMenuContent } from '@/components/user-menu-content';
import { Avatar } from '@/components/catalyst/avatar';
import { Dropdown, DropdownButton } from '@/components/catalyst/dropdown';
import { SidebarItem } from '@/components/catalyst/sidebar';
import { useInitials } from '@/hooks/use-initials';
import { formatDisplayName } from '@/lib/user-profile';
import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/16/solid';

export function NavUser({ variant = 'sidebar' }: { variant?: 'sidebar' | 'navbar' }) {
    const { auth } = usePage<SharedData>().props;
    const getInitials = useInitials();

    if (!auth.user) {
        return null;
    }

    const displayName = formatDisplayName(auth.user);

    if (variant === 'navbar') {
        return (
            <Dropdown>
                <DropdownButton
                    as="button"
                    type="button"
                    className="inline-flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-[13px] font-medium text-white transition hover:bg-white/10"
                    aria-label="Account menu"
                >
                    <Avatar
                        src={auth.user.avatar_url ?? auth.user.avatar}
                        initials={getInitials(displayName)}
                        alt={displayName}
                        className="size-7 ring-1 ring-white/20"
                        square
                    />
                    <span className="hidden max-w-[10rem] truncate sm:block">{displayName}</span>
                    <ChevronDownIcon className="size-3.5 text-brand-200" />
                </DropdownButton>
                <UserMenuContent user={auth.user} anchor="bottom end" />
            </Dropdown>
        );
    }

    return (
        <Dropdown>
            <DropdownButton as={SidebarItem}>
                <span className="flex min-w-0 items-center gap-3">
                    <Avatar
                        src={auth.user.avatar_url ?? auth.user.avatar}
                        initials={getInitials(displayName)}
                        alt={displayName}
                        className="size-10"
                        square
                    />
                    <span className="min-w-0">
                        <span className="block truncate text-sm/5 font-medium text-white">{displayName}</span>
                        <span className="block truncate text-xs/5 font-normal text-brand-200/75">{auth.user.email}</span>
                    </span>
                </span>
                <ChevronUpIcon data-slot="icon" />
            </DropdownButton>
            <UserMenuContent user={auth.user} anchor="top start" />
        </Dropdown>
    );
}
