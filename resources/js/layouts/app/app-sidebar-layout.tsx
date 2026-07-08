import { AppSidebar } from '@/components/app-sidebar';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Navbar, NavbarSection, NavbarSpacer } from '@/components/catalyst/navbar';
import { SidebarLayout } from '@/components/catalyst/sidebar-layout';
import { NotificationBell } from '@/components/notifications/notification-bell';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

export default function AppSidebarLayout({ children, breadcrumbs = [] }: { children: React.ReactNode; breadcrumbs?: BreadcrumbItem[] }) {
    const { notifications } = usePage<SharedData & { notifications?: { unread_count: number } | null }>().props;

    return (
        <SidebarLayout
            sidebar={<AppSidebar />}
            navbar={
                <Navbar>
                    <NavbarSpacer />
                    <NavbarSection>
                        <NotificationBell unreadCount={notifications?.unread_count ?? 0} />
                    </NavbarSection>
                </Navbar>
            }
        >
            {breadcrumbs.length > 0 && (
                <div className="mb-6">
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                </div>
            )}
            {children}
        </SidebarLayout>
    );
}
