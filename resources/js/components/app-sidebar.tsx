import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarBody, SidebarFooter, SidebarHeader, SidebarItem, SidebarSection } from '@/components/catalyst/sidebar';
import { type NavItem, type SharedData } from '@/types';
import {
    AcademicCapIcon,
    BookOpenIcon,
    ChartBarIcon,
    ClipboardDocumentCheckIcon,
    ClipboardDocumentListIcon,
    RocketLaunchIcon,
    ShieldCheckIcon,
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

function buildNavItems(roles: string[], capstoneUnlocked: boolean): NavItem[] {
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
            { title: 'Capstone Templates', url: '/admin/capstone-templates', matchPrefix: '/admin/capstone-templates', icon: RocketLaunchIcon },
            { title: 'Analytics', url: '/admin/analytics', matchPrefix: '/admin/analytics', icon: ChartBarIcon },
            { title: 'Enrollments', url: '/admin/enrollments', matchPrefix: '/admin/enrollments', icon: ClipboardDocumentListIcon },
            { title: 'Users', url: '/admin/users', matchPrefix: '/admin/users', icon: UsersIcon },
        );
    }

    if (roles.includes('mentor')) {
        items.push(
            { title: 'My Interns', url: '/mentor/interns', matchPrefix: '/mentor/interns', icon: UserGroupIcon },
            { title: 'Code Reviews', url: '/mentor/reviews', matchPrefix: '/mentor/reviews', icon: ClipboardDocumentCheckIcon },
            { title: 'Milestone Reviews', url: '/mentor/capstone-reviews', matchPrefix: '/mentor/capstone-reviews', icon: RocketLaunchIcon },
        );
    }

    if (roles.includes('intern')) {
        items.push(
            {
                title: 'Learn',
                url: '/learn/paths',
                matchPrefix: '/learn',
                excludePrefixes: ['/learn/leaderboard', '/learn/certificates', '/learn/capstone'],
                icon: BookOpenIcon,
            },
            { title: 'Leaderboard', url: '/learn/leaderboard', matchPrefix: '/learn/leaderboard', icon: ChartBarIcon },
            { title: 'Certificates', url: '/learn/certificates', matchPrefix: '/learn/certificates', icon: ShieldCheckIcon },
        );

        if (capstoneUnlocked) {
            items.push({ title: 'Capstone', url: '/learn/capstone', matchPrefix: '/learn/capstone', icon: RocketLaunchIcon });
        }
    }

    return items;
}

export function AppSidebar() {
    const { auth, capstone } = usePage<SharedData & { capstone?: { unlocked: boolean } | null }>().props;
    const roles = auth.roles ?? [];
    const mainNavItems = buildNavItems(roles, capstone?.unlocked ?? false);

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
