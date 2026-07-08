import { Button } from '@/components/catalyst/button';
import { useConfirmDialog } from '@/components/confirm-dialog';
import { useToast } from '@/components/toast/toast-provider';
import { type Video } from '@/types/learning';
import { CheckCircleIcon, FilmIcon } from '@heroicons/react/20/solid';
import { router } from '@inertiajs/react';
import clsx from 'clsx';

interface VideoPlayerProps {
    video: Video;
    canComplete?: boolean;
    featured?: boolean;
}

function getYoutubeEmbedUrl(url: string): string | null {
    const match = url.match(/(?:youtu\.be\/|v=|embed\/)([\w-]+)/);

    if (match) {
        return `https://www.youtube.com/embed/${match[1]}`;
    }

    return null;
}

function VideoEmbed({ video, featured }: { video: Video; featured: boolean }) {
    const containerClass = featured
        ? 'relative aspect-video bg-zinc-950'
        : 'aspect-video bg-zinc-100 dark:bg-zinc-800';

    if (video.provider === 'upload' && video.file_path) {
        return (
            <div className={containerClass}>
                <video
                    src={video.file_path}
                    controls
                    className={featured ? 'absolute inset-0 size-full' : 'size-full'}
                    title={video.title}
                >
                    Your browser does not support embedded video playback.
                </video>
            </div>
        );
    }

    const embedUrl = video.url ? getYoutubeEmbedUrl(video.url) ?? video.url : null;

    if (!embedUrl) {
        return (
            <div className={clsx(containerClass, 'flex items-center justify-center text-sm text-zinc-400')}>
                Video unavailable
            </div>
        );
    }

    return (
        <div className={containerClass}>
            <iframe
                src={embedUrl}
                className={featured ? 'absolute inset-0 size-full' : 'size-full'}
                allowFullScreen
                title={video.title}
            />
        </div>
    );
}

export function VideoPlayer({ video, canComplete = true, featured = false }: VideoPlayerProps) {
    const { confirm, ConfirmDialog } = useConfirmDialog();
    const { showSuccess } = useToast();

    const markWatched = async () => {
        const confirmed = await confirm({
            title: 'Mark video as watched?',
            description: `We'll record that you finished "${video.title}" and update your level progress.`,
            confirmLabel: 'Yes, mark watched',
            tone: 'success',
        });

        if (!confirmed) {
            return;
        }

        router.post(
            route('learn.videos.complete', video.id),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    showSuccess('Video completed', `"${video.title}" was marked as watched.`);
                },
            },
        );
    };

    return (
        <>
            <ConfirmDialog />
            <article
                className={clsx(
                    'overflow-hidden rounded-xl border border-zinc-950/10 bg-white dark:border-white/10 dark:bg-zinc-900',
                    video.completed && 'border-emerald-500/20',
                    featured && 'shadow-lg ring-1 ring-zinc-950/5 dark:ring-white/10',
                )}
            >
                {featured ? <VideoEmbed video={video} featured /> : null}

                <div className="flex items-center justify-between gap-3 border-b border-zinc-950/5 px-4 py-3 sm:px-5 dark:border-white/5">
                    <div className="flex min-w-0 items-center gap-3">
                        <span className="bg-brand-500/10 text-brand-600 dark:text-brand-400 flex size-9 shrink-0 items-center justify-center rounded-lg">
                            <FilmIcon className="size-5" />
                        </span>
                        <h3 className="font-medium text-zinc-950 dark:text-white">{video.title}</h3>
                    </div>
                    {video.completed && (
                        <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                            <CheckCircleIcon className="size-4" />
                            Watched
                        </span>
                    )}
                </div>

                {!featured && <VideoEmbed video={video} featured={false} />}

                {canComplete && !video.completed && (
                    <div className="border-t border-zinc-950/5 px-4 py-3 sm:px-5 dark:border-white/5">
                        <Button outline onClick={markWatched}>
                            Mark as watched
                        </Button>
                    </div>
                )}
            </article>
        </>
    );
}
