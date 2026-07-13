import AppLogo from '@/components/app-logo';
import AppLogoIcon from '@/components/app-logo-icon';
import { NavUser } from '@/components/nav-user';
import { NotificationBell } from '@/components/notifications/notification-bell';
import { buildNavItems } from '@/lib/app-nav';
import { isNavItemActive } from '@/lib/nav';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import clsx from 'clsx';

export function AppNavbar() {
    const page = usePage<
        SharedData & { notifications?: { unread_count: number } | null; capstone?: { unlocked: boolean } | null }
    >();
    const { notifications, capstone } = page.props;
    const items = buildNavItems(page.props.auth.roles ?? [], capstone?.unlocked ?? false);

    return (
        <div className="flex w-full items-stretch gap-6">
            <div className="flex min-w-0 flex-1 items-center gap-6 lg:gap-8">
                <Link
                    href="/dashboard"
                    className="hidden shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-brand-300/40 lg:block"
                    aria-label="Home"
                >
                    <AppLogo variant="onDark" />
                </Link>

                <Link
                    href="/dashboard"
                    className="flex min-w-0 items-center gap-2.5 outline-none focus-visible:ring-2 focus-visible:ring-brand-300/40 lg:hidden"
                    aria-label="Home"
                >
                    <span className="flex size-8 items-center justify-center rounded-md bg-white/10 ring-1 ring-white/15">
                        <AppLogoIcon className="size-4 fill-white" />
                    </span>
                    <span className="truncate text-[15px] font-semibold tracking-tight text-white">DevForge</span>
                </Link>

                <nav className="hidden min-w-0 items-center gap-0.5 lg:flex" aria-label="Primary">
                    {items.map((item) => {
                        const active = isNavItemActive(item, page.url);
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.title}
                                href={item.url}
                                className={clsx(
                                    'relative inline-flex items-center gap-2 px-3 py-5 text-[13px] font-medium tracking-wide transition',
                                    active ? 'text-white' : 'text-brand-200/80 hover:bg-white/5 hover:text-white',
                                )}
                            >
                                {Icon && (
                                    <Icon
                                        className={clsx(
                                            'size-4 shrink-0',
                                            active ? 'text-brand-200' : 'text-brand-300/70',
                                        )}
                                    />
                                )}
                                {item.title}
                                {active && (
                                    <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-brand-300" />
                                )}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="flex shrink-0 items-center gap-1 border-l border-white/10 pl-4 sm:gap-2 sm:pl-5">
                <NotificationBell unreadCount={notifications?.unread_count ?? 0} tone="onDark" />
                <NavUser variant="navbar" />
            </div>
        </div>
    );
}
