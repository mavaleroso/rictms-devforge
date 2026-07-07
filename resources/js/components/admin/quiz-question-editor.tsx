import { FormField } from '@/components/form/form-field';
import { useConfirmDialog, type ConfirmOptions } from '@/components/confirm-dialog';
import { Badge } from '@/components/catalyst/badge';
import { Button } from '@/components/catalyst/button';
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '@/components/catalyst/dialog';
import { Description, ErrorMessage, Field, Label } from '@/components/catalyst/fieldset';
import { Input } from '@/components/catalyst/input';
import { Listbox, ListboxOption } from '@/components/catalyst/listbox';
import { Radio, RadioField, RadioGroup } from '@/components/catalyst/radio';
import { Subheading } from '@/components/catalyst/heading';
import { Textarea } from '@/components/catalyst/textarea';
import { useValidatedForm } from '@/hooks/use-validated-form';
import { type QuestionType, type QuizQuestion } from '@/types/learning';
import { PencilSquareIcon, PlusIcon } from '@heroicons/react/20/solid';
import { router } from '@inertiajs/react';
import { FormEventHandler, useMemo, useState } from 'react';

const QUESTION_TYPES: { value: QuestionType; label: string; hint: string }[] = [
    {
        value: 'multiple_choice',
        label: 'Multiple choice',
        hint: 'Intern picks one option. Mark exactly one option as correct.',
    },
    {
        value: 'true_false',
        label: 'True / False',
        hint: 'Intern selects True or False. You choose which is correct.',
    },
    {
        value: 'identification',
        label: 'Identification',
        hint: 'Intern types a short answer. Grading is case-insensitive exact match.',
    },
];

type OptionDraft = { label: string; is_correct: boolean };

interface QuestionFormData {
    type: QuestionType;
    question: string;
    points: number;
    sort_order: number;
    correct_answer: string;
    options: OptionDraft[];
}

function defaultOptions(): OptionDraft[] {
    return [
        { label: '', is_correct: true },
        { label: '', is_correct: false },
        { label: '', is_correct: false },
        { label: '', is_correct: false },
    ];
}

function emptyForm(sortOrder: number): QuestionFormData {
    return {
        type: 'multiple_choice',
        question: '',
        points: 1,
        sort_order: sortOrder,
        correct_answer: 'true',
        options: defaultOptions(),
    };
}

function formFromQuestion(question: QuizQuestion): QuestionFormData {
    const options =
        question.type === 'multiple_choice' && question.options?.length
            ? question.options.map((option) => ({
                  label: option.label,
                  is_correct: Boolean(option.is_correct),
              }))
            : defaultOptions();

    return {
        type: question.type,
        question: question.question,
        points: question.points,
        sort_order: question.sort_order,
        correct_answer: question.correct_answer ?? 'true',
        options,
    };
}

function formatCorrectAnswer(question: QuizQuestion): string {
    if (question.type === 'multiple_choice') {
        const correct = question.options?.find((option) => option.is_correct);

        return correct ? `Answer: ${correct.label}` : 'No correct option set';
    }

    if (question.type === 'true_false') {
        return `Correct: ${question.correct_answer === 'false' ? 'False' : 'True'}`;
    }

    return `Answer: ${question.correct_answer ?? '—'}`;
}

interface QuizQuestionManagerProps {
    quizId: number;
    questions: QuizQuestion[];
    nextSortOrder: number;
}

export function QuizQuestionManager({ quizId, questions, nextSortOrder }: QuizQuestionManagerProps) {
    const { confirm, ConfirmDialog } = useConfirmDialog();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState<QuizQuestion | null>(null);

    const openCreate = () => {
        setEditing(null);
        setDialogOpen(true);
    };

    const openEdit = (question: QuizQuestion) => {
        setEditing(question);
        setDialogOpen(true);
    };

    const closeDialog = () => {
        setDialogOpen(false);
        setEditing(null);
    };

    const deleteQuestion = async (question: QuizQuestion) => {
        const confirmed = await confirm({
            title: 'Delete question?',
            description: 'This question and its answer options will be permanently removed from the quiz.',
            confirmLabel: 'Delete',
            variant: 'danger',
        });

        if (confirmed) {
            router.delete(route('admin.questions.destroy', question.id));
        }
    };

    return (
        <div className="space-y-4">
            <ConfirmDialog />
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <Subheading>Questions</Subheading>
                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                        Define the correct answer for each type so auto-grading works when interns submit the quiz.
                    </p>
                </div>
                <Button type="button" onClick={openCreate}>
                    <PlusIcon data-slot="icon" />
                    Add question
                </Button>
            </div>

            {questions.length === 0 ? (
                <div className="rounded-xl border border-dashed border-zinc-300 p-8 text-center dark:border-zinc-600">
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">No questions yet. Add at least one to enable level completion.</p>
                </div>
            ) : (
                <ul className="space-y-3">
                    {questions.map((question, index) => (
                        <li
                            key={question.id}
                            className="rounded-xl border border-zinc-950/10 bg-white p-4 dark:border-white/10 dark:bg-zinc-900"
                        >
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-xs font-medium text-zinc-500">Q{index + 1}</span>
                                        <Badge>{question.type.replace('_', ' ')}</Badge>
                                        <Badge color="zinc">{question.points} pts</Badge>
                                    </div>
                                    <p className="mt-2 font-medium text-zinc-950 dark:text-white">{question.question}</p>
                                    <p className="mt-2 text-sm text-emerald-700 dark:text-emerald-400">{formatCorrectAnswer(question)}</p>
                                </div>
                                <div className="flex gap-2">
                                    <Button type="button" outline onClick={() => openEdit(question)}>
                                        <PencilSquareIcon data-slot="icon" />
                                        Edit
                                    </Button>
                                    <Button type="button" plain onClick={() => deleteQuestion(question)}>
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            <QuestionDialog
                key={editing?.id ?? 'new'}
                open={dialogOpen}
                onClose={closeDialog}
                quizId={quizId}
                question={editing}
                initialData={editing ? formFromQuestion(editing) : emptyForm(nextSortOrder)}
                confirm={confirm}
            />
        </div>
    );
}

interface QuestionDialogProps {
    open: boolean;
    onClose: () => void;
    quizId: number;
    question: QuizQuestion | null;
    initialData: QuestionFormData;
    confirm: (options: ConfirmOptions) => Promise<boolean>;
}

function QuestionDialog({ open, onClose, quizId, question, initialData, confirm }: QuestionDialogProps) {
    const form = useValidatedForm(initialData);
    const typeHint = useMemo(() => QUESTION_TYPES.find((item) => item.value === form.data.type)?.hint ?? '', [form.data.type]);

    const setType = (type: QuestionType) => {
        form.setData('type', type);

        if (type === 'multiple_choice') {
            form.setData('options', defaultOptions());
            form.setData('correct_answer', '');
        }

        if (type === 'true_false') {
            form.setData('correct_answer', 'true');
        }

        if (type === 'identification') {
            form.setData('correct_answer', '');
        }
    };

    const setCorrectOption = (index: number) => {
        form.setData(
            'options',
            form.data.options.map((option, i) => ({ ...option, is_correct: i === index })),
        );
    };

    const submit: FormEventHandler = async (e) => {
        e.preventDefault();

        const confirmed = await confirm(
            question
                ? {
                      title: 'Save question changes?',
                      description: 'The updated question and correct answer will apply to future quiz attempts.',
                      confirmLabel: 'Save question',
                  }
                : {
                      title: 'Add question?',
                      description: 'This question will be added to the level quiz with the correct answer for auto-grading.',
                      confirmLabel: 'Add question',
                  },
        );

        if (!confirmed) {
            return;
        }

        const options =
            form.data.type === 'multiple_choice'
                ? form.data.options
                : undefined;

        const payload = {
            type: form.data.type,
            question: form.data.question,
            points: form.data.points,
            sort_order: form.data.sort_order,
            correct_answer: form.data.type === 'multiple_choice' ? null : form.data.correct_answer,
            options,
        };

        if (question) {
            form.transform(() => payload).patch(route('admin.questions.update', question.id), {
                onSuccess: onClose,
                successToast: { title: 'Question saved', message: 'Quiz question and correct answer were updated.' },
            });

            return;
        }

        form.transform(() => payload).post(route('admin.questions.store', quizId), {
            onSuccess: onClose,
            successToast: { title: 'Question added', message: 'The question is now part of this level quiz.' },
        });
    };

    return (
        <Dialog open={open} onClose={onClose} size="2xl">
            <DialogTitle>{question ? 'Edit question' : 'Add question'}</DialogTitle>
            <DialogDescription>{typeHint}</DialogDescription>
            <DialogBody>
                <form id="quiz-question-form" onSubmit={submit} className="space-y-4">
                    <FormField error={form.errors.type}>
                        <Label>Question type</Label>
                        <Listbox value={form.data.type} onChange={setType}>
                            {QUESTION_TYPES.map((item) => (
                                <ListboxOption key={item.value} value={item.value}>
                                    {item.label}
                                </ListboxOption>
                            ))}
                        </Listbox>
                    </FormField>

                    <FormField error={form.errors.question}>
                        <Label>Question prompt</Label>
                        <Textarea value={form.data.question} onChange={(e) => form.setData('question', e.target.value)} rows={3} />
                    </FormField>

                    {form.data.type === 'multiple_choice' && (
                        <div className="space-y-3 rounded-lg border border-zinc-200 p-4 dark:border-zinc-700">
                            <Field>
                                <Label>Answer options</Label>
                                <Description>Select the radio button next to the correct option.</Description>
                            </Field>
                            <RadioGroup
                                value={String(form.data.options.findIndex((option) => option.is_correct))}
                                onChange={(value) => setCorrectOption(Number(value))}
                            >
                                {form.data.options.map((option, index) => (
                                    <div key={index} className="flex items-start gap-3">
                                        <RadioField className="shrink-0 pt-2">
                                            <Radio value={String(index)} />
                                            <Label className="sr-only">Mark option {index + 1} as correct</Label>
                                        </RadioField>
                                        <FormField error={form.errors[`options.${index}.label`]} className="flex-1">
                                            <Label>Option {index + 1}</Label>
                                            <Input
                                                value={option.label}
                                                onChange={(e) => {
                                                    const options = [...form.data.options];
                                                    options[index] = { ...options[index], label: e.target.value };
                                                    form.setData('options', options);
                                                }}
                                                placeholder={index === 0 ? 'e.g. Thin controllers delegating to Actions' : ''}
                                            />
                                        </FormField>
                                    </div>
                                ))}
                            </RadioGroup>
                        </div>
                    )}

                    {form.data.type === 'true_false' && (
                        <Field>
                            <Label>Correct answer</Label>
                            <Description>Which choice should be graded as correct?</Description>
                            <RadioGroup value={form.data.correct_answer} onChange={(value) => form.setData('correct_answer', value)}>
                                <RadioField>
                                    <Radio value="true" />
                                    <Label>True is correct</Label>
                                </RadioField>
                                <RadioField>
                                    <Radio value="false" />
                                    <Label>False is correct</Label>
                                </RadioField>
                            </RadioGroup>
                            {form.errors.correct_answer && <ErrorMessage>{form.errors.correct_answer}</ErrorMessage>}
                        </Field>
                    )}

                    {form.data.type === 'identification' && (
                        <FormField error={form.errors.correct_answer}>
                            <Label>Correct answer</Label>
                            <Description>Interns must type this text (case-insensitive). Keep answers short — one word or phrase.</Description>
                            <Input
                                value={form.data.correct_answer}
                                onChange={(e) => form.setData('correct_answer', e.target.value)}
                                placeholder="e.g. Catalyst"
                            />
                        </FormField>
                    )}

                    <FormField error={form.errors.points}>
                        <Label>Points</Label>
                        <Input
                            type="number"
                            min={1}
                            value={form.data.points}
                            onChange={(e) => form.setData('points', Number(e.target.value))}
                        />
                    </FormField>
                </form>
            </DialogBody>
            <DialogActions>
                <Button plain onClick={onClose}>
                    Cancel
                </Button>
                <Button type="submit" form="quiz-question-form" disabled={form.processing}>
                    {question ? 'Save question' : 'Add question'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
