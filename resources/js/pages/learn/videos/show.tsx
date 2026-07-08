import { VideoPlayer } from '@/components/learning/video-player';
import { LearnPlayerLayout } from '@/components/learning/learn-player-layout';
import { LearnTaskNav } from '@/components/learning/learn-task-nav';
import { type BreadcrumbItem } from '@/types';
import { type Enrollment, type LearningPath, type Level, type Video } from '@/types/learning';

interface Props {
    path: { data: LearningPath };
    level: { data: Level };
    enrollment: { data: Enrollment } | null;
    video: { data: Video };
    currentTask: string;
}

export default function LearnVideosShow({ path: pathProp, level: levelProp, enrollment, video: videoProp, currentTask }: Props) {
    const path = pathProp.data;
    const level = levelProp.data;
    const video = videoProp.data;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'My learning', href: '/learn/paths' },
        { title: path.name, href: route('learn.paths.show', path.id) },
        { title: `Level ${level.number}`, href: route('learn.levels.show', [path.id, level.id]) },
        { title: video.title, href: route('learn.videos.show', video.id) },
    ];

    return (
        <LearnPlayerLayout
            title={`${video.title} — ${path.name}`}
            breadcrumbs={breadcrumbs}
            path={path}
            level={level}
            enrollment={enrollment?.data ?? null}
            currentTask={currentTask}
        >
            <div className="mb-3">
                <p className="text-xs text-zinc-500">
                    {path.name} · Level {level.number} · Video
                </p>
                <h1 className="mt-1 text-lg font-semibold text-zinc-950 dark:text-white">{video.title}</h1>
            </div>

            <VideoPlayer video={video} featured />

            <div className="mt-6">
                <LearnTaskNav pathId={path.id} level={level} currentTask={currentTask} />
            </div>
        </LearnPlayerLayout>
    );
}
