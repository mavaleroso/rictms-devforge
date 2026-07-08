import { completedStepCount, LEVEL_EDITOR_TABS, TAB_META, tabProgress } from '@/components/admin/level-editor/constants';
import { Badge } from '@/components/catalyst/badge';
import { Button } from '@/components/catalyst/button';
import { Subheading } from '@/components/catalyst/heading';
import { Text } from '@/components/catalyst/text';
import type { LevelEditorTab } from '@/types/learning';
import { type Level } from '@/types/learning';
import { ArrowLeftIcon, ArrowRightIcon, CheckCircleIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';

interface LevelWorkflowGuideProps {
    activeTab: LevelEditorTab;
    onTabChange: (tab: LevelEditorTab) => void;
    level: Level;
    onPrev?: () => void;
    onNext?: () => void;
}

export function LevelWorkflowGuide({ activeTab, onTabChange, level, onPrev, onNext }: LevelWorkflowGuideProps) {
    const progress = tabProgress(level);
    const completed = completedStepCount(level);
    const activeIndex = LEVEL_EDITOR_TABS.indexOf(activeTab);

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <Subheading>Level content workflow</Subheading>
                    <Text className="mt-1">
                        Work through each step in order. {completed} of {LEVEL_EDITOR_TABS.length} steps have content.
                    </Text>
                </div>
                <div className="flex gap-2">
                    {onPrev && (
                        <Button type="button" plain onClick={onPrev} disabled={activeIndex === 0}>
                            <ArrowLeftIcon data-slot="icon" />
                            Previous
                        </Button>
                    )}
                    {onNext && (
                        <Button type="button" outline onClick={onNext} disabled={activeIndex === LEVEL_EDITOR_TABS.length - 1}>
                            Next step
                            <ArrowRightIcon data-slot="icon" />
                        </Button>
                    )}
                </div>
            </div>

            <nav aria-label="Level editor steps">
                <ol className="grid gap-3 sm:grid-cols-5 sm:gap-0">
                    {LEVEL_EDITOR_TABS.map((tab, index) => {
                        const meta = TAB_META[tab];
                        const done = progress[tab];
                        const active = activeTab === tab;
                        const isLast = index === LEVEL_EDITOR_TABS.length - 1;

                        return (
                            <li key={tab} className="relative flex justify-center">
                                {!isLast && (
                                    <span
                                        className={clsx(
                                            'absolute top-10 left-[calc(50%+1.25rem)] z-0 hidden h-0.5 w-[calc(100%-2.5rem)] sm:block',
                                            done ? 'bg-emerald-400 dark:bg-emerald-600' : 'bg-zinc-200 dark:bg-zinc-700',
                                        )}
                                        aria-hidden
                                    />
                                )}

                                <button
                                    type="button"
                                    onClick={() => onTabChange(tab)}
                                    aria-current={active ? 'step' : undefined}
                                    className={clsx(
                                        'relative z-10 flex w-full max-w-[12rem] flex-col items-center gap-2.5 rounded-xl px-5 py-5 text-center transition',
                                        active
                                            ? 'bg-white px-6 shadow-sm ring-1 ring-zinc-950/10 dark:bg-zinc-900 dark:ring-white/10'
                                            : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/50',
                                    )}
                                >
                                    <span
                                        className={clsx(
                                            'flex size-10 items-center justify-center rounded-full text-sm font-semibold',
                                            done
                                                ? 'bg-emerald-500 text-white'
                                                : active
                                                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                                                  : 'bg-zinc-200 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300',
                                        )}
                                    >
                                        {done ? <CheckCircleIcon className="size-5" /> : index + 1}
                                    </span>
                                    <span className="text-sm font-medium text-zinc-950 dark:text-white">
                                        {meta.shortLabel}
                                        {meta.optional && <span className="ml-1 text-xs font-normal text-zinc-400">(optional)</span>}
                                    </span>
                                    {active && (
                                        <Badge color="blue" className="text-[10px]">
                                            Current
                                        </Badge>
                                    )}
                                </button>
                            </li>
                        );
                    })}
                </ol>
            </nav>
        </div>
    );
}

export type { LevelEditorTab };
