import { Avatar } from '@/components/catalyst/avatar';
import { DropdownDivider, DropdownItem, DropdownLabel, DropdownMenu } from '@/components/catalyst/dropdown';
import { useInitials } from '@/hooks/use-initials';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { type User } from '@/types';
import { router } from '@inertiajs/react';
import { ArrowRightStartOnRectangleIcon, Cog6ToothIcon } from '@heroicons/react/16/solid';

interface UserMenuContentProps {
    user: User;
    anchor?: 'top start' | 'bottom end' | 'bottom start';
}

export function UserMenuContent({ user, anchor = 'bottom end' }: UserMenuContentProps) {
    const cleanup = useMobileNavigation();
    const getInitials = useInitials();

    return (
        <DropdownMenu className="min-w-64" anchor={anchor}>
            <DropdownItem className="pointer-events-none">
                <Avatar slot="icon" src={user.avatar} initials={getInitials(user.name)} alt={user.name} />
                <DropdownLabel>
                    <span className="block truncate font-medium">{user.name}</span>
                    <span className="block truncate text-xs text-zinc-500 dark:text-zinc-400">{user.email}</span>
                </DropdownLabel>
            </DropdownItem>
            <DropdownDivider />
            <DropdownItem href={route('profile.edit')} onClick={cleanup}>
                <Cog6ToothIcon />
                <DropdownLabel>Settings</DropdownLabel>
            </DropdownItem>
            <DropdownDivider />
            <DropdownItem
                onClick={() => {
                    cleanup();
                    router.post(route('logout'));
                }}
            >
                <ArrowRightStartOnRectangleIcon />
                <DropdownLabel>Log out</DropdownLabel>
            </DropdownItem>
        </DropdownMenu>
    );
}
