import { Badge } from '@/components/catalyst/badge';
import { QuizForm } from '@/components/learning/quiz-form';
import { LearnPlayerLayout } from '@/components/learning/learn-player-layout';
import { LearnTaskNav } from '@/components/learning/learn-task-nav';
import { type BreadcrumbItem } from '@/types';
import { type Enrollment, type LearningPath, type Level, type Quiz } from '@/types/learning';
import { AcademicCapIcon, CheckCircleIcon } from '@heroicons/react/20/solid';

interface Props {
    path: { data: LearningPath };
    level: { data: Level };
    enrollment: { data: Enrollment } | null;
    quiz: { data: Quiz };
    currentTask: string;
}

export default function LearnQuizzesShow({ path: pathProp, level: levelProp, enrollment, quiz: quizProp, currentTask }: Props) {
    const path = pathProp.data;
    const level = levelProp.data;
    const quiz = quizProp.data;
    const attemptsRemaining = quiz.max_attempts - (quiz.attempts_used ?? 0);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'My learning', href: '/learn/paths' },
        { title: path.name, href: route('learn.paths.show', path.id) },
        { title: `Level ${level.number}`, href: route('learn.levels.show', [path.id, level.id]) },
        { title: 'Quiz', href: route('learn.quizzes.show', quiz.id) },
    ];

    return (
        <LearnPlayerLayout
            title={`${quiz.title} — ${path.name}`}
            breadcrumbs={breadcrumbs}
            path={path}
            level={level}
            enrollment={enrollment?.data ?? null}
            currentTask={currentTask}
        >
            <header className="rounded-xl border border-zinc-950/10 bg-zinc-900 px-5 py-6 text-white dark:border-white/10">
                <p className="text-xs text-violet-300">
                    {path.name} · Level {level.number}
                </p>
                <h1 className="mt-1.5 text-xl font-bold tracking-tight">{quiz.title}</h1>
                <div className="mt-3 flex flex-wrap gap-2">
                    <Badge className="bg-white/10 text-white ring-white/20">Pass {quiz.passing_score}%</Badge>
                    <Badge className="bg-white/10 text-white ring-white/20">
                        {attemptsRemaining} {attemptsRemaining === 1 ? 'attempt' : 'attempts'} left
                    </Badge>
                    {quiz.passed && (
                        <Badge color="green" className="gap-1">
                            <CheckCircleIcon className="size-3" />
                            Passed
                        </Badge>
                    )}
                </div>
            </header>

            <div className="mt-4 rounded-xl border border-zinc-950/10 bg-zinc-50 p-3.5 text-sm text-zinc-600 dark:border-white/10 dark:bg-zinc-800/40 dark:text-zinc-300">
                <p className="flex items-start gap-2">
                    <AcademicCapIcon className="mt-0.5 size-4 shrink-0 text-violet-500" />
                    Answer all questions, then submit once. Your best score counts toward unlocking the next level.
                </p>
            </div>

            <div className="mt-6">
                <QuizForm quiz={quiz} disabled={quiz.passed} />
            </div>

            <div className="mt-6">
                <LearnTaskNav pathId={path.id} level={level} currentTask={currentTask} />
            </div>
        </LearnPlayerLayout>
    );
}
