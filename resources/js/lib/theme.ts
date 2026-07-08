/** Shared semantic surface classes for cards and panels. */
export const surfaces = {
    card: 'rounded-xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900',
    cardMuted: 'rounded-xl border border-slate-200/70 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-900/60',
    hero: 'rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white via-brand-50/30 to-slate-50 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-brand-950/30',
    heroDark: 'rounded-2xl border border-slate-800 bg-gradient-to-br from-brand-950 via-brand-900 to-slate-950 text-white',
} as const;

/** Brand accent utilities used across learn surfaces. */
export const accent = {
    text: 'text-brand-700 dark:text-brand-300',
    textSoft: 'text-brand-600 dark:text-brand-400',
    bgSoft: 'bg-brand-50 dark:bg-brand-950/40',
    bgActive: 'bg-brand-50 ring-1 ring-brand-500/15 dark:bg-brand-950/50 dark:ring-brand-400/20',
    border: 'border-brand-200/80 dark:border-brand-800/50',
    progress: 'bg-gradient-to-r from-brand-600 via-brand-500 to-accent-500',
} as const;
