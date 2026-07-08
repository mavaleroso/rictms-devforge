import { Button } from '@/components/catalyst/button';
import { useConfirmDialog } from '@/components/confirm-dialog';
import { useToast } from '@/components/toast/toast-provider';
import { type LearningMaterial } from '@/types/learning';
import { router } from '@inertiajs/react';
import { BookOpenIcon, CheckCircleIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';

interface MaterialViewerProps {
    material: LearningMaterial;
    canComplete?: boolean;
    compact?: boolean;
}

export function MaterialViewer({ material, canComplete = true, compact = false }: MaterialViewerProps) {
    const { confirm, ConfirmDialog } = useConfirmDialog();
    const { showSuccess } = useToast();

    const markComplete = async () => {
        const confirmed = await confirm({
            title: 'Mark lesson as complete?',
            description: `We'll save your progress for "${material.title}" and unlock the next step when all requirements are met.`,
            confirmLabel: 'Yes, mark complete',
            tone: 'success',
        });

        if (!confirmed) {
            return;
        }

        router.post(route('learn.materials.complete', material.id), {}, {
            preserveScroll: true,
            onSuccess: () => {
                showSuccess('Lesson completed', `"${material.title}" was marked as complete.`);
            },
        });
    };

    return (
        <>
            <ConfirmDialog />
            <article
            className={clsx(
                'overflow-hidden rounded-xl border border-zinc-950/10 bg-white dark:border-white/10 dark:bg-zinc-900',
                material.completed && 'border-emerald-500/20',
            )}
        >
            <div className="flex items-center justify-between gap-3 border-b border-zinc-950/5 px-4 py-3 dark:border-white/5 sm:px-5">
                <div className="flex min-w-0 items-center gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400">
                        <BookOpenIcon className="size-5" />
                    </span>
                    <div className="min-w-0">
                        <h3 className="font-medium text-zinc-950 dark:text-white">{material.title}</h3>
                        <p className="text-xs text-zinc-500 capitalize dark:text-zinc-400">{material.type.replace('_', ' ')}</p>
                    </div>
                </div>
                {material.completed && (
                    <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                        <CheckCircleIcon className="size-4" />
                        Done
                    </span>
                )}
            </div>

            <div className={clsx('px-4 py-4 sm:px-5', compact && 'max-h-96 overflow-y-auto')}>
                {material.type === 'markdown' || material.type === 'standard' || material.type === 'snippet' ? (
                    <div className="prose prose-sm prose-zinc max-w-none whitespace-pre-wrap dark:prose-invert">
                        {material.content}
                    </div>
                ) : material.file_path ? (
                    <iframe src={material.file_path} className="h-96 w-full rounded-lg border border-zinc-200 dark:border-zinc-700" title={material.title} />
                ) : (
                    <p className="text-sm text-zinc-500">No content available.</p>
                )}
            </div>

            {canComplete && !material.completed && (
                <div className="border-t border-zinc-950/5 px-4 py-3 dark:border-white/5 sm:px-5">
                    <Button outline onClick={markComplete}>
                        Mark as complete
                    </Button>
                </div>
            )}
        </article>
        </>
    );
}
