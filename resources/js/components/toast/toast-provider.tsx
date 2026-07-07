import {
    CheckCircleIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon,
    XMarkIcon,
} from '@heroicons/react/20/solid';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'motion/react';
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
    type ComponentType,
    type ReactNode,
    type SVGProps,
} from 'react';

export type ToastVariant = 'error' | 'success' | 'info';

export interface Toast {
    id: string;
    title: string;
    message?: string;
    variant: ToastVariant;
}

interface ToastContextValue {
    toasts: Toast[];
    show: (toast: Omit<Toast, 'id'>) => void;
    showSuccess: (title: string, message?: string) => void;
    dismiss: (id: string) => void;
    showValidationErrors: (errors: Record<string, string>) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const TOAST_DURATION_MS = 6000;

type VariantConfig = {
    icon: ComponentType<SVGProps<SVGSVGElement>>;
    label: string;
    surface: string;
    iconWrap: string;
    iconColor: string;
    progress: string;
    title: string;
    message: string;
};

const variantConfig: Record<ToastVariant, VariantConfig> = {
    error: {
        icon: ExclamationTriangleIcon,
        label: 'Error',
        surface:
            'border-red-200/80 bg-white/95 dark:border-red-500/25 dark:bg-zinc-950/90',
        iconWrap: 'bg-red-500/10 ring-1 ring-red-500/20 dark:bg-red-500/15',
        iconColor: 'text-red-600 dark:text-red-400',
        progress: 'bg-red-500 dark:bg-red-400',
        title: 'text-zinc-950 dark:text-white',
        message: 'text-zinc-600 dark:text-zinc-300',
    },
    success: {
        icon: CheckCircleIcon,
        label: 'Success',
        surface:
            'border-emerald-200/80 bg-white/95 dark:border-emerald-500/25 dark:bg-zinc-950/90',
        iconWrap: 'bg-emerald-500/10 ring-1 ring-emerald-500/20 dark:bg-emerald-500/15',
        iconColor: 'text-emerald-600 dark:text-emerald-400',
        progress: 'bg-emerald-500 dark:bg-emerald-400',
        title: 'text-zinc-950 dark:text-white',
        message: 'text-zinc-600 dark:text-zinc-300',
    },
    info: {
        icon: InformationCircleIcon,
        label: 'Notice',
        surface:
            'border-zinc-200/80 bg-white/95 dark:border-white/10 dark:bg-zinc-950/90',
        iconWrap: 'bg-zinc-500/10 ring-1 ring-zinc-500/15 dark:bg-white/10',
        iconColor: 'text-zinc-600 dark:text-zinc-300',
        progress: 'bg-zinc-500 dark:bg-zinc-400',
        title: 'text-zinc-950 dark:text-white',
        message: 'text-zinc-600 dark:text-zinc-300',
    },
};

function createToastId(): string {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);
    const lastValidationToast = useRef({ signature: '', at: 0 });

    const dismiss = useCallback((id: string) => {
        setToasts((current) => current.filter((toast) => toast.id !== id));
    }, []);

    const show = useCallback((toast: Omit<Toast, 'id'>) => {
        const id = createToastId();

        setToasts((current) => [...current, { ...toast, id }]);
    }, []);

    const showSuccess = useCallback(
        (title: string, message?: string) => {
            show({ variant: 'success', title, message });
        },
        [show],
    );

    const showValidationErrors = useCallback(
        (errors: Record<string, string>) => {
            const messages = Object.values(errors).filter(Boolean);

            if (messages.length === 0) {
                return;
            }

            const signature = JSON.stringify(errors);
            const now = Date.now();

            if (signature === lastValidationToast.current.signature && now - lastValidationToast.current.at < 1000) {
                return;
            }

            lastValidationToast.current = { signature, at: now };

            show({
                variant: 'error',
                title: messages.length === 1 ? messages[0] : 'Please fix the highlighted fields.',
                message: messages.length > 1 ? messages.join(' ') : undefined,
            });
        },
        [show],
    );

    const value = useMemo(
        () => ({ toasts, show, showSuccess, dismiss, showValidationErrors }),
        [toasts, show, showSuccess, dismiss, showValidationErrors],
    );

    return (
        <ToastContext.Provider value={value}>
            {children}
            <ToastViewport toasts={toasts} onDismiss={dismiss} />
        </ToastContext.Provider>
    );
}

export function useToast(): ToastContextValue {
    const context = useContext(ToastContext);

    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }

    return context;
}

function ToastViewport({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: string) => void }) {
    return (
        <div
            aria-live="polite"
            className="pointer-events-none fixed inset-x-0 top-4 z-50 flex flex-col items-center gap-3 px-4"
        >
            <AnimatePresence mode="popLayout">
                {toasts.map((toast) => (
                    <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
                ))}
            </AnimatePresence>
        </div>
    );
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
    const [paused, setPaused] = useState(false);
    const config = variantConfig[toast.variant];
    const Icon = config.icon;

    useEffect(() => {
        if (paused) {
            return;
        }

        const timer = window.setTimeout(() => onDismiss(toast.id), TOAST_DURATION_MS);

        return () => window.clearTimeout(timer);
    }, [paused, toast.id, onDismiss]);

    return (
        <motion.div
            layout
            role="alert"
            initial={{ opacity: 0, y: -16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 420, damping: 32, mass: 0.8 }}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
            className={clsx(
                'group pointer-events-auto relative w-full max-w-md overflow-hidden rounded-xl border shadow-2xl shadow-zinc-950/10 ring-1 ring-zinc-950/5 backdrop-blur-xl dark:shadow-black/40 dark:ring-white/10',
                config.surface,
            )}
        >
            <div className="flex items-start gap-3 p-4 pr-3">
                <div
                    className={clsx(
                        'flex size-10 shrink-0 items-center justify-center rounded-lg',
                        config.iconWrap,
                    )}
                >
                    <Icon className={clsx('size-5', config.iconColor)} aria-hidden />
                </div>

                <div className="min-w-0 flex-1 pt-0.5">
                    <p className="text-[11px] font-semibold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
                        {config.label}
                    </p>
                    <p className={clsx('mt-0.5 text-sm leading-5 font-semibold', config.title)}>{toast.title}</p>
                    {toast.message && (
                        <p className={clsx('mt-1 text-sm leading-5', config.message)}>{toast.message}</p>
                    )}
                </div>

                <button
                    type="button"
                    onClick={() => onDismiss(toast.id)}
                    className="rounded-lg p-1.5 text-zinc-400 transition hover:bg-zinc-950/5 hover:text-zinc-600 dark:hover:bg-white/10 dark:hover:text-zinc-200"
                    aria-label="Dismiss notification"
                >
                    <XMarkIcon className="size-4" />
                </button>
            </div>

            <div className="h-1 bg-zinc-950/5 dark:bg-white/10">
                <div
                    className={clsx(
                        'h-full origin-left animate-toast-shrink group-hover:[animation-play-state:paused]',
                        config.progress,
                    )}
                />
            </div>
        </motion.div>
    );
}
