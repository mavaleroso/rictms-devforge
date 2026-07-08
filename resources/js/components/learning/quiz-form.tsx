import { FormField } from '@/components/form/form-field';
import { useConfirmDialog } from '@/components/confirm-dialog';
import { Button } from '@/components/catalyst/button';
import { ErrorMessage, Label } from '@/components/catalyst/fieldset';
import { Input } from '@/components/catalyst/input';
import { Radio, RadioField, RadioGroup } from '@/components/catalyst/radio';
import { Textarea } from '@/components/catalyst/textarea';
import { type Quiz, type QuizQuestion } from '@/types/learning';
import { useValidatedForm } from '@/hooks/use-validated-form';
import { FormEventHandler } from 'react';

interface QuizFormProps {
    quiz: Quiz;
    disabled?: boolean;
}

function buildInitialAnswers(quiz: Quiz): Record<string, string> {
    const answers: Record<string, string> = {};

    quiz.questions?.forEach((question) => {
        const key = String(question.id);
        answers[key] = quiz.last_answers?.[key] ?? '';
    });

    return answers;
}

export function QuizForm({ quiz, disabled = false }: QuizFormProps) {
    const { confirm, ConfirmDialog } = useConfirmDialog();
    const { data, setData, post, processing, errors } = useValidatedForm({ answers: buildInitialAnswers(quiz) });

    const setAnswer = (questionId: number, value: string) => {
        setData('answers', { ...data.answers, [String(questionId)]: value });
    };

    const submit: FormEventHandler = async (e) => {
        e.preventDefault();

        const confirmed = await confirm({
            title: 'Submit your quiz?',
            description: 'Your answers will be graded immediately. You cannot edit them after submission, so review each question first.',
            confirmLabel: 'Submit answers',
            tone: 'warning',
        });

        if (confirmed) {
            post(route('learn.quizzes.submit', quiz.id), {
                successToast: { title: 'Quiz submitted', message: 'Your answers are being graded.' },
            });
        }
    };

    const attemptsRemaining = quiz.max_attempts - (quiz.attempts_used ?? 0);
    const canSubmit = !disabled && !quiz.passed && attemptsRemaining > 0;
    const questionCount = quiz.questions?.length ?? 0;

    return (
        <>
            <ConfirmDialog />
            <form onSubmit={submit} className="space-y-4">
                {quiz.questions?.map((question: QuizQuestion, index) => (
                    <div
                        key={question.id}
                        className="rounded-xl border border-zinc-950/10 bg-white p-5 dark:border-white/10 dark:bg-zinc-900"
                    >
                        <p className="text-xs font-semibold tracking-wide text-brand-600 uppercase dark:text-brand-400">
                            Question {index + 1} of {questionCount}
                        </p>
                        <p className="mt-2 font-medium text-zinc-950 dark:text-white">
                            {question.question}{' '}
                            <span className="text-sm font-normal text-zinc-500">({question.points} pts)</span>
                        </p>

                        <div className="mt-4">
                            {question.type === 'multiple_choice' && question.options && (
                                <RadioGroup
                                    value={data.answers[String(question.id)]}
                                    onChange={(v) => setAnswer(question.id, v)}
                                    disabled={!canSubmit}
                                >
                                    {question.options.map((option) => (
                                        <RadioField key={option.id}>
                                            <Radio value={String(option.id)} />
                                            <Label>{option.label}</Label>
                                        </RadioField>
                                    ))}
                                </RadioGroup>
                            )}

                            {question.type === 'true_false' && (
                                <RadioGroup
                                    value={data.answers[String(question.id)]}
                                    onChange={(v) => setAnswer(question.id, v)}
                                    disabled={!canSubmit}
                                >
                                    <RadioField>
                                        <Radio value="true" />
                                        <Label>True</Label>
                                    </RadioField>
                                    <RadioField>
                                        <Radio value="false" />
                                        <Label>False</Label>
                                    </RadioField>
                                </RadioGroup>
                            )}

                            {(question.type === 'identification' || question.type === 'essay') && (
                                <FormField error={errors[`answers.${question.id}`]}>
                                    <Label>Your answer</Label>
                                    {question.type === 'essay' ? (
                                        <Textarea
                                            value={data.answers[String(question.id)]}
                                            onChange={(e) => setAnswer(question.id, e.target.value)}
                                            disabled={!canSubmit}
                                            rows={4}
                                        />
                                    ) : (
                                        <Input
                                            value={data.answers[String(question.id)]}
                                            onChange={(e) => setAnswer(question.id, e.target.value)}
                                            disabled={!canSubmit}
                                        />
                                    )}
                                </FormField>
                            )}
                        </div>
                    </div>
                ))}

                {errors.quiz && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-500/30 dark:bg-red-950/40">
                        <ErrorMessage>{errors.quiz}</ErrorMessage>
                    </div>
                )}

                <div className="flex flex-col gap-4 rounded-xl border border-zinc-950/10 bg-zinc-50 p-5 sm:flex-row sm:items-center sm:justify-between dark:border-white/10 dark:bg-zinc-800/40">
                    <p className="text-sm text-zinc-600 dark:text-zinc-300">
                        Attempts: {quiz.attempts_used ?? 0}/{quiz.max_attempts}
                        {quiz.best_score !== undefined && ` · Best score: ${quiz.best_score}%`}
                        {quiz.passed && ' · Passed'}
                    </p>
                    {canSubmit && (
                        <Button type="submit" disabled={processing} color="dark/zinc">
                            Submit quiz
                        </Button>
                    )}
                </div>
            </form>
        </>
    );
}
