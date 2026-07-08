import clsx from 'clsx';

interface CompletionChartProps {
    data: Array<{ label: string; completions: number; certificates: number }>;
}

export function CompletionChart({ data }: CompletionChartProps) {
    const max = Math.max(...data.flatMap((d) => [d.completions, d.certificates]), 1);

    return (
        <div className="flex h-40 items-end gap-2">
            {data.map((point) => (
                <div key={point.label} className="flex flex-1 flex-col items-center gap-1">
                    <div className="flex w-full items-end justify-center gap-0.5" style={{ height: '120px' }}>
                        <div
                            className="w-2.5 rounded-t bg-emerald-500/80 transition-all"
                            style={{ height: `${(point.completions / max) * 100}%`, minHeight: point.completions > 0 ? '4px' : 0 }}
                            title={`${point.completions} completions`}
                        />
                        <div
                            className="w-2.5 rounded-t bg-blue-500/80 transition-all"
                            style={{ height: `${(point.certificates / max) * 100}%`, minHeight: point.certificates > 0 ? '4px' : 0 }}
                            title={`${point.certificates} certificates`}
                        />
                    </div>
                    <span className="text-[10px] font-medium text-zinc-500">{point.label}</span>
                </div>
            ))}
        </div>
    );
}

interface PathBreakdownProps {
    items: Array<{ path: string; completed: number; active: number }>;
}

export function PathBreakdown({ items }: PathBreakdownProps) {
    if (items.length === 0) {
        return <p className="text-xs text-zinc-500">No enrollment data yet.</p>;
    }

    return (
        <ul className="space-y-3">
            {items.map((item) => {
                const total = item.completed + item.active;
                const pct = total > 0 ? Math.round((item.completed / total) * 100) : 0;

                return (
                    <li key={item.path}>
                        <div className="flex items-center justify-between gap-2 text-xs">
                            <span className="truncate font-medium text-zinc-700 dark:text-zinc-300">{item.path}</span>
                            <span className="shrink-0 tabular-nums text-zinc-500">
                                {item.completed}/{total} · {pct}%
                            </span>
                        </div>
                        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                            <div
                                className={clsx('h-full rounded-full bg-gradient-to-r from-emerald-500 to-green-500')}
                                style={{ width: `${pct}%` }}
                            />
                        </div>
                    </li>
                );
            })}
        </ul>
    );
}
