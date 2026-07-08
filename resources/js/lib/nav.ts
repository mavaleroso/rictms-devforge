import type { NavItem } from '@/types';

/** Strip query/hash and trailing slashes for stable path comparison. */
export function normalizePath(url: string): string {
    const pathname = url.startsWith('http') ? new URL(url).pathname : url.split('?')[0].split('#')[0];

    if (pathname === '/') {
        return pathname;
    }

    return pathname.replace(/\/$/, '');
}

export function matchesPathPrefix(currentUrl: string, prefix: string): boolean {
    const currentPath = normalizePath(currentUrl);
    const normalizedPrefix = normalizePath(prefix);

    return currentPath === normalizedPrefix || currentPath.startsWith(`${normalizedPrefix}/`);
}

export function isExcludedFromNav(currentUrl: string, excludePrefixes: string[]): boolean {
    return excludePrefixes.some((prefix) => matchesPathPrefix(currentUrl, prefix));
}

export function isNavItemActive(item: NavItem, currentUrl: string): boolean {
    if (item.isActive !== undefined) {
        return item.isActive;
    }

    const currentPath = normalizePath(currentUrl);
    const itemPath = normalizePath(item.url);

    if (item.matchPrefix) {
        if (!matchesPathPrefix(currentUrl, item.matchPrefix)) {
            return false;
        }

        if (item.excludePrefixes?.length && isExcludedFromNav(currentUrl, item.excludePrefixes)) {
            return false;
        }

        return true;
    }

    return currentPath === itemPath;
}
