import { SidebarItem, SidebarLabel, SidebarSection } from '@/components/catalyst/sidebar';
import { type NavItem } from '@/types';

export function NavFooter({
    items,
    className,
}: {
    items: NavItem[];
    className?: string;
}) {
    return (
        <SidebarSection className={className}>
            {items.map((item) => (
                <SidebarItem key={item.title} href={item.url} target="_blank" rel="noopener noreferrer">
                    {item.icon && <item.icon data-slot="icon" />}
                    <SidebarLabel>{item.title}</SidebarLabel>
                </SidebarItem>
            ))}
        </SidebarSection>
    );
}
