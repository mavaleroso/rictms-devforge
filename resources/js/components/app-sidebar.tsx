import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarBody, SidebarFooter, SidebarHeader, SidebarItem, SidebarSection } from '@/components/catalyst/sidebar';
import { type NavItem, type SharedData } from '@/types';
import {
    AcademicCapIcon,
    BookOpenIcon,
    ClipboardDocumentListIcon,
    Squares2X2Icon,
    UserGroupIcon,
    UsersIcon,
} from '@heroicons/react/20/solid';
import { usePage } from '@inertiajs/react';

const footerNavItems: NavItem[] = [
    {
        title: 'Documentation',
        url: 'https://laravel.com/docs',
        icon: BookOpenIcon,
    },
];

function buildNavItems(roles: string[]): NavItem[] {
    const items: NavItem[] = [
        {
            title: 'Dashboard',
            url: '/dashboard',
            icon: Squares2X2Icon,
        },
    ];

    if (roles.includes('admin')) {
        items.push(
            { title: 'Learning Paths', url: '/admin/paths', matchPrefix: '/admin/paths', icon: AcademicCapIcon },
            { title: 'Enrollments', url: '/admin/enrollments', icon: ClipboardDocumentListIcon },
            { title: 'Users', url: '/admin/users', icon: UsersIcon },
        );
    }

    if (roles.includes('mentor')) {
        items.push({ title: 'My Interns', url: '/mentor/interns', icon: UserGroupIcon });
    }

    if (roles.includes('intern')) {
        items.push({ title: 'Learn', url: '/learn/paths', matchPrefix: '/learn/paths', icon: BookOpenIcon });
    }

    return items;
}

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const roles = auth.roles ?? [];
    const mainNavItems = buildNavItems(roles);

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
