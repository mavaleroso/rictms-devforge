import { AppSidebar } from '@/components/app-sidebar';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Navbar, NavbarSection, NavbarSpacer } from '@/components/catalyst/navbar';
import { SidebarLayout } from '@/components/catalyst/sidebar-layout';
import { type BreadcrumbItem } from '@/types';

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: {
    children: React.ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}) {
    return (
        <SidebarLayout
            sidebar={<AppSidebar />}
            navbar={
                <Navbar>
                    <NavbarSpacer />
                    <NavbarSection />
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
