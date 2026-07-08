import type { Level, LevelEditorTab } from '@/types/learning';

export const LEVEL_EDITOR_TABS: LevelEditorTab[] = ['overview', 'materials', 'videos', 'quiz', 'challenge'];

export const TAB_META: Record<
    LevelEditorTab,
    { label: string; shortLabel: string; description: string; optional?: boolean }
> = {
    overview: {
        label: 'Overview',
        shortLabel: 'Overview',
        description: 'Set the level title, learning goals, and time estimate interns see before starting.',
    },
    materials: {
        label: 'Materials',
        shortLabel: 'Materials',
        description: 'Add reading lessons and reference content. Interns complete these before the quiz.',
    },
    videos: {
        label: 'Videos',
        shortLabel: 'Videos',
        description: 'Optional walkthrough videos embedded in the level player.',
        optional: true,
    },
    quiz: {
        label: 'Quiz',
        shortLabel: 'Quiz',
        description: 'Configure passing rules and define questions with correct answers for auto-grading.',
    },
    challenge: {
        label: 'Coding Challenge',
        shortLabel: 'Challenge',
        description: 'Hands-on problem with editor, automated test cases, and optional mentor review.',
    },
};

export function nextTab(current: LevelEditorTab): LevelEditorTab | null {
    const index = LEVEL_EDITOR_TABS.indexOf(current);

    return index < LEVEL_EDITOR_TABS.length - 1 ? LEVEL_EDITOR_TABS[index + 1] : null;
}

export function prevTab(current: LevelEditorTab): LevelEditorTab | null {
    const index = LEVEL_EDITOR_TABS.indexOf(current);

    return index > 0 ? LEVEL_EDITOR_TABS[index - 1] : null;
}

export function tabProgress(level: Level): Record<LevelEditorTab, boolean> {
    return {
        overview: Boolean(level.title?.trim() && level.overview?.trim()),
        materials: (level.materials?.length ?? level.materials_count ?? 0) > 0,
        videos: (level.videos?.length ?? level.videos_count ?? 0) > 0,
        quiz: (level.quiz?.questions?.length ?? level.quiz?.questions_count ?? 0) > 0,
        challenge: (level.coding_challenge?.test_cases?.length ?? level.coding_challenge?.test_cases_count ?? 0) > 0,
    };
}

export function completedStepCount(level: Level): number {
    const progress = tabProgress(level);

    return Object.values(progress).filter(Boolean).length;
}
