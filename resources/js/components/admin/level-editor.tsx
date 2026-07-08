import { LevelWorkflowGuide } from '@/components/admin/level-workflow-guide';
import { ChallengeTab } from '@/components/admin/level-editor/challenge-tab';
import { MaterialsTab } from '@/components/admin/level-editor/materials-tab';
import { OverviewTab } from '@/components/admin/level-editor/overview-tab';
import { QuizTab } from '@/components/admin/level-editor/quiz-tab';
import { VideosTab } from '@/components/admin/level-editor/videos-tab';
import { nextTab, prevTab } from '@/components/admin/level-editor/constants';
import { type Level, type LearningPath, type LevelEditorTab } from '@/types/learning';
import { useState } from 'react';

interface LevelEditorProps {
    path: Pick<LearningPath, 'id' | 'name' | 'slug'>;
    level: Level;
}

export function LevelEditor({ path, level }: LevelEditorProps) {
    const [tab, setTab] = useState<LevelEditorTab>('overview');

    const goNext = () => {
        const next = nextTab(tab);

        if (next) {
            setTab(next);
        }
    };

    const goPrev = () => {
        const prev = prevTab(tab);

        if (prev) {
            setTab(prev);
        }
    };

    const curriculumHref = route('admin.paths.edit', path.id);

    return (
        <div className="space-y-8">
            <LevelWorkflowGuide
                activeTab={tab}
                onTabChange={setTab}
                level={level}
                onPrev={prevTab(tab) ? goPrev : undefined}
                onNext={nextTab(tab) ? goNext : undefined}
            />

            {tab === 'overview' && (
                <OverviewTab pathId={path.id} level={level} onPrev={prevTab(tab) ? goPrev : undefined} onNext={goNext} />
            )}
            {tab === 'materials' && (
                <MaterialsTab pathId={path.id} level={level} onPrev={goPrev} onNext={goNext} />
            )}
            {tab === 'videos' && <VideosTab pathId={path.id} level={level} onPrev={goPrev} onNext={goNext} />}
            {tab === 'quiz' && <QuizTab pathId={path.id} level={level} onPrev={goPrev} onNext={goNext} />}
            {tab === 'challenge' && (
                <ChallengeTab pathId={path.id} level={level} onPrev={goPrev} curriculumHref={curriculumHref} />
            )}
        </div>
    );
}
