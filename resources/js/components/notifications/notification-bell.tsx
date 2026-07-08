import { fetchJson } from '@/lib/fetch-json';
import { BellIcon } from '@heroicons/react/20/solid';
import { router } from '@inertiajs/react';
import clsx from 'clsx';
import { useCallback, useEffect, useRef, useState } from 'react';

interface NotificationItem {
    id: string;
    type: string;
    data: {
        type?: string;
        certificate_number?: string;
        path_name?: string;
        certificate_id?: number;
    };
    read_at: string | null;
    created_at: string;
}

interface NotificationBellProps {
    unreadCount?: number;
}

export function NotificationBell({ unreadCount = 0 }: NotificationBellProps) {
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState<NotificationItem[]>([]);
    const [count, setCount] = useState(unreadCount);
    const panelRef = useRef<HTMLDivElement>(null);

    const load = useCallback(async () => {
        const data = await fetchJson<{ notifications: NotificationItem[]; unread_count: number }>(
            route('notifications.index'),
        );
        setItems(data.notifications);
        setCount(data.unread_count);
    }, []);

    useEffect(() => {
        setCount(unreadCount);
    }, [unreadCount]);

    useEffect(() => {
        if (!open) {
            return;
        }

        load();
    }, [open, load]);

    useEffect(() => {
        function onClickOutside(event: MouseEvent) {
            if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }

        if (open) {
            document.addEventListener('mousedown', onClickOutside);
        }

        return () => document.removeEventListener('mousedown', onClickOutside);
    }, [open]);

    async function markRead(id: string) {
        await fetchJson(route('notifications.read', id), { method: 'PATCH' });
        await load();
    }

    async function markAllRead() {
        await fetchJson(route('notifications.read-all'), { method: 'POST' });
        await load();
    }

    function handleClick(item: NotificationItem) {
        if (!item.read_at) {
            markRead(item.id);
        }

        if (item.data.certificate_id) {
            router.visit(route('learn.certificates.show', item.data.certificate_id));
            setOpen(false);
        }
    }

    return (
        <div className="relative" ref={panelRef}>
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="relative flex size-9 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-zinc-950/5 hover:text-zinc-700 dark:hover:bg-white/5 dark:hover:text-zinc-300"
                aria-label="Notifications"
            >
                <BellIcon className="size-5" />
                {count > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-blue-600 text-[9px] font-bold text-white">
                        {count > 9 ? '9+' : count}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute top-full right-0 z-50 mt-2 w-80 overflow-hidden rounded-xl border border-zinc-950/10 bg-white shadow-lg dark:border-white/10 dark:bg-zinc-900">
                    <div className="flex items-center justify-between border-b border-zinc-950/5 px-3 py-2.5 dark:border-white/5">
                        <p className="text-xs font-semibold text-zinc-950 dark:text-white">Notifications</p>
                        {count > 0 && (
                            <button
                                type="button"
                                onClick={markAllRead}
                                className="text-[10px] font-medium text-blue-600 hover:underline"
                            >
                                Mark all read
                            </button>
                        )}
                    </div>
                    <ul className="max-h-72 overflow-y-auto">
                        {items.length === 0 ? (
                            <li className="px-4 py-8 text-center text-xs text-zinc-500">No notifications yet</li>
                        ) : (
                            items.map((item) => (
                                <li key={item.id}>
                                    <button
                                        type="button"
                                        onClick={() => handleClick(item)}
                                        className={clsx(
                                            'w-full px-3 py-2.5 text-left transition hover:bg-zinc-50 dark:hover:bg-zinc-800/50',
                                            !item.read_at && 'bg-blue-50/50 dark:bg-blue-950/20',
                                        )}
                                    >
                                        <p className="text-xs font-medium text-zinc-950 dark:text-white">
                                            {item.data.type === 'certificate_issued'
                                                ? 'Certificate ready'
                                                : 'Notification'}
                                        </p>
                                        <p className="mt-0.5 text-[11px] text-zinc-500">
                                            {item.data.path_name ?? item.data.certificate_number ?? 'View details'}
                                        </p>
                                    </button>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}
