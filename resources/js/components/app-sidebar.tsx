import AppLogo from '@/components/app-logo';
import { Sidebar, SidebarBody, SidebarFooter, SidebarHeader, SidebarItem, SidebarSection } from '@/components/catalyst/sidebar';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { buildNavItems } from '@/lib/app-nav';
import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

/** Mobile drawer navigation — desktop uses AppNavbar. */
export function AppSidebar() {
    const { auth, capstone } = usePage<SharedData & { capstone?: { unlocked: boolean } | null }>().props;
    const roles = auth.roles ?? [];
    const mainNavItems = buildNavItems(roles, capstone?.unlocked ?? false);

    return (
        <Sidebar>
            <SidebarHeader>
                <SidebarSection>
                    <SidebarItem href="/dashboard">
                        <AppLogo variant="onDark" />
                    </SidebarItem>
                </SidebarSection>
            </SidebarHeader>

            <SidebarBody>
                <NavMain items={mainNavItems} />
            </SidebarBody>

            <SidebarFooter>
                <NavUser variant="sidebar" />
            </SidebarFooter>
        </Sidebar>
    );
}
