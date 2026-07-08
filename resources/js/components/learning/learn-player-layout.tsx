import { LearnCourseSidebar } from '@/components/learning/learn-course-sidebar';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { Enrollment, LearningPath, Level } from '@/types/learning';
import { Head } from '@inertiajs/react';
import type { ReactNode } from 'react';

interface LearnPlayerLayoutProps {
    title: string;
    breadcrumbs: BreadcrumbItem[];
    path: LearningPath;
    level: Level;
    enrollment?: Enrollment | null;
    currentTask: string;
    children: ReactNode;
    fullWidth?: boolean;
}

export function LearnPlayerLayout({
    title,
    breadcrumbs,
    path,
    level,
    enrollment,
    currentTask,
    children,
    fullWidth = false,
}: LearnPlayerLayoutProps) {
    const levels = path.levels ?? [];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={title} />

            <div className={fullWidth ? 'space-y-4' : 'grid gap-6 xl:grid-cols-[minmax(0,1fr)_17.5rem]'}>
                <div className="min-w-0">{children}</div>

                {levels.length > 0 && !fullWidth && (
                    <LearnCourseSidebar
                        pathId={path.id}
                        pathName={path.name}
                        levels={levels}
                        currentLevelId={level.id}
                        currentLevel={level}
                        currentTask={currentTask}
                        enrollment={enrollment}
                    />
                )}
            </div>
        </AppLayout>
    );
}
