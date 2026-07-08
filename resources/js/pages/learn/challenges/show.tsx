import { ChallengeWorkspace } from '@/components/coding-challenge/challenge-workspace';
import { TutorPanel } from '@/components/ai/tutor-panel';
import { LearnPlayerLayout } from '@/components/learning/learn-player-layout';
import type { ChallengeSubmission, CodingChallenge } from '@/lib/coding-challenge-library/types';
import { type BreadcrumbItem } from '@/types';
import { type Enrollment, type LearningPath, type Level } from '@/types/learning';

interface Props {
    path: { data: LearningPath };
    level: { data: Level };
    enrollment: { data: Enrollment } | null;
    challenge: { data: CodingChallenge };
    submissions: { data: ChallengeSubmission[] };
    currentTask: string;
    github_connected?: boolean;
    evaluation_driver?: string;
}

export default function LearnChallengesShow({
    path: pathProp,
    level: levelProp,
    enrollment,
    challenge: challengeProp,
    submissions,
    currentTask,
    github_connected,
    evaluation_driver,
}: Props) {
    const path = pathProp.data;
    const level = levelProp.data;
    const challenge = challengeProp.data;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'My learning', href: '/learn/paths' },
        { title: path.name, href: route('learn.paths.show', path.id) },
        { title: `Level ${level.number}`, href: route('learn.levels.show', [path.id, level.id]) },
        { title: 'Challenge', href: route('learn.challenges.show', challenge.id) },
    ];

    return (
        <LearnPlayerLayout
            title={`${challenge.title} — ${path.name}`}
            breadcrumbs={breadcrumbs}
            path={path}
            level={level}
            enrollment={enrollment?.data ?? null}
            currentTask={currentTask}
        >
            <ChallengeWorkspace
                challenge={challenge}
                pathName={path.name}
                levelNumber={level.number}
                initialSubmissions={submissions.data}
                githubConnected={github_connected}
                evaluationDriver={evaluation_driver}
            />
            <TutorPanel
                contextType="challenge"
                contextId={challenge.id}
                levelId={level.id}
                title={challenge.title}
            />
        </LearnPlayerLayout>
    );
}
