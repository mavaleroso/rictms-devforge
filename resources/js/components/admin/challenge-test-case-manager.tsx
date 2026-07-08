import { useConfirmDialog } from '@/components/confirm-dialog';
import { FormField } from '@/components/form/form-field';
import { Badge } from '@/components/catalyst/badge';
import { Button } from '@/components/catalyst/button';
import { Input } from '@/components/catalyst/input';
import { Textarea } from '@/components/catalyst/textarea';
import { Switch, SwitchField } from '@/components/catalyst/switch';
import { Label } from '@/components/catalyst/fieldset';
import { Subheading } from '@/components/catalyst/heading';
import { useValidatedForm } from '@/hooks/use-validated-form';
import { type ChallengeTestCase, type CodingChallenge } from '@/types/learning';
import { PlusIcon, TrashIcon } from '@heroicons/react/20/solid';
import { router } from '@inertiajs/react';
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
        <form onSubmit={submit} className="space-y-3 rounded-lg border border-zinc-950/10 bg-zinc-50 p-4 dark:border-white/10 dark:bg-zinc-800/40">
            <div className="grid gap-3 sm:grid-cols-2">
                <FormField label="Label" error={form.errors.label}>
                    <Input value={form.data.label} onChange={(e) => form.setData('label', e.target.value)} placeholder="Example 1" />
                </FormField>
                <SwitchField>
                    <Label>Sample (visible to intern)</Label>
                    <Switch checked={form.data.is_sample} onChange={(checked) => form.setData('is_sample', checked)} />
                </SwitchField>
            </div>
            <FormField label="Input args (JSON array)" error={form.errors.input_args}>
                <Textarea
                    rows={3}
                    value={form.data.input_args}
                    onChange={(e) => form.setData('input_args', e.target.value)}
                    className="font-mono text-xs"
                    placeholder='[[2,7,11,15], 9]'
                />
            </FormField>
            <FormField label="Expected output" error={form.errors.expected_output}>
                <Input value={form.data.expected_output} onChange={(e) => form.setData('expected_output', e.target.value)} className="font-mono text-xs" />
            </FormField>
            <FormField label="Explanation" error={form.errors.explanation}>
                <Input value={form.data.explanation} onChange={(e) => form.setData('explanation', e.target.value)} />
            </FormField>
            <div className="flex gap-2">
                <Button type="submit" disabled={form.processing}>
                    {testCase ? 'Update' : 'Add'} test case
                </Button>
                <Button type="button" plain onClick={onDone}>
                    Cancel
                </Button>
            </div>
        </form>
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
        <div className="space-y-4">
            <ConfirmDialog />
            <div className="flex items-center justify-between gap-3">
                <Subheading>Test cases ({testCases.length})</Subheading>
                <Button type="button" outline onClick={() => setEditingId('new')}>
                    <PlusIcon data-slot="icon" />
                    Add case
                </Button>
            </div>

            {editingId === 'new' && (
                <TestCaseForm challengeId={challenge.id} onDone={() => setEditingId(null)} />
            )}

            <div className="space-y-2">
                {testCases.map((testCase) =>
                    editingId === testCase.id ? (
                        <TestCaseForm key={testCase.id} challengeId={challenge.id} testCase={testCase} onDone={() => setEditingId(null)} />
                    ) : (
                        <div
                            key={testCase.id}
                            className="flex items-start justify-between gap-3 rounded-lg border border-zinc-950/10 bg-white px-4 py-3 dark:border-white/10 dark:bg-zinc-900"
                        >
                            <div className="min-w-0 text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-zinc-950 dark:text-white">
                                        {testCase.label ?? `Case ${testCase.sort_order}`}
                                    </span>
                                    {testCase.is_sample && <Badge color="blue">Sample</Badge>}
                                </div>
                                <pre className="mt-1 overflow-x-auto font-mono text-xs text-zinc-600 dark:text-zinc-400">
                                    args: {JSON.stringify(testCase.input.args)} → {testCase.expected_output}
                                </pre>
                            </div>
                            <div className="flex shrink-0 gap-1">
                                <Button type="button" plain onClick={() => setEditingId(testCase.id)}>
                                    Edit
                                </Button>
                                <Button type="button" plain onClick={() => remove(testCase)}>
                                    <TrashIcon data-slot="icon" />
                                </Button>
                            </div>
                        </div>
                    ),
                )}
            </div>
        </div>
    );
}
