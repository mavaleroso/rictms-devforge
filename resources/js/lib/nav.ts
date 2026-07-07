import type { NavItem } from '@/types';

/** Strip query/hash and trailing slashes for stable path comparison. */
export function normalizePath(url: string): string {
    const pathname = url.startsWith('http') ? new URL(url).pathname : url.split('?')[0].split('#')[0];

    if (pathname === '/') {
        return pathname;
    }

    return pathname.replace(/\/$/, '');
}

export function isNavItemActive(item: NavItem, currentUrl: string): boolean {
    if (item.isActive !== undefined) {
        return item.isActive;
    }

    const currentPath = normalizePath(currentUrl);
    const itemPath = normalizePath(item.url);

    if (item.matchPrefix) {
        const prefix = normalizePath(item.matchPrefix);

        return currentPath === prefix || currentPath.startsWith(`${prefix}/`);
    }

    return currentPath === itemPath;
}
