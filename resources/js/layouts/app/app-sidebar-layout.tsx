import { AppNavbar } from '@/components/app-navbar';
import { AppSidebar } from '@/components/app-sidebar';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { StackedLayout } from '@/components/catalyst/stacked-layout';
import { type BreadcrumbItem } from '@/types';

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
    flush = false,
}: {
    children: React.ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    flush?: boolean;
}) {
    return (
        <StackedLayout navbar={<AppNavbar />} sidebar={<AppSidebar />} flush={flush}>
            {!flush && breadcrumbs.length > 0 && (
                <div className="mb-6">
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                </div>
            )}
            {flush && breadcrumbs.length > 0 && (
                <div className="border-b border-slate-200/80 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-950">
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                </div>
            )}
            {children}
        </StackedLayout>
    );
}
