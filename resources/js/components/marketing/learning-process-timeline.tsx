import { LEARNING_PROCESS_STEPS } from '@/lib/learning-process';
import { accent, surfaces } from '@/lib/theme';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';

const STEP_DURATION_MS = 4500;

export function LearningProcessTimeline() {
    const [activeIndex, setActiveIndex] = useState(0);
    const activeStep = LEARNING_PROCESS_STEPS[activeIndex];

    useEffect(() => {
        const timer = window.setInterval(() => {
            setActiveIndex((current) => (current + 1) % LEARNING_PROCESS_STEPS.length);
        }, STEP_DURATION_MS);

        return () => window.clearInterval(timer);
    }, []);

    return (
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center">
            <div className="relative">
                <div className="absolute top-5 bottom-5 left-[1.125rem] hidden w-px bg-slate-200 dark:bg-slate-800 lg:block" />
                <ol className="space-y-3">
                    {LEARNING_PROCESS_STEPS.map((step, index) => {
                        const Icon = step.icon;
                        const isActive = index === activeIndex;

                        return (
                            <li key={step.id}>
                                <button
                                    type="button"
                                    onClick={() => setActiveIndex(index)}
                                    className={clsx(
                                        'flex w-full items-start gap-3 rounded-xl border p-4 text-left transition',
                                        isActive
                                            ? clsx(accent.bgActive, 'border-brand-200/80 dark:border-brand-800/60')
                                            : clsx(surfaces.cardMuted, 'hover:border-slate-300 dark:hover:border-slate-700'),
                                    )}
                                >
                                    <span
                                        className={clsx(
                                            'relative z-10 flex size-9 shrink-0 items-center justify-center rounded-lg text-sm font-semibold',
                                            isActive
                                                ? 'bg-brand-600 text-white'
                                                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
                                        )}
                                    >
                                        {isActive ? <Icon className="size-5" /> : step.step}
                                    </span>
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{step.title}</p>
                                        <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                                            {step.summary}
                                        </p>
                                    </div>
                                </button>
                            </li>
                        );
                    })}
                </ol>
            </div>

            <div className={clsx('relative overflow-hidden p-6 sm:p-8', surfaces.card)}>
                <div className="pointer-events-none absolute -top-10 -right-10 size-40 rounded-full bg-brand-500/10 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-10 -left-10 size-40 rounded-full bg-accent-500/10 blur-3xl" />

                <p className="text-[10px] font-medium tracking-wide text-slate-500 uppercase dark:text-slate-400">
                    Step {activeStep.step} of {LEARNING_PROCESS_STEPS.length}
                </p>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeStep.id}
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -16 }}
                        transition={{ duration: 0.35, ease: 'easeOut' }}
                        className="mt-4"
                    >
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{activeStep.title}</h3>
                        <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                            {activeStep.detail}
                        </p>
                    </motion.div>
                </AnimatePresence>

                <div className="mt-6 flex gap-1.5">
                    {LEARNING_PROCESS_STEPS.map((step, index) => (
                        <motion.span
                            key={step.id}
                            className={clsx(
                                'h-1 flex-1 overflow-hidden rounded-full',
                                index === activeIndex ? 'bg-brand-100 dark:bg-brand-900/50' : 'bg-slate-100 dark:bg-slate-800',
                            )}
                        >
                            {index === activeIndex && (
                                <motion.span
                                    className="block h-full origin-left bg-brand-600 dark:bg-brand-400"
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    transition={{ duration: STEP_DURATION_MS / 1000, ease: 'linear' }}
                                />
                            )}
                        </motion.span>
                    ))}
                </div>
            </div>
        </div>
    );
}
