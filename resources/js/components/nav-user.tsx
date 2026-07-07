import { UserMenuContent } from '@/components/user-menu-content';
import { Avatar } from '@/components/catalyst/avatar';
import { Dropdown, DropdownButton, DropdownMenu } from '@/components/catalyst/dropdown';
import { SidebarItem } from '@/components/catalyst/sidebar';
import { useInitials } from '@/hooks/use-initials';
import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { ChevronUpIcon } from '@heroicons/react/16/solid';

export function NavUser() {
    const { auth } = usePage<SharedData>().props;
    const getInitials = useInitials();

    if (!auth.user) {
        return null;
    }

    return (
        <Dropdown>
            <DropdownButton as={SidebarItem}>
                <span className="flex min-w-0 items-center gap-3">
                    <Avatar src={auth.user.avatar_url ?? auth.user.avatar} initials={getInitials(auth.user.name)} alt={auth.user.name} className="size-10" square />
                    <span className="min-w-0">
                        <span className="block truncate text-sm/5 font-medium text-zinc-950 dark:text-white">{auth.user.name}</span>
                        <span className="block truncate text-xs/5 font-normal text-zinc-500 dark:text-zinc-400">{auth.user.email}</span>
                    </span>
                </span>
                <ChevronUpIcon data-slot="icon" />
            </DropdownButton>
            <UserMenuContent user={auth.user} anchor="top start" />
        </Dropdown>
    );
}
