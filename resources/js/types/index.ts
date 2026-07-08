import type { SVGProps } from 'react';

export type IconComponent = React.ComponentType<SVGProps<SVGSVGElement>>;

export interface Auth {
    user: User;
    roles: string[];
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    url: string;
    icon?: IconComponent | null;
    isActive?: boolean;
    /** Keep nav item highlighted for nested routes (e.g. /admin/paths/1/edit). */
    matchPrefix?: string;
    /** Paths that should not activate this item when using matchPrefix. */
    excludePrefixes?: string[];
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    first_name?: string | null;
    middle_name?: string | null;
    last_name?: string | null;
    email: string;
    phone?: string | null;
    sex?: string | null;
    birthdate?: string | null;
    address?: string | null;
    occupation?: string | null;
    bio?: string | null;
    avatar?: string;
    avatar_url?: string | null;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
}
