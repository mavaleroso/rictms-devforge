import { LEARNING_TRACKS } from '@/lib/learning-tracks';
import { surfaces } from '@/lib/theme';
import clsx from 'clsx';

interface LearningTrackGridProps {
    compact?: boolean;
    columns?: 1 | 2;
}

export function LearningTrackGrid({ compact = false, columns = 2 }: LearningTrackGridProps) {
    return (
        <div className={clsx('grid gap-3', columns === 2 ? 'sm:grid-cols-2' : 'grid-cols-1')}>
            {LEARNING_TRACKS.map((track) => {
                const Icon = track.icon;

                return (
                    <div
                        key={track.id}
                        className={clsx(
                            'rounded-xl border p-4 ring-1 ring-inset',
                            surfaces.card,
                            track.accent,
                        )}
                    >
                        <div className="flex items-start gap-3">
                            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/70 dark:bg-slate-900/50">
                                <Icon className="size-5" />
                            </span>
                            <div className="min-w-0">
                                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{track.label}</h3>
                                {!compact && (
                                    <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                                        {track.summary}
                                    </p>
                                )}
                            </div>
                        </div>
                        {!compact && (
                            <ul className="mt-3 space-y-1 text-[11px] text-slate-500 dark:text-slate-400">
                                {track.highlights.map((item) => (
                                    <li key={item} className="flex items-center gap-2">
                                        <span className="size-1 rounded-full bg-current opacity-60" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
