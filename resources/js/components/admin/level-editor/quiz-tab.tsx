import { QuizQuestionManager } from '@/components/admin/quiz-question-editor';
import { StepChecklist, StepSidebarCard, LevelStepShell } from '@/components/admin/level-editor/level-step-shell';
import { useConfirmDialog } from '@/components/confirm-dialog';
import { FormField } from '@/components/form/form-field';
import { Button } from '@/components/catalyst/button';
import { Description, Label } from '@/components/catalyst/fieldset';
import { Input } from '@/components/catalyst/input';
import { Subheading } from '@/components/catalyst/heading';
import { type Level } from '@/types/learning';
import { useValidatedForm } from '@/hooks/use-validated-form';
import { FormEventHandler } from 'react';

interface QuizTabProps {
    pathId: number;
    level: Level;
    onPrev?: () => void;
    curriculumHref: string;
}

export function QuizTab({ pathId, level, onPrev, curriculumHref }: QuizTabProps) {
    const { confirm, ConfirmDialog } = useConfirmDialog();
    const questionCount = level.quiz?.questions?.length ?? 0;

    const form = useValidatedForm({
        title: level.quiz?.title ?? `Level ${level.number} Quiz`,
        passing_score: level.quiz?.passing_score ?? 80,
        max_attempts: level.quiz?.max_attempts ?? 3,
    });

    const saveSettings: FormEventHandler = async (e) => {
        e.preventDefault();

        const confirmed = await confirm({
            title: 'Save quiz rules?',
            description: 'Passing score and attempt limits will apply to all intern quiz submissions for this level.',
            confirmLabel: 'Save rules',
        });

        if (confirmed) {
            form.patch(route('admin.quiz.update', [pathId, level.id]), {
                successToast: { title: 'Quiz rules saved', message: 'Passing score and attempt limits are updated.' },
            });
        }
    };

    return (
        <LevelStepShell
            step="quiz"
            onPrev={onPrev}
            sidebar={
                <>
                    <StepSidebarCard title="How answers are graded">
                        <dl className="space-y-3">
                            <div>
                                <dt className="font-medium text-zinc-950 dark:text-white">Multiple choice</dt>
                                <dd>Mark one option with the radio button. Interns select an option ID.</dd>
                            </div>
                            <div>
                                <dt className="font-medium text-zinc-950 dark:text-white">True / False</dt>
                                <dd>Choose which value is correct. Stored as <code className="text-xs">true</code> or <code className="text-xs">false</code>.</dd>
                            </div>
                            <div>
                                <dt className="font-medium text-zinc-950 dark:text-white">Identification</dt>
                                <dd>Enter the exact expected text. Matching is case-insensitive.</dd>
                            </div>
                        </dl>
                    </StepSidebarCard>
                    <StepSidebarCard title="Checklist">
                        <StepChecklist
                            items={[
                                { label: 'Passing score and attempts configured', done: form.data.passing_score > 0 },
                                { label: 'At least one question with a correct answer', done: questionCount > 0 },
                            ]}
                        />
                    </StepSidebarCard>
                    <StepSidebarCard title="Completion rule" variant="tip">
                        Interns must reach the passing score within max attempts to unlock the next level.
                    </StepSidebarCard>
                </>
            }
        >
            <ConfirmDialog />
            <div className="space-y-8">
                <form onSubmit={saveSettings} className="rounded-lg border border-zinc-950/10 bg-zinc-50 p-5 dark:border-white/10 dark:bg-zinc-800/40">
                    <Subheading level={3}>Quiz rules</Subheading>
                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Applied when interns submit their answers.</p>
                    <div className="mt-4 grid gap-4 sm:grid-cols-3">
                        <FormField error={form.errors.title}>
                            <Label>Quiz title</Label>
                            <Input value={form.data.title} onChange={(e) => form.setData('title', e.target.value)} />
                        </FormField>
                        <FormField error={form.errors.passing_score}>
                            <Label>Passing score (%)</Label>
                            <Input
                                type="number"
                                min={1}
                                max={100}
                                value={form.data.passing_score}
                                onChange={(e) => form.setData('passing_score', Number(e.target.value))}
                            />
                        </FormField>
                        <FormField error={form.errors.max_attempts}>
                            <Label>Max attempts</Label>
                            <Description>How many tries per intern.</Description>
                            <Input
                                type="number"
                                min={1}
                                value={form.data.max_attempts}
                                onChange={(e) => form.setData('max_attempts', Number(e.target.value))}
                            />
                        </FormField>
                    </div>
                    <Button type="submit" className="mt-4" disabled={form.processing}>
                        Save quiz rules
                    </Button>
                </form>

                {level.quiz ? (
                    <QuizQuestionManager
                        quizId={level.quiz.id}
                        questions={level.quiz.questions ?? []}
                        nextSortOrder={questionCount + 1}
                    />
                ) : (
                    <p className="text-sm text-zinc-500">Quiz record is missing for this level.</p>
                )}

                <div className="flex justify-end border-t border-zinc-950/5 pt-6 dark:border-white/5">
                    <Button href={curriculumHref}>Back to curriculum</Button>
                </div>
            </div>
        </LevelStepShell>
    );
}
