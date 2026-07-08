import { useConfirmDialog } from '@/components/confirm-dialog';
import { FormField } from '@/components/form/form-field';
import { Badge } from '@/components/catalyst/badge';
import { Button } from '@/components/catalyst/button';
import { Description, Label } from '@/components/catalyst/fieldset';
import { Input } from '@/components/catalyst/input';
import { Textarea } from '@/components/catalyst/textarea';
import { Switch, SwitchField } from '@/components/catalyst/switch';
import { surfaces } from '@/lib/theme';
import { useValidatedForm } from '@/hooks/use-validated-form';
import { type ChallengeTestCase, type CodingChallenge } from '@/types/learning';
import { BeakerIcon, EyeIcon, EyeSlashIcon, PencilSquareIcon, PlusIcon, TrashIcon } from '@heroicons/react/20/solid';
import { router } from '@inertiajs/react';
import clsx from 'clsx';
import { FormEventHandler, useState } from 'react';

interface ChallengeTestCaseManagerProps {
    challenge: CodingChallenge;
}

function TestCaseForm({
    challengeId,
    testCase,
    onDone,
}: {
    challengeId: number;
    testCase?: ChallengeTestCase;
    onDone: () => void;
}) {
    const form = useValidatedForm({
        label: testCase?.label ?? '',
        input_args: JSON.stringify(testCase?.input?.args ?? [], null, 2),
        expected_output: testCase?.expected_output ?? '',
        explanation: testCase?.explanation ?? '',
        is_sample: testCase?.is_sample ?? true,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        let args: unknown[];

        try {
            args = JSON.parse(form.data.input_args) as unknown[];
        } catch {
            form.setError('input_args', 'Invalid JSON array');

            return;
        }

        const payload = {
            label: form.data.label || null,
            input: { args },
            expected_output: form.data.expected_output,
            explanation: form.data.explanation || null,
            is_sample: form.data.is_sample,
        };

        if (testCase) {
            form.patch(route('admin.challenge-test-cases.update', testCase.id), {
                ...payload,
                onSuccess: onDone,
                successToast: { title: 'Test case updated', message: 'Test case saved.' },
            });
        } else {
            form.post(route('admin.challenge-test-cases.store', challengeId), {
                ...payload,
                onSuccess: onDone,
                successToast: { title: 'Test case added', message: 'Test case saved.' },
            });
        }
    };

    return (
        <form
            onSubmit={submit}
            className={clsx('space-y-3 rounded-lg border border-slate-200/80 p-3 dark:border-slate-800', surfaces.cardMuted)}
        >
            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
                <FormField error={form.errors.label}>
                    <Label>Label</Label>
                    <Input value={form.data.label} onChange={(e) => form.setData('label', e.target.value)} placeholder="Example 1" />
                </FormField>
                <SwitchField className="sm:pb-1">
                    <Label>Sample case</Label>
                    <Description>Visible before submit.</Description>
                    <Switch checked={form.data.is_sample} onChange={(checked) => form.setData('is_sample', checked)} />
                </SwitchField>
            </div>
            <div className="grid gap-3 lg:grid-cols-2">
                <FormField error={form.errors.input_args}>
                    <Label>Input args (JSON)</Label>
                    <Textarea
                        rows={3}
                        value={form.data.input_args}
                        onChange={(e) => form.setData('input_args', e.target.value)}
                        className="font-mono text-xs"
                        placeholder="[[2,7,11,15], 9]"
                    />
                </FormField>
                <div className="space-y-3">
                    <FormField error={form.errors.expected_output}>
                        <Label>Expected output</Label>
                        <Input
                            value={form.data.expected_output}
                            onChange={(e) => form.setData('expected_output', e.target.value)}
                            className="font-mono text-xs"
                        />
                    </FormField>
                    <FormField error={form.errors.explanation}>
                        <Label>Explanation</Label>
                        <Input value={form.data.explanation} onChange={(e) => form.setData('explanation', e.target.value)} />
                    </FormField>
                </div>
            </div>
            <div className="flex gap-2">
                <Button type="submit" color="dark/zinc" disabled={form.processing} className="!text-xs">
                    {testCase ? 'Update case' : 'Add case'}
                </Button>
                <Button type="button" plain onClick={onDone} className="!text-xs">
                    Cancel
                </Button>
            </div>
        </form>
    );
}

function TestCaseRow({
    testCase,
    onEdit,
    onDelete,
}: {
    testCase: ChallengeTestCase;
    onEdit: () => void;
    onDelete: () => void;
}) {
    return (
        <div className="flex items-start gap-3 rounded-lg border border-slate-200/80 bg-white px-3 py-2.5 dark:border-slate-800 dark:bg-slate-900">
            <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-500 dark:bg-slate-800">
                <BeakerIcon className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                        {testCase.label ?? `Case ${testCase.sort_order}`}
                    </span>
                    {testCase.is_sample ? (
                        <Badge color="blue" className="gap-1 !text-[10px]">
                            <EyeIcon className="size-3" />
                            Sample
                        </Badge>
                    ) : (
                        <Badge color="zinc" className="gap-1 !text-[10px]">
                            <EyeSlashIcon className="size-3" />
                            Hidden
                        </Badge>
                    )}
                </div>
                <pre className="mt-1 overflow-x-auto font-mono text-[11px] leading-relaxed text-slate-600 dark:text-slate-400">
                    {JSON.stringify(testCase.input.args)} → {testCase.expected_output}
                </pre>
                {testCase.explanation && (
                    <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">{testCase.explanation}</p>
                )}
            </div>
            <div className="flex shrink-0 gap-0.5">
                <Button type="button" plain onClick={onEdit} aria-label="Edit test case">
                    <PencilSquareIcon className="size-4" />
                </Button>
                <Button type="button" plain onClick={onDelete} aria-label="Delete test case">
                    <TrashIcon className="size-4" />
                </Button>
            </div>
        </div>
    );
}

export function ChallengeTestCaseManager({ challenge }: ChallengeTestCaseManagerProps) {
    const { confirm, ConfirmDialog } = useConfirmDialog();
    const [editingId, setEditingId] = useState<number | 'new' | null>(null);
    const testCases = challenge.test_cases ?? [];

    const remove = async (testCase: ChallengeTestCase) => {
        const confirmed = await confirm({
            title: 'Delete test case?',
            description: 'This cannot be undone.',
            confirmLabel: 'Delete',
            destructive: true,
        });

        if (confirmed) {
            router.delete(route('admin.challenge-test-cases.destroy', testCase.id));
        }
    };

    return (
        <div className={clsx('overflow-hidden', surfaces.card)}>
            <ConfirmDialog />

            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 px-4 py-3 dark:border-slate-800">
                <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">Test cases</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        {testCases.length} configured · sample cases shown on Run, hidden cases on Submit
                    </p>
                </div>
                <Button type="button" outline onClick={() => setEditingId('new')} className="!text-xs" disabled={editingId !== null}>
                    <PlusIcon data-slot="icon" className="!size-3.5" />
                    Add case
                </Button>
            </div>

            <div className="space-y-2 p-4">
                {editingId === 'new' && (
                    <TestCaseForm challengeId={challenge.id} onDone={() => setEditingId(null)} />
                )}

                {testCases.length === 0 && editingId !== 'new' ? (
                    <div className="rounded-lg border border-dashed border-slate-300 px-4 py-8 text-center dark:border-slate-700">
                        <BeakerIcon className="mx-auto size-7 text-slate-400" />
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">No test cases yet. Add at least one sample and one hidden case.</p>
                    </div>
                ) : (
                    testCases.map((testCase) =>
                        editingId === testCase.id ? (
                            <TestCaseForm
                                key={testCase.id}
                                challengeId={challenge.id}
                                testCase={testCase}
                                onDone={() => setEditingId(null)}
                            />
                        ) : (
                            <TestCaseRow
                                key={testCase.id}
                                testCase={testCase}
                                onEdit={() => setEditingId(testCase.id)}
                                onDelete={() => remove(testCase)}
                            />
                        ),
                    )
                )}
            </div>
        </div>
    );
}
