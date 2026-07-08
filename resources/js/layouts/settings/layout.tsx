import Heading from '@/components/heading';
import { Divider } from '@/components/catalyst/divider';
import { Link } from '@/components/catalyst/link';
import { isNavItemActive } from '@/lib/nav';
import { type NavItem } from '@/types';
import { usePage } from '@inertiajs/react';
import clsx from 'clsx';

const sidebarNavItems: NavItem[] = [
    {
        title: 'Profile',
        url: '/settings/profile',
        matchPrefix: '/settings/profile',
        icon: null,
    },
    {
        title: 'Password',
        url: '/settings/password',
        matchPrefix: '/settings/password',
        icon: null,
    },
    {
        title: 'Appearance',
        url: '/settings/appearance',
        matchPrefix: '/settings/appearance',
        icon: null,
    },
    {
        title: 'Integrations',
        url: '/settings/integrations',
        matchPrefix: '/settings/integrations',
        icon: null,
    },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
    const page = usePage();

    return (
        <div>
            <Heading title="Settings" description="Manage your profile and account settings" />

            <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
                <aside className="w-full lg:w-48">
                    <nav className="flex flex-col gap-1">
                        {sidebarNavItems.map((item) => (
                            <Link
                                key={item.url}
                                href={item.url}
                                prefetch
                                className={clsx(
                                    'rounded-lg px-3 py-2 text-sm font-medium',
                                    isNavItemActive(item, page.url)
                                        ? 'bg-zinc-950/5 text-zinc-950 dark:bg-white/10 dark:text-white'
                                        : 'text-zinc-600 hover:bg-zinc-950/5 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-white',
                                )}
                            >
                                {item.title}
                            </Link>
                        ))}
                    </nav>
                </aside>

                <Divider className="lg:hidden" />

                <div className="min-w-0 flex-1">
                    <section className="space-y-12">{children}</section>
                </div>
            </div>
        </div>
    );
}
