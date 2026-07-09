import type { Level } from '@/types/learning';

export type LearnTaskType = 'overview' | 'material' | 'video' | 'quiz' | 'challenge';

export interface LearnTask {
    key: string;
    type: LearnTaskType;
    label: string;
    shortLabel: string;
    href: string;
    completed: boolean;
    step: number;
}

export function buildLevelTasks(pathId: number, level: Level): LearnTask[] {
    const tasks: LearnTask[] = [];
    let step = 1;

    tasks.push({
        key: 'overview',
        type: 'overview',
        label: 'Level overview',
        shortLabel: 'Overview',
        href: route('learn.levels.show', [pathId, level.id]),
        completed: false,
        step: step++,
    });

    for (const material of level.materials ?? []) {
        tasks.push({
            key: `material-${material.id}`,
            type: 'material',
            label: material.title,
            shortLabel: truncate(material.title, 28),
            href: route('learn.materials.show', material.id),
            completed: Boolean(material.completed),
            step: step++,
        });
    }

    for (const video of level.videos ?? []) {
        tasks.push({
            key: `video-${video.id}`,
            type: 'video',
            label: video.title,
            shortLabel: truncate(video.title, 28),
            href: route('learn.videos.show', video.id),
            completed: Boolean(video.completed),
            step: step++,
        });
    }

    if (level.quiz) {
        tasks.push({
            key: `quiz-${level.quiz.id}`,
            type: 'quiz',
            label: level.quiz.title,
            shortLabel: 'Quiz',
            href: route('learn.quizzes.show', level.quiz.id),
            completed: Boolean(level.quiz.passed),
            step: step++,
        });
    }

    for (const challenge of level.coding_challenges ?? []) {
        if (!challenge.is_active) {
            continue;
        }

        tasks.push({
            key: `challenge-${challenge.id}`,
            type: 'challenge',
            label: challenge.title,
            shortLabel: truncate(challenge.title, 28),
            href: route('learn.challenges.show', challenge.id),
            completed: Boolean(challenge.passed),
            step: step++,
        });
    }

    return tasks;
}

export function taskTypeLabel(type: LearnTaskType): string {
    return {
        overview: 'Overview',
        material: 'Reading',
        video: 'Video',
        quiz: 'Quiz',
        challenge: 'Challenge',
    }[type];
}

export function levelTaskProgress(tasks: LearnTask[]): { completed: number; total: number } {
    const actionable = tasks.filter((t) => t.type !== 'overview');

    return {
        completed: actionable.filter((t) => t.completed).length,
        total: actionable.length,
    };
}

function truncate(value: string, max: number): string {
    return value.length > max ? `${value.slice(0, max - 1)}…` : value;
}
