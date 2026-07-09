import { Button } from '@/components/catalyst/button';
import { useConfirmDialog } from '@/components/confirm-dialog';
import { useToast } from '@/components/toast/toast-provider';
import { type LearningMaterial, type LearningMaterialFile } from '@/types/learning';
import { router } from '@inertiajs/react';
import {
    ArrowDownTrayIcon,
    BookOpenIcon,
    CheckCircleIcon,
    DocumentTextIcon,
    PaperClipIcon,
    PhotoIcon,
    PresentationChartBarIcon,
} from '@heroicons/react/20/solid';
import clsx from 'clsx';
import type { ComponentType, SVGProps } from 'react';

interface MaterialViewerProps {
    material: LearningMaterial;
    canComplete?: boolean;
    compact?: boolean;
}

type ResourceKind = 'pdf' | 'image' | 'presentation' | 'document' | 'file';

interface ResourceMeta {
    kind: ResourceKind;
    label: string;
    icon: ComponentType<SVGProps<SVGSVGElement>>;
    accent: string;
    iconBg: string;
}

function fileExtension(name: string): string {
    const base = name.split('?')[0];

    return (base.split('.').pop() ?? '').toLowerCase();
}

function resolveResourceMeta(file: LearningMaterialFile): ResourceMeta {
    const extension = fileExtension(file.original_name || file.url);

    if (extension === 'pdf') {
        return {
            kind: 'pdf',
            label: 'PDF document',
            icon: DocumentTextIcon,
            accent: 'text-red-600 dark:text-red-400',
            iconBg: 'bg-red-500/10',
        };
    }

    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) {
        return {
            kind: 'image',
            label: 'Image file',
            icon: PhotoIcon,
            accent: 'text-violet-600 dark:text-violet-400',
            iconBg: 'bg-violet-500/10',
        };
    }

    if (['ppt', 'pptx'].includes(extension)) {
        return {
            kind: 'presentation',
            label: 'Presentation',
            icon: PresentationChartBarIcon,
            accent: 'text-amber-600 dark:text-amber-400',
            iconBg: 'bg-amber-500/10',
        };
    }

    if (['doc', 'docx'].includes(extension)) {
        return {
            kind: 'document',
            label: 'Word document',
            icon: DocumentTextIcon,
            accent: 'text-blue-600 dark:text-blue-400',
            iconBg: 'bg-blue-500/10',
        };
    }

    return {
        kind: 'file',
        label: extension ? extension.toUpperCase() : 'Resource file',
        icon: PaperClipIcon,
        accent: 'text-zinc-600 dark:text-zinc-300',
        iconBg: 'bg-zinc-500/10',
    };
}

function MaterialResourceDownloads({ files }: { files: LearningMaterialFile[] }) {
    return (
        <section className="rounded-xl border border-zinc-950/8 bg-zinc-50/70 p-4 dark:border-white/8 dark:bg-zinc-900/50 sm:p-5">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h4 className="text-sm font-semibold text-zinc-950 dark:text-white">Lesson resources</h4>
                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                        Download supporting files to review offline. These open as downloads, not in-page previews.
                    </p>
                </div>
                <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-xs font-medium text-zinc-600 ring-1 ring-zinc-950/8 dark:bg-zinc-950 dark:text-zinc-300 dark:ring-white/10">
                    {files.length} {files.length === 1 ? 'file' : 'files'}
                </span>
            </div>

            <ul className="mt-4 space-y-2">
                {files.map((file) => {
                    const meta = resolveResourceMeta(file);
                    const Icon = meta.icon;

                    return (
                        <li key={file.id}>
                            <a
                                href={route('learn.material-files.download', file.id)}
                                className="group flex items-center gap-3 rounded-lg border border-zinc-950/8 bg-white p-3 transition hover:border-brand-500/30 hover:shadow-sm dark:border-white/8 dark:bg-zinc-950 dark:hover:border-brand-400/30"
                            >
                                <span
                                    className={clsx(
                                        'flex size-10 shrink-0 items-center justify-center rounded-lg',
                                        meta.iconBg,
                                        meta.accent,
                                    )}
                                >
                                    <Icon className="size-5" aria-hidden />
                                </span>
                                <span className="min-w-0 flex-1">
                                    <span className="block truncate text-sm font-medium text-zinc-950 dark:text-white">
                                        {file.original_name}
                                    </span>
                                    <span className="mt-0.5 block text-xs text-zinc-500 dark:text-zinc-400">{meta.label}</span>
                                </span>
                                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-zinc-100 px-2.5 py-1.5 text-xs font-medium text-zinc-700 transition group-hover:bg-brand-500/10 group-hover:text-brand-700 dark:bg-zinc-900 dark:text-zinc-200 dark:group-hover:text-brand-300">
                                    <ArrowDownTrayIcon className="size-3.5" aria-hidden />
                                    Download
                                </span>
                            </a>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}

export function MaterialViewer({ material, canComplete = true, compact = false }: MaterialViewerProps) {
    const { confirm, ConfirmDialog } = useConfirmDialog();
    const { showSuccess } = useToast();
    const hasContent = Boolean(material.content?.replace(/<[^>]+>/g, '').trim());
    const files = material.files ?? [];

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
                    'overflow-hidden rounded-2xl border border-zinc-950/10 bg-white shadow-sm dark:border-white/10 dark:bg-zinc-900',
                    material.completed && 'border-emerald-500/25 ring-1 ring-emerald-500/10',
                )}
            >
                <div className="border-b border-zinc-950/5 bg-gradient-to-r from-brand-500/[0.06] via-transparent to-transparent px-4 py-4 dark:border-white/5 sm:px-6">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-start gap-3">
                            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600 ring-1 ring-brand-500/15 dark:text-brand-400">
                                <BookOpenIcon className="size-5" />
                            </span>
                            <div className="min-w-0">
                                <h3 className="text-base font-semibold tracking-tight text-zinc-950 dark:text-white">{material.title}</h3>
                                <p className="mt-1 text-xs capitalize text-zinc-500 dark:text-zinc-400">
                                    {material.type.replace('_', ' ')} lesson
                                    {files.length > 0 ? ` · ${files.length} downloadable ${files.length === 1 ? 'resource' : 'resources'}` : ''}
                                </p>
                            </div>
                        </div>
                        {material.completed && (
                            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                                <CheckCircleIcon className="size-4" />
                                Completed
                            </span>
                        )}
                    </div>
                </div>

                <div className={clsx('space-y-6 px-4 py-5 sm:px-6 sm:py-6', compact && 'max-h-96 overflow-y-auto')}>
                    {hasContent ? (
                        <div className="rounded-xl border border-zinc-950/5 bg-zinc-50/50 p-4 dark:border-white/5 dark:bg-zinc-950/40 sm:p-5">
                            <div
                                className="prose prose-sm prose-zinc max-w-none dark:prose-invert prose-headings:scroll-mt-20 prose-a:text-brand-600 dark:prose-a:text-brand-400"
                                dangerouslySetInnerHTML={{ __html: material.content ?? '' }}
                            />
                        </div>
                    ) : files.length === 0 ? (
                        <p className="text-sm text-zinc-500">No lesson content is available yet.</p>
                    ) : null}

                    {files.length > 0 && <MaterialResourceDownloads files={files} />}
                </div>

                {canComplete && !material.completed && (
                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-950/5 bg-zinc-50/60 px-4 py-4 dark:border-white/5 dark:bg-zinc-900/60 sm:px-6">
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                            Finish reading, then mark this lesson complete to continue your level progress.
                        </p>
                        <Button color="dark/zinc" onClick={markComplete}>
                            Mark as complete
                        </Button>
                    </div>
                )}
            </article>
        </>
    );
}
