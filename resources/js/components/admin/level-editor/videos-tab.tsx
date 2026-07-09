import { LevelStepShell, StepChecklist, StepSidebarCard } from '@/components/admin/level-editor/level-step-shell';
import { Badge } from '@/components/catalyst/badge';
import { Button } from '@/components/catalyst/button';
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '@/components/catalyst/dialog';
import { Description, Label } from '@/components/catalyst/fieldset';
import { Subheading } from '@/components/catalyst/heading';
import { Input } from '@/components/catalyst/input';
import { Listbox, ListboxOption } from '@/components/catalyst/listbox';
import { useConfirmDialog, type ConfirmOptions } from '@/components/confirm-dialog';
import { FormField } from '@/components/form/form-field';
import { RichTextEditor } from '@/components/form/rich-text-editor';
import { useValidatedForm } from '@/hooks/use-validated-form';
import { formHasFileUpload, submitMultipartPatch } from '@/lib/inertia-upload';
import { type Level, type Video, type VideoProvider } from '@/types/learning';
import { ArrowUpTrayIcon, FilmIcon, PencilSquareIcon, PlusIcon, TrashIcon } from '@heroicons/react/20/solid';
import { router } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

const VIDEO_PROVIDERS = [
    { value: 'youtube', label: 'YouTube link' },
    { value: 'upload', label: 'Upload file' },
] as const;

const ACCEPTED_VIDEO_TYPES = 'video/mp4,video/webm,video/quicktime,video/x-msvideo';

interface VideoFormData {
    title: string;
    caption: string;
    provider: VideoProvider;
    url: string;
    file: File | null;
    sort_order: number;
}

function emptyForm(sortOrder: number): VideoFormData {
    return {
        title: '',
        caption: '',
        provider: 'youtube',
        url: '',
        file: null,
        sort_order: sortOrder,
    };
}

function formFromVideo(video: Video): VideoFormData {
    return {
        title: video.title,
        caption: video.caption ?? '',
        provider: video.provider,
        url: video.url ?? '',
        file: null,
        sort_order: video.sort_order,
    };
}

function captionPreview(caption: string | null): string | null {
    if (!caption) {
        return null;
    }

    const text = caption
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    return text || null;
}

function uploadedFileName(path: string | null): string | null {
    if (!path) {
        return null;
    }

    try {
        const url = new URL(path, window.location.origin);

        return decodeURIComponent(url.pathname.split('/').pop() ?? '') || null;
    } catch {
        return path.split('/').pop() ?? null;
    }
}

interface VideosTabProps {
    pathId: number;
    level: Level;
    onPrev?: () => void;
    onNext?: () => void;
}

function VideoCard({
    video,
    onEdit,
    onDelete,
}: {
    video: Video;
    onEdit: () => void;
    onDelete: () => void;
}) {
    const isUpload = video.provider === 'upload';
    const preview = captionPreview(video.caption);

    return (
        <article className="flex gap-4 rounded-lg border border-zinc-950/10 p-4 dark:border-white/10">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                {isUpload ? <ArrowUpTrayIcon className="size-5 text-zinc-500" /> : <FilmIcon className="size-5 text-zinc-500" />}
            </div>
            <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-zinc-950 dark:text-white">{video.title}</p>
                    <Badge color="zinc">{isUpload ? 'Uploaded' : video.provider}</Badge>
                </div>
                {preview && <p className="mt-2 line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400">{preview}</p>}
                {video.url && <p className="mt-1 truncate text-sm text-zinc-500">{video.url}</p>}
                {isUpload && video.file_path && (
                    <p className="mt-1 truncate text-sm text-zinc-500">
                        Hosted file: {uploadedFileName(video.file_path) ?? 'Ready for playback'}
                    </p>
                )}
            </div>
            <div className="flex shrink-0 gap-1">
                <Button type="button" plain onClick={onEdit} aria-label="Edit video">
                    <PencilSquareIcon className="size-4" />
                </Button>
                <Button type="button" plain onClick={onDelete} aria-label="Delete video">
                    <TrashIcon className="size-4" />
                </Button>
            </div>
        </article>
    );
}

export function VideosTab({ pathId, level, onPrev, onNext }: VideosTabProps) {
    const { confirm, ConfirmDialog } = useConfirmDialog();
    const videos = level.videos ?? [];
    const nextSortOrder = videos.length + 1;
    const [dialogOpen, setDialogOpen] = useState(videos.length === 0);
    const [editing, setEditing] = useState<Video | null>(null);

    const openCreate = () => {
        setEditing(null);
        setDialogOpen(true);
    };

    const openEdit = (video: Video) => {
        setEditing(video);
        setDialogOpen(true);
    };

    const closeDialog = () => {
        setDialogOpen(false);
        setEditing(null);
    };

    const deleteVideo = async (video: Video) => {
        const confirmed = await confirm({
            title: 'Delete video?',
            description: `"${video.title}" will be permanently removed from this level.`,
            confirmLabel: 'Delete',
            variant: 'danger',
        });

        if (confirmed) {
            router.delete(route('admin.videos.destroy', video.id));
        }
    };

    return (
        <LevelStepShell
            step="videos"
            onPrev={onPrev}
            onNext={onNext}
            nextLabel="Continue to quiz"
            sidebar={
                <>
                    <StepSidebarCard title="This step is optional">
                        <p>Levels can be completed with materials and a quiz only. Add videos when a walkthrough helps understanding.</p>
                    </StepSidebarCard>
                    <StepSidebarCard title="YouTube URLs">
                        <p>Paste a standard watch link or embed URL:</p>
                        <ul className="mt-2 list-disc space-y-1 pl-4 text-xs">
                            <li>youtube.com/watch?v=…</li>
                            <li>youtu.be/…</li>
                            <li>youtube.com/embed/…</li>
                        </ul>
                    </StepSidebarCard>
                    <StepSidebarCard title="Uploaded videos">
                        <p>Optionally upload MP4, WebM, MOV, or AVI files up to 100 MB. Files are stored on the server and streamed in the level player.</p>
                    </StepSidebarCard>
                    <StepSidebarCard title="Checklist">
                        <StepChecklist
                            items={[
                                { label: 'Video has a descriptive title', done: videos.some((v) => v.title.length > 3) },
                                { label: 'At least one video added (optional)', done: videos.length > 0 },
                            ]}
                        />
                    </StepSidebarCard>
                </>
            }
        >
            <ConfirmDialog />
            <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <Subheading level={3}>
                        {videos.length} {videos.length === 1 ? 'video' : 'videos'}
                    </Subheading>
                    <Button type="button" onClick={openCreate}>
                        <PlusIcon data-slot="icon" />
                        Add video
                    </Button>
                </div>

                {videos.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-zinc-300 p-8 text-center dark:border-zinc-600">
                        <FilmIcon className="mx-auto size-8 text-zinc-400" />
                        <p className="mt-3 text-sm text-zinc-500">
                            No videos yet. Add a YouTube walkthrough or upload a lesson recording.
                        </p>
                    </div>
                ) : (
                    <ul className="space-y-3">
                        {videos.map((video) => (
                            <li key={video.id}>
                                <VideoCard video={video} onEdit={() => openEdit(video)} onDelete={() => deleteVideo(video)} />
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <VideoDialog
                key={editing?.id ?? 'new'}
                open={dialogOpen}
                onClose={closeDialog}
                pathId={pathId}
                levelId={level.id}
                video={editing}
                initialData={editing ? formFromVideo(editing) : emptyForm(nextSortOrder)}
                confirm={confirm}
            />
        </LevelStepShell>
    );
}

interface VideoDialogProps {
    open: boolean;
    onClose: () => void;
    pathId: number;
    levelId: number;
    video: Video | null;
    initialData: VideoFormData;
    confirm: (options: ConfirmOptions) => Promise<boolean>;
}

function VideoDialog({ open, onClose, pathId, levelId, video, initialData, confirm }: VideoDialogProps) {
    const form = useValidatedForm<VideoFormData>(initialData);
    const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
    const isUpload = form.data.provider === 'upload';
    const hasFileUpload = formHasFileUpload(form.data as Record<string, unknown>);
    const existingUpload = video?.provider === 'upload' && video.file_path ? uploadedFileName(video.file_path) : null;

    const submit: FormEventHandler = async (e) => {
        e.preventDefault();

        const confirmed = await confirm(
            video
                ? {
                      title: 'Save video changes?',
                      description: `"${form.data.title || video.title}" will be updated for this level.`,
                      confirmLabel: 'Save video',
                  }
                : {
                      title: 'Add video?',
                      description: `"${form.data.title || 'This video'}" will be added to the level player.`,
                      confirmLabel: 'Add video',
                  },
        );

        if (!confirmed) {
            return;
        }

        const options = {
            onSuccess: onClose,
            successToast: video
                ? { title: 'Video saved', message: `"${form.data.title}" was updated.` }
                : { title: 'Video added', message: `"${form.data.title}" was added to this level.` },
        };

        if (video) {
            if (hasFileUpload) {
                submitMultipartPatch(form, route('admin.videos.update', video.id), options);
            } else {
                form.patch(route('admin.videos.update', video.id), options);
            }

            return;
        }

        form.post(route('admin.videos.store', [pathId, levelId]), {
            ...options,
            forceFormData: hasFileUpload,
        });
    };

    return (
        <Dialog open={open} onClose={onClose} size="2xl">
            <DialogTitle>{video ? 'Edit video' : 'Add video'}</DialogTitle>
            <DialogDescription>
                {isUpload
                    ? 'Upload a lesson recording or replace the current hosted file.'
                    : 'Paste a YouTube link to embed the walkthrough in the level player.'}
            </DialogDescription>
            <DialogBody>
                <form id="video-form" onSubmit={submit} className="space-y-4">
                    <FormField error={form.errors.title}>
                        <Label>Title</Label>
                        <Input
                            value={form.data.title}
                            onChange={(e) => form.setData('title', e.target.value)}
                            placeholder="e.g. Eloquent relationships walkthrough"
                        />
                    </FormField>
                    <FormField error={form.errors.caption}>
                        <Label>Caption</Label>
                        <Description>Optional notes, timestamps, or key takeaways shown below the video.</Description>
                        <RichTextEditor
                            value={form.data.caption}
                            onChange={(html) => form.setData('caption', html)}
                            invalid={!!form.errors.caption}
                            placeholder="Add context, chapter markers, or follow-up links…"
                        />
                    </FormField>
                    <FormField error={form.errors.provider}>
                        <Label>Source</Label>
                        <Listbox
                            value={form.data.provider}
                            onChange={(value) => {
                                form.setData((current) => ({
                                    ...current,
                                    provider: value,
                                    url: value === 'upload' ? '' : current.url,
                                    file: value === 'youtube' ? null : current.file,
                                }));
                                if (value === 'youtube') {
                                    setSelectedFileName(null);
                                }
                            }}
                        >
                            {VIDEO_PROVIDERS.map((option) => (
                                <ListboxOption key={option.value} value={option.value}>
                                    {option.label}
                                </ListboxOption>
                            ))}
                        </Listbox>
                    </FormField>

                    {!isUpload ? (
                        <FormField error={form.errors.url}>
                            <Label>Video URL</Label>
                            <Description>YouTube links are embedded in the level player.</Description>
                            <Input
                                value={form.data.url}
                                onChange={(e) => form.setData('url', e.target.value)}
                                placeholder="https://www.youtube.com/watch?v=…"
                            />
                        </FormField>
                    ) : (
                        <FormField error={form.errors.file}>
                            <Label>Video file</Label>
                            <Description>MP4, WebM, MOV, or AVI · max 100 MB</Description>
                            <Input
                                type="file"
                                accept={ACCEPTED_VIDEO_TYPES}
                                onChange={(e) => {
                                    const file = e.target.files?.[0] ?? null;
                                    form.setData('file', file);
                                    setSelectedFileName(file?.name ?? null);
                                }}
                            />
                            {selectedFileName && <p className="mt-2 text-xs text-zinc-500">Selected: {selectedFileName}</p>}
                            {!selectedFileName && existingUpload && (
                                <p className="mt-2 flex items-center gap-1.5 text-xs text-zinc-500">
                                    <ArrowUpTrayIcon className="size-3.5 shrink-0" />
                                    Current file: {existingUpload}
                                </p>
                            )}
                        </FormField>
                    )}
                </form>
            </DialogBody>
            <DialogActions>
                <Button plain onClick={onClose}>
                    Cancel
                </Button>
                <Button type="submit" form="video-form" disabled={form.processing}>
                    {video ? 'Save video' : 'Add video'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
