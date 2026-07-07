import { Button } from '@/components/catalyst/button';
import { Subheading } from '@/components/catalyst/heading';
import { Text } from '@/components/catalyst/text';
import { TAB_META } from '@/components/admin/level-editor/constants';
import type { LevelEditorTab } from '@/types/learning';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/20/solid';
import type { ReactNode } from 'react';

interface LevelStepShellProps {
    step: LevelEditorTab;
    children: ReactNode;
    sidebar: ReactNode;
    onPrev?: () => void;
    onNext?: () => void;
    nextLabel?: string;
}

export function LevelStepShell({ step, children, sidebar, onPrev, onNext, nextLabel = 'Next step' }: LevelStepShellProps) {
    const meta = TAB_META[step];

    return (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
            <section className="min-w-0 rounded-xl border border-zinc-950/10 bg-white dark:border-white/10 dark:bg-zinc-900">
                <header className="border-b border-zinc-950/5 px-6 py-5 dark:border-white/5">
                    <Subheading>{meta.label}</Subheading>
                    <Text className="mt-1">{meta.description}</Text>
                </header>
                <div className="p-6">{children}</div>
            </section>

            <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
                {sidebar}

                {(onPrev || onNext) && (
                    <div className="flex flex-col gap-2 rounded-xl border border-zinc-950/10 bg-zinc-50 p-4 dark:border-white/10 dark:bg-zinc-800/40">
                        <p className="text-xs font-semibold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">Navigation</p>
                        {onPrev && (
                            <Button type="button" plain onClick={onPrev}>
                                <ArrowLeftIcon data-slot="icon" />
                                Previous step
                            </Button>
                        )}
                        {onNext && (
                            <Button type="button" outline onClick={onNext}>
                                {nextLabel}
                                <ArrowRightIcon data-slot="icon" />
                            </Button>
                        )}
                    </div>
                )}
            </aside>
        </div>
    );
}

interface StepSidebarCardProps {
    title: string;
    children: ReactNode;
    variant?: 'default' | 'tip';
}

export function StepSidebarCard({ title, children, variant = 'default' }: StepSidebarCardProps) {
    return (
        <div
            className={
                variant === 'tip'
                    ? 'rounded-xl border border-amber-200/80 bg-amber-50/80 p-4 text-sm text-amber-950 dark:border-amber-500/20 dark:bg-amber-950/30 dark:text-amber-100'
                    : 'rounded-xl border border-zinc-950/10 bg-white p-4 dark:border-white/10 dark:bg-zinc-900'
            }
        >
            <p className="text-xs font-semibold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">{title}</p>
            <div className="mt-2 space-y-2 text-sm text-zinc-600 dark:text-zinc-300">{children}</div>
        </div>
    );
}

interface StepChecklistProps {
    items: { label: string; done: boolean }[];
}

export function StepChecklist({ items }: StepChecklistProps) {
    return (
        <ul className="space-y-2">
            {items.map((item) => (
                <li key={item.label} className="flex items-start gap-2">
                    <span
                        className={
                            item.done
                                ? 'mt-0.5 size-4 shrink-0 rounded-full bg-emerald-500 text-center text-[10px] leading-4 text-white'
                                : 'mt-0.5 size-4 shrink-0 rounded-full border border-zinc-300 dark:border-zinc-600'
                        }
                        aria-hidden
                    >
                        {item.done ? '✓' : ''}
                    </span>
                    <span className={item.done ? 'text-zinc-950 dark:text-white' : ''}>{item.label}</span>
                </li>
            ))}
        </ul>
    );
}
