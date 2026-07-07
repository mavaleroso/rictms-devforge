import { Button } from '@/components/catalyst/button';
import { Dialog, DialogActions, DialogDescription, DialogTitle } from '@/components/catalyst/dialog';
import {
    ArrowPathIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    QuestionMarkCircleIcon,
} from '@heroicons/react/20/solid';
import clsx from 'clsx';
import { useCallback, useRef, useState, type ComponentType, type SVGProps } from 'react';

export type ConfirmTone = 'default' | 'success' | 'warning' | 'danger';

/** @deprecated Use `tone` instead. `variant: 'danger'` still maps to the danger tone. */
export type ConfirmVariant = 'default' | 'danger';

export interface ConfirmOptions {
    title: string;
    description: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: ConfirmVariant;
    tone?: ConfirmTone;
}

interface PendingConfirm extends ConfirmOptions {
    resolve: (confirmed: boolean) => void;
}

interface ConfirmDialogProps {
    open: boolean;
    title: string;
    description: string;
    confirmLabel?: string;
    cancelLabel?: string;
    tone?: ConfirmTone;
    processing?: boolean;
    onConfirm: () => void;
    onClose: () => void;
}

type ToneConfig = {
    eyebrow: string;
    Icon: ComponentType<SVGProps<SVGSVGElement>>;
    headerBg: string;
    iconWrap: string;
    iconColor: string;
    confirmButtonColor: 'dark/zinc' | 'red' | 'amber' | 'emerald';
};

const toneConfig: Record<ConfirmTone, ToneConfig> = {
    default: {
        eyebrow: 'Please confirm',
        Icon: QuestionMarkCircleIcon,
        headerBg: 'bg-gradient-to-b from-violet-500/[0.06] to-transparent dark:from-violet-400/[0.08]',
        iconWrap: 'bg-violet-500/10 ring-1 ring-violet-500/20 dark:bg-violet-400/10 dark:ring-violet-400/25',
        iconColor: 'text-violet-600 dark:text-violet-400',
        confirmButtonColor: 'dark/zinc',
    },
    success: {
        eyebrow: 'Ready to continue',
        Icon: CheckCircleIcon,
        headerBg: 'bg-gradient-to-b from-emerald-500/[0.07] to-transparent dark:from-emerald-400/[0.08]',
        iconWrap: 'bg-emerald-500/10 ring-1 ring-emerald-500/20 dark:bg-emerald-400/10 dark:ring-emerald-400/25',
        iconColor: 'text-emerald-600 dark:text-emerald-400',
        confirmButtonColor: 'emerald',
    },
    warning: {
        eyebrow: 'Before you continue',
        Icon: ExclamationTriangleIcon,
        headerBg: 'bg-gradient-to-b from-amber-500/[0.08] to-transparent dark:from-amber-400/[0.08]',
        iconWrap: 'bg-amber-500/10 ring-1 ring-amber-500/20 dark:bg-amber-400/10 dark:ring-amber-400/25',
        iconColor: 'text-amber-600 dark:text-amber-400',
        confirmButtonColor: 'amber',
    },
    danger: {
        eyebrow: 'This cannot be undone',
        Icon: ExclamationTriangleIcon,
        headerBg: 'bg-gradient-to-b from-red-500/[0.07] to-transparent dark:from-red-400/[0.08]',
        iconWrap: 'bg-red-500/10 ring-1 ring-red-500/20 dark:bg-red-400/10 dark:ring-red-400/25',
        iconColor: 'text-red-600 dark:text-red-400',
        confirmButtonColor: 'red',
    },
};

function resolveTone(options: Pick<ConfirmOptions, 'variant' | 'tone'>): ConfirmTone {
    if (options.tone) {
        return options.tone;
    }

    if (options.variant === 'danger') {
        return 'danger';
    }

    return 'default';
}

export function ConfirmDialog({
    open,
    title,
    description,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    tone = 'default',
    processing = false,
    onConfirm,
    onClose,
}: ConfirmDialogProps) {
    const config = toneConfig[tone];
    const Icon = config.Icon;

    return (
        <Dialog open={open} onClose={processing ? () => {} : onClose} size="sm" className="!p-0 overflow-hidden">
            <div className={clsx('px-6 pt-6', config.headerBg)}>
                <div className="flex items-start gap-4">
                    <div
                        className={clsx(
                            'flex size-12 shrink-0 items-center justify-center rounded-xl shadow-sm',
                            config.iconWrap,
                        )}
                    >
                        <Icon className={clsx('size-6', config.iconColor)} aria-hidden />
                    </div>

                    <div className="min-w-0 flex-1 pb-1">
                        <p className="text-[11px] font-semibold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
                            {config.eyebrow}
                        </p>
                        <DialogTitle className="!mt-1 text-lg/7 font-semibold text-zinc-950 dark:text-white">
                            {title}
                        </DialogTitle>
                    </div>
                </div>
            </div>

            <div className="px-6 pt-4 pb-1">
                <DialogDescription className="!mt-0 text-sm/6 text-pretty text-zinc-600 dark:text-zinc-400">
                    {description}
                </DialogDescription>
            </div>

            <DialogActions className="!mt-0 gap-2 border-t border-zinc-950/5 bg-zinc-50/70 px-6 py-4 dark:border-white/10 dark:bg-white/[0.02]">
                <Button plain onClick={onClose} disabled={processing}>
                    {cancelLabel}
                </Button>
                <Button color={config.confirmButtonColor} onClick={onConfirm} disabled={processing}>
                    {processing ? (
                        <>
                            <ArrowPathIcon data-slot="icon" className="animate-spin" />
                            Working…
                        </>
                    ) : (
                        confirmLabel
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export function useConfirmDialog() {
    const pendingRef = useRef<PendingConfirm | null>(null);
    const [pending, setPending] = useState<PendingConfirm | null>(null);

    const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
        return new Promise((resolve) => {
            const entry: PendingConfirm = { ...options, resolve };
            pendingRef.current = entry;
            setPending(entry);
        });
    }, []);

    const close = useCallback(() => {
        pendingRef.current?.resolve(false);
        pendingRef.current = null;
        setPending(null);
    }, []);

    const handleConfirm = useCallback(() => {
        pendingRef.current?.resolve(true);
        pendingRef.current = null;
        setPending(null);
    }, []);

    const ConfirmDialogSlot = useCallback(
        () =>
            pending ? (
                <ConfirmDialog
                    open
                    title={pending.title}
                    description={pending.description}
                    confirmLabel={pending.confirmLabel}
                    cancelLabel={pending.cancelLabel}
                    tone={resolveTone(pending)}
                    onConfirm={handleConfirm}
                    onClose={close}
                />
            ) : null,
        [pending, handleConfirm, close],
    );

    return { confirm, ConfirmDialog: ConfirmDialogSlot };
}
