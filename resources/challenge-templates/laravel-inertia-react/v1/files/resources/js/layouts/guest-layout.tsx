import type { PropsWithChildren } from 'react';

export function GuestLayout({ children, title }: PropsWithChildren<{ title?: string }>) {
    return (
        <div className="min-h-screen bg-zinc-50 text-zinc-950">
            <header className="border-b border-zinc-200 bg-white px-6 py-4">
                <p className="text-sm font-semibold tracking-tight">{title ?? 'DevForge Lab'}</p>
            </header>
            <main className="mx-auto max-w-3xl px-6 py-10">{children}</main>
        </div>
    );
}
