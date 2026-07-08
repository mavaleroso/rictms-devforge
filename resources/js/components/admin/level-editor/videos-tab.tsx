import { LevelStepShell, StepChecklist, StepSidebarCard } from '@/components/admin/level-editor/level-step-shell';
import { Badge } from '@/components/catalyst/badge';
import { Button } from '@/components/catalyst/button';
import { Description, Label } from '@/components/catalyst/fieldset';
import { Subheading } from '@/components/catalyst/heading';
import { Input } from '@/components/catalyst/input';
import { Listbox, ListboxOption } from '@/components/catalyst/listbox';
import { useConfirmDialog } from '@/components/confirm-dialog';
import { FormField } from '@/components/form/form-field';
import { useValidatedForm } from '@/hooks/use-validated-form';
import { formHasFileUpload } from '@/lib/inertia-upload';
import { type Level, type Video, type VideoProvider } from '@/types/learning';
import { ArrowUpTrayIcon, FilmIcon, PlusIcon, TrashIcon } from '@heroicons/react/20/solid';
import { router } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

const VIDEO_PROVIDERS = [
    { value: 'youtube', label: 'YouTube link' },
    { value: 'upload', label: 'Upload file' },
] as const;

const ACCEPTED_VIDEO_TYPES = 'video/mp4,video/webm,video/quicktime,video/x-msvideo';

interface VideosTabProps {
    pathId: number;
    level: Level;
    onPrev?: () => void;
    onNext?: () => void;
}

interface VideoFormData {
    title: string;
    provider: VideoProvider;
    url: string;
    file: File | null;
    sort_order: number;
}

function VideoCard({ video, onDelete }: { video: Video; onDelete: () => void }) {
    const isUpload = video.provider === 'upload';

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
                {video.url && <p className="mt-1 truncate text-sm text-zinc-500">{video.url}</p>}
                {isUpload && video.file_path && (
                    <p className="mt-1 truncate text-sm text-zinc-500">Hosted video file ready for playback</p>
                )}
            </div>
            <Button type="button" plain onClick={onDelete} aria-label="Delete video">
                <TrashIcon className="size-4" />
            </Button>
        </article>
    );
}

export function VideosTab({ pathId, level, onPrev, onNext }: VideosTabProps) {
    const { confirm, ConfirmDialog } = useConfirmDialog();
    const videos = level.videos ?? [];
    const [showForm, setShowForm] = useState(videos.length === 0);
    const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

    const form = useValidatedForm<VideoFormData>({
        title: '',
        provider: 'youtube',
        url: '',
        file: null,
        sort_order: videos.length + 1,
    });

    const isUpload = form.data.provider === 'upload';

    const addVideo: FormEventHandler = async (e) => {
        e.preventDefault();

        const confirmed = await confirm({
            title: 'Add video?',
            description: `"${form.data.title || 'This video'}" will be added to the level player.`,
            confirmLabel: 'Add video',
        });

        if (!confirmed) {
            return;
        }

        form.post(route('admin.videos.store', [pathId, level.id]), {
            forceFormData: formHasFileUpload(form.data as Record<string, unknown>),
            onSuccess: () => {
                form.reset('title', 'url', 'file');
                form.setData('provider', 'youtube');
                setSelectedFileName(null);
                setShowForm(false);
            },
            successToast: { title: 'Video added', message: `"${form.data.title}" was added to this level.` },
        });
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
                    <Button type="button" outline onClick={() => setShowForm((value) => !value)}>
                        <PlusIcon data-slot="icon" />
                        {showForm ? 'Hide form' : 'Add video'}
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
                                <VideoCard video={video} onDelete={() => deleteVideo(video)} />
                            </li>
                        ))}
                    </ul>
                )}

                {showForm && (
                    <form
                        onSubmit={addVideo}
                        className="space-y-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-5 dark:border-white/10 dark:bg-zinc-800/40"
                    >
                        <Subheading level={3}>New video</Subheading>
                        <FormField error={form.errors.title}>
                            <Label>Title</Label>
                            <Input
                                value={form.data.title}
                                onChange={(e) => form.setData('title', e.target.value)}
                                placeholder="e.g. Eloquent relationships walkthrough"
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
                                {selectedFileName && (
                                    <p className="mt-2 text-xs text-zinc-500">Selected: {selectedFileName}</p>
                                )}
                            </FormField>
                        )}

                        <div className="flex gap-3">
                            <Button type="submit" disabled={form.processing}>
                                Add video
                            </Button>
                            {videos.length > 0 && (
                                <Button type="button" plain onClick={() => setShowForm(false)}>
                                    Cancel
                                </Button>
                            )}
                        </div>
                    </form>
                )}
            </div>
        </LevelStepShell>
    );
}
