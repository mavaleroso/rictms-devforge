import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarBody, SidebarFooter, SidebarHeader, SidebarItem, SidebarSection } from '@/components/catalyst/sidebar';
import { type NavItem } from '@/types';
import { BookOpenIcon, FolderIcon, Squares2X2Icon } from '@heroicons/react/20/solid';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        url: '/dashboard',
        icon: Squares2X2Icon,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        url: 'https://github.com/laravel/react-starter-kit',
        icon: FolderIcon,
    },
    {
        title: 'Documentation',
        url: 'https://laravel.com/docs/starter-kits',
        icon: BookOpenIcon,
    },
];

export function AppSidebar() {
    return (
        <Sidebar>
            <SidebarHeader>
                <SidebarSection>
                    <SidebarItem href="/dashboard">
                        <AppLogo />
                    </SidebarItem>
                </SidebarSection>
            </SidebarHeader>

            <SidebarBody>
                <NavMain items={mainNavItems} />
                <NavFooter items={footerNavItems} className="mt-auto" />
            </SidebarBody>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
