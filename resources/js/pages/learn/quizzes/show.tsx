import { Badge } from '@/components/catalyst/badge';
import { QuizForm } from '@/components/learning/quiz-form';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type LearningPath, type Level, type Quiz } from '@/types/learning';
import { AcademicCapIcon, CheckCircleIcon } from '@heroicons/react/20/solid';
import { Head, Link } from '@inertiajs/react';

interface Props {
    path: Pick<LearningPath, 'id' | 'name' | 'slug'>;
    level: Pick<Level, 'id' | 'number' | 'title'>;
    quiz: { data: Quiz };
}

export default function LearnQuizzesShow({ path, level, quiz: quizProp }: Props) {
    const quiz = quizProp.data;
    const attemptsRemaining = quiz.max_attempts - (quiz.attempts_used ?? 0);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'My learning', href: '/learn/paths' },
        { title: path.name, href: route('learn.paths.show', path.id) },
        { title: `Level ${level.number}`, href: route('learn.levels.show', [path.id, level.id]) },
        { title: 'Quiz', href: route('learn.quizzes.show', quiz.id) },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${quiz.title} — ${path.name}`} />

            <div className="mx-auto max-w-3xl">
                <Link
                    href={route('learn.levels.show', [path.id, level.id])}
                    className="text-sm font-medium text-violet-600 hover:text-violet-500 dark:text-violet-400"
                >
                    ← Back to level
                </Link>

                <header className="mt-4 rounded-2xl border border-zinc-950/10 bg-zinc-900 px-6 py-8 text-white dark:border-white/10">
                    <p className="text-sm text-violet-300">
                        {path.name} · Level {level.number}
                    </p>
                    <h1 className="mt-2 text-2xl font-bold tracking-tight">{quiz.title}</h1>
                    <div className="mt-4 flex flex-wrap gap-2">
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

                <div className="mt-6 rounded-xl border border-zinc-950/10 bg-zinc-50 p-4 text-sm text-zinc-600 dark:border-white/10 dark:bg-zinc-800/40 dark:text-zinc-300">
                    <p className="flex items-start gap-2">
                        <AcademicCapIcon className="mt-0.5 size-4 shrink-0 text-violet-500" />
                        Answer all questions, then submit once. Your best score counts toward unlocking the next level.
                    </p>
                </div>

                <div className="mt-8">
                    <QuizForm quiz={quiz} disabled={quiz.passed} />
                </div>
            </div>
        </AppLayout>
    );
}
