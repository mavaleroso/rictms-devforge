import { SidebarHeading, SidebarItem, SidebarLabel, SidebarSection } from '@/components/catalyst/sidebar';
import { isNavItemActive } from '@/lib/nav';
import { type NavItem } from '@/types';
import { usePage } from '@inertiajs/react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();

    return (
        <SidebarSection>
            <SidebarHeading>Platform</SidebarHeading>
            {items.map((item) => (
                <SidebarItem key={item.title} href={item.url} current={isNavItemActive(item, page.url)}>
                    {item.icon && <item.icon data-slot="icon" />}
                    <SidebarLabel>{item.title}</SidebarLabel>
                </SidebarItem>
            ))}
        </SidebarSection>
    );
}
