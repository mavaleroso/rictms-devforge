import { MaterialViewer } from '@/components/learning/material-viewer';
import { LearnPlayerLayout } from '@/components/learning/learn-player-layout';
import { LearnTaskNav } from '@/components/learning/learn-task-nav';
import { type BreadcrumbItem } from '@/types';
import { type Enrollment, type LearningMaterial, type LearningPath, type Level } from '@/types/learning';

interface Props {
    path: { data: LearningPath };
    level: { data: Level };
    enrollment: { data: Enrollment } | null;
    material: { data: LearningMaterial };
    currentTask: string;
}

export default function LearnMaterialsShow({ path: pathProp, level: levelProp, enrollment, material: materialProp, currentTask }: Props) {
    const path = pathProp.data;
    const level = levelProp.data;
    const material = materialProp.data;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'My learning', href: '/learn/paths' },
        { title: path.name, href: route('learn.paths.show', path.id) },
        { title: `Level ${level.number}`, href: route('learn.levels.show', [path.id, level.id]) },
        { title: material.title, href: route('learn.materials.show', material.id) },
    ];

    return (
        <LearnPlayerLayout
            title={`${material.title} — ${path.name}`}
            breadcrumbs={breadcrumbs}
            path={path}
            level={level}
            enrollment={enrollment?.data ?? null}
            currentTask={currentTask}
        >
            <div className="mb-3">
                <p className="text-xs text-zinc-500">
                    {path.name} · Level {level.number} · Reading
                </p>
                <h1 className="mt-1 text-lg font-semibold text-zinc-950 dark:text-white">{material.title}</h1>
            </div>

            <MaterialViewer material={material} />

            <div className="mt-6">
                <LearnTaskNav pathId={path.id} level={level} currentTask={currentTask} />
            </div>
        </LearnPlayerLayout>
    );
}
