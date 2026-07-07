import { FormField } from '@/components/form/form-field';
import { StepChecklist, StepSidebarCard, LevelStepShell } from '@/components/admin/level-editor/level-step-shell';
import { useConfirmDialog } from '@/components/confirm-dialog';
import { Badge } from '@/components/catalyst/badge';
import { Button } from '@/components/catalyst/button';
import { Description, Label } from '@/components/catalyst/fieldset';
import { Input } from '@/components/catalyst/input';
import { Listbox, ListboxOption } from '@/components/catalyst/listbox';
import { Subheading } from '@/components/catalyst/heading';
import { type Level, type Video } from '@/types/learning';
import { useValidatedForm } from '@/hooks/use-validated-form';
import { FilmIcon, PlusIcon, TrashIcon } from '@heroicons/react/20/solid';
import { router } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

const VIDEO_PROVIDERS = [
    { value: 'youtube', label: 'YouTube' },
    { value: 'upload', label: 'Upload' },
] as const;

interface VideosTabProps {
    pathId: number;
    level: Level;
    onPrev?: () => void;
    onNext?: () => void;
}

function VideoCard({ video, onDelete }: { video: Video; onDelete: () => void }) {
    return (
        <article className="flex gap-4 rounded-lg border border-zinc-950/10 p-4 dark:border-white/10">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                <FilmIcon className="size-5 text-zinc-500" />
            </div>
            <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-zinc-950 dark:text-white">{video.title}</p>
                    <Badge color="zinc">{video.provider}</Badge>
                </div>
                {video.url && <p className="mt-1 truncate text-sm text-zinc-500">{video.url}</p>}
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

    const form = useValidatedForm({
        title: '',
        provider: 'youtube' as const,
        url: '',
        sort_order: videos.length + 1,
    });

    const addVideo: FormEventHandler = async (e) => {
        e.preventDefault();

        const confirmed = await confirm({
            title: 'Add video?',
            description: `"${form.data.title || 'This video'}" will be embedded in the level player.`,
            confirmLabel: 'Add video',
        });

        if (!confirmed) {
            return;
        }

        form.post(route('admin.videos.store', [pathId, level.id]), {
            onSuccess: () => {
                form.reset('title', 'url');
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
                        <p className="mt-3 text-sm text-zinc-500">No videos yet. Skip this step or add a YouTube walkthrough.</p>
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
                            <Input value={form.data.title} onChange={(e) => form.setData('title', e.target.value)} placeholder="e.g. Eloquent relationships walkthrough" />
                        </FormField>
                        <FormField error={form.errors.provider}>
                            <Label>Provider</Label>
                            <Listbox value={form.data.provider} onChange={(value) => form.setData('provider', value)}>
                                {VIDEO_PROVIDERS.map((option) => (
                                    <ListboxOption key={option.value} value={option.value}>
                                        {option.label}
                                    </ListboxOption>
                                ))}
                            </Listbox>
                        </FormField>
                        <FormField error={form.errors.url}>
                            <Label>Video URL</Label>
                            <Description>YouTube links are embedded in the level player.</Description>
                            <Input
                                value={form.data.url}
                                onChange={(e) => form.setData('url', e.target.value)}
                                placeholder="https://www.youtube.com/watch?v=…"
                            />
                        </FormField>
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
