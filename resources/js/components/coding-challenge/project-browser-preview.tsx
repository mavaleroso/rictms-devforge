import { buildProjectPreviewModel, type PreviewRoute } from '@/lib/coding-challenge-library/project-preview';
import {
    ArrowPathIcon,
    ArrowLeftIcon,
    ArrowRightIcon,
    GlobeAltIcon,
} from '@heroicons/react/20/solid';
import clsx from 'clsx';
import { useEffect, useMemo, useState, type FormEvent } from 'react';

interface ProjectBrowserPreviewProps {
    files: Record<string, string>;
    className?: string;
    refreshKey?: number;
    previewUrl?: string | null;
    previewPath?: string | null;
}

function normalizePath(value: string): string {
    const trimmed = value.trim();

    if (!trimmed || trimmed === '/') {
        return '/';
    }

    const withoutOrigin = trimmed.replace(/^https?:\/\/[^/]+/i, '');
    const path = withoutOrigin.startsWith('/') ? withoutOrigin : `/${withoutOrigin}`;

    return path.split('?')[0] || '/';
}

function joinPreviewUrl(base: string, path: string): string {
    const normalizedBase = base.replace(/\/$/, '');
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;

    return `${normalizedBase}${normalizedPath === '/' ? '/' : normalizedPath}`;
}

export function ProjectBrowserPreview({
    files,
    className,
    refreshKey = 0,
    previewUrl = null,
    previewPath = '/',
}: ProjectBrowserPreviewProps) {
    const liveMode = Boolean(previewUrl);
    const initialPath = previewPath || '/';
    const [path, setPath] = useState(initialPath);
    const [address, setAddress] = useState(
        liveMode ? joinPreviewUrl(previewUrl!, initialPath) : `http://127.0.0.1:8000${initialPath}`,
    );
    const [history, setHistory] = useState<string[]>([initialPath]);
    const [historyIndex, setHistoryIndex] = useState(0);
    const [frameKey, setFrameKey] = useState(0);
    const [loadError, setLoadError] = useState(false);

    const fallback = useMemo(() => buildProjectPreviewModel(files, path), [files, path, refreshKey]);

    useEffect(() => {
        setAddress(liveMode ? joinPreviewUrl(previewUrl!, path) : `http://127.0.0.1:8000${path}`);
        setLoadError(false);
    }, [path, liveMode, previewUrl]);

    useEffect(() => {
        setFrameKey((key) => key + 1);
        setLoadError(false);
    }, [refreshKey]);

    const navigate = (nextPath: string) => {
        const normalized = normalizePath(nextPath);
        setPath(normalized);

        setHistory((current) => {
            const truncated = current.slice(0, historyIndex + 1);

            if (truncated[truncated.length - 1] === normalized) {
                return truncated;
            }

            const next = [...truncated, normalized];
            setHistoryIndex(next.length - 1);

            return next;
        });
    };

    const goBack = () => {
        if (historyIndex <= 0) {
            return;
        }

        const nextIndex = historyIndex - 1;
        setHistoryIndex(nextIndex);
        setPath(history[nextIndex] ?? '/');
    };

    const goForward = () => {
        if (historyIndex >= history.length - 1) {
            return;
        }

        const nextIndex = historyIndex + 1;
        setHistoryIndex(nextIndex);
        setPath(history[nextIndex] ?? '/');
    };

    const refresh = () => {
        setFrameKey((key) => key + 1);
        setLoadError(false);
    };

    const submitAddress = (event: FormEvent) => {
        event.preventDefault();
        navigate(address);
    };

    const routeChips: PreviewRoute[] = liveMode
        ? [
              { path: '/', name: 'home' },
              { path: '/about', name: 'about' },
              { path: '/login', name: 'login' },
              { path: '/register', name: 'register' },
          ]
        : fallback.routes;

    const iframeSrc = liveMode ? `${joinPreviewUrl(previewUrl!, path)}?_preview=${frameKey}` : undefined;

    return (
        <div className={clsx('flex h-full min-h-0 flex-col bg-[#1e1e1e]', className)}>
            <div className="flex shrink-0 items-center gap-2 border-b border-[#3c3c3c] bg-[#252526] px-2 py-1.5">
                <GlobeAltIcon className="size-4 shrink-0 text-[#cccccc]" />
                <p className="text-[11px] font-semibold tracking-wide text-[#bbbbbb] uppercase">Simple Browser</p>
                <span
                    className={clsx(
                        'rounded px-1.5 py-0.5 text-[10px]',
                        liveMode ? 'bg-[#388a34]/30 text-[#b5cea8]' : 'bg-[#0e639c]/30 text-[#9cdcfe]',
                    )}
                >
                    {liveMode ? 'Live app' : 'Static preview'}
                </span>
            </div>

            <div className="flex shrink-0 items-center gap-1 border-b border-[#3c3c3c] bg-[#2d2d2d] px-2 py-1.5">
                <button
                    type="button"
                    title="Back"
                    onClick={goBack}
                    disabled={historyIndex <= 0}
                    className="rounded p-1 text-[#cccccc] hover:bg-[#3c3c3c] disabled:opacity-30"
                >
                    <ArrowLeftIcon className="size-3.5" />
                </button>
                <button
                    type="button"
                    title="Forward"
                    onClick={goForward}
                    disabled={historyIndex >= history.length - 1}
                    className="rounded p-1 text-[#cccccc] hover:bg-[#3c3c3c] disabled:opacity-30"
                >
                    <ArrowRightIcon className="size-3.5" />
                </button>
                <button type="button" title="Reload" onClick={refresh} className="rounded p-1 text-[#cccccc] hover:bg-[#3c3c3c]">
                    <ArrowPathIcon className="size-3.5" />
                </button>

                <form onSubmit={submitAddress} className="min-w-0 flex-1">
                    <input
                        value={address}
                        onChange={(event) => setAddress(event.target.value)}
                        className="w-full rounded-full border border-[#3c3c3c] bg-[#1e1e1e] px-3 py-1 text-[12px] text-[#cccccc] outline-none focus:border-[#007acc]"
                        aria-label="Address bar"
                        spellCheck={false}
                    />
                </form>
            </div>

            {routeChips.length > 0 && (
                <div className="flex shrink-0 gap-1 overflow-x-auto border-b border-[#3c3c3c] bg-[#252526] px-2 py-1">
                    {routeChips.map((route) => {
                        const active = path === route.path;

                        return (
                            <button
                                key={`${route.path}:${route.name ?? ''}`}
                                type="button"
                                onClick={() => navigate(route.path)}
                                className={clsx(
                                    'shrink-0 rounded px-2 py-0.5 text-[10px]',
                                    active ? 'bg-[#094771] text-white' : 'bg-[#3c3c3c] text-[#cccccc] hover:bg-[#4a4a4a]',
                                )}
                            >
                                {route.path}
                                {route.name ? ` · ${route.name}` : ''}
                            </button>
                        );
                    })}
                </div>
            )}

            <div className="relative min-h-0 flex-1 bg-white">
                {liveMode ? (
                    <>
                        <iframe
                            key={`${path}:${frameKey}`}
                            title="Project preview"
                            src={iframeSrc}
                            className="h-full w-full border-0 bg-white"
                            onError={() => setLoadError(true)}
                        />
                        {loadError && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-zinc-50 p-6 text-center text-sm text-zinc-600">
                                <p className="font-medium text-zinc-900">Preview server not reachable</p>
                                <p>
                                    Run <code className="rounded bg-zinc-200 px-1">php artisan challenge:serve-template</code> then
                                    reload.
                                </p>
                                <p className="text-xs text-zinc-500">For React HMR also run `npm run dev` in the template folder.</p>
                            </div>
                        )}
                    </>
                ) : (
                    <iframe
                        key={`${path}:${frameKey}:${refreshKey}`}
                        title="Project preview"
                        srcDoc={fallback.html}
                        sandbox=""
                        className="h-full w-full border-0 bg-white"
                    />
                )}
            </div>

            <div className="shrink-0 border-t border-[#3c3c3c] bg-[#252526] px-2 py-1 text-[10px] text-[#858585]">
                {liveMode
                    ? 'Live preview loads the installed starter kit. Run syncs your editor files into that project.'
                    : 'Sandbox preview mirrors props/routes from your files — not a live PHP server.'}
            </div>
        </div>
    );
}
