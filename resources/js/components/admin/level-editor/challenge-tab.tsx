import { ChallengeTestCaseManager } from '@/components/admin/challenge-test-case-manager';
import { StepChecklist, StepSidebarCard, LevelStepShell } from '@/components/admin/level-editor/level-step-shell';
import { useConfirmDialog } from '@/components/confirm-dialog';
import { FormField } from '@/components/form/form-field';
import { Button } from '@/components/catalyst/button';
import { Description, Label } from '@/components/catalyst/fieldset';
import { Input } from '@/components/catalyst/input';
import { Textarea } from '@/components/catalyst/textarea';
import { Switch, SwitchField } from '@/components/catalyst/switch';
import { Subheading } from '@/components/catalyst/heading';
import { type Level } from '@/types/learning';
import { useValidatedForm } from '@/hooks/use-validated-form';
import { FormEventHandler } from 'react';

interface ChallengeTabProps {
    pathId: number;
    level: Level;
    onPrev?: () => void;
    curriculumHref: string;
}

export function ChallengeTab({ pathId, level, onPrev, curriculumHref }: ChallengeTabProps) {
    const { confirm, ConfirmDialog } = useConfirmDialog();
    const challenge = level.coding_challenge;
    const testCaseCount = challenge?.test_cases?.length ?? challenge?.test_cases_count ?? 0;

    const form = useValidatedForm({
        title: challenge?.title ?? `Level ${level.number} Challenge`,
        description: challenge?.description ?? '',
        constraints: challenge?.constraints ?? '',
        language: challenge?.language ?? 'php',
        entry_point: challenge?.entry_point ?? 'solution',
        starter_code: challenge?.starter_code ?? '',
        time_limit_ms: challenge?.time_limit_ms ?? 2000,
        memory_limit_mb: challenge?.memory_limit_mb ?? 128,
        max_attempts: challenge?.max_attempts ?? 5,
        requires_mentor_review: challenge?.requires_mentor_review ?? false,
        is_active: challenge?.is_active ?? true,
    });

    const saveSettings: FormEventHandler = async (e) => {
        e.preventDefault();

        const confirmed = await confirm({
            title: 'Save challenge settings?',
            description: 'Problem statement, limits, and grading rules will apply to intern submissions.',
            confirmLabel: 'Save challenge',
        });

        if (confirmed) {
            form.patch(route('admin.challenge.update', [pathId, level.id]), {
                successToast: { title: 'Challenge saved', message: 'Coding challenge settings updated.' },
            });
        }
    };

    return (
        <LevelStepShell
            step="challenge"
            onPrev={onPrev}
            sidebar={
                <>
                    <StepSidebarCard title="LeetCode-style flow">
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            Interns solve problems in a split workspace: description on the left, Monaco editor on the right.
                            Sample tests run locally; submit runs all cases including hidden ones.
                        </p>
                    </StepSidebarCard>
                    <StepSidebarCard title="Checklist">
                        <StepChecklist
                            items={[
                                { label: 'Problem statement configured', done: Boolean(form.data.description?.trim()) },
                                { label: 'Entry point function set', done: Boolean(form.data.entry_point?.trim()) },
                                { label: 'At least one test case', done: testCaseCount > 0 },
                            ]}
                        />
                    </StepSidebarCard>
                    <StepSidebarCard title="Completion rule" variant="tip">
                        Interns must pass all test cases (and mentor review if enabled) along with materials, videos, and quiz to unlock the next level.
                    </StepSidebarCard>
                </>
            }
        >
            <ConfirmDialog />

            <form onSubmit={saveSettings} className="space-y-6">
                <div className="rounded-xl border border-zinc-950/10 bg-white p-5 dark:border-white/10 dark:bg-zinc-900">
                    <Subheading>Problem</Subheading>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        <FormField label="Title" error={form.errors.title} className="sm:col-span-2">
                            <Input value={form.data.title} onChange={(e) => form.setData('title', e.target.value)} />
                        </FormField>
                        <FormField label="Entry point function" error={form.errors.entry_point}>
                            <Input value={form.data.entry_point} onChange={(e) => form.setData('entry_point', e.target.value)} />
                        </FormField>
                        <FormField label="Language" error={form.errors.language}>
                            <select
                                value={form.data.language}
                                onChange={(e) => form.setData('language', e.target.value)}
                                className="w-full rounded-lg border border-zinc-950/10 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-zinc-950"
                            >
                                <option value="php">PHP</option>
                                <option value="javascript">JavaScript</option>
                                <option value="python">Python</option>
                            </select>
                        </FormField>
                        <FormField label="Description" error={form.errors.description} className="sm:col-span-2">
                            <Textarea
                                rows={6}
                                value={form.data.description}
                                onChange={(e) => form.setData('description', e.target.value)}
                                placeholder="Describe the problem like a LeetCode statement…"
                            />
                        </FormField>
                        <FormField label="Constraints" error={form.errors.constraints} className="sm:col-span-2">
                            <Textarea
                                rows={3}
                                value={form.data.constraints}
                                onChange={(e) => form.setData('constraints', e.target.value)}
                                placeholder="1 <= n <= 10^4"
                            />
                        </FormField>
                        <FormField label="Starter code" error={form.errors.starter_code} className="sm:col-span-2">
                            <Textarea
                                rows={8}
                                value={form.data.starter_code}
                                onChange={(e) => form.setData('starter_code', e.target.value)}
                                className="font-mono text-xs"
                            />
                        </FormField>
                    </div>
                </div>

                <div className="rounded-xl border border-zinc-950/10 bg-white p-5 dark:border-white/10 dark:bg-zinc-900">
                    <Subheading>Rules</Subheading>
                    <div className="mt-4 grid gap-4 sm:grid-cols-3">
                        <FormField label="Time limit (ms)" error={form.errors.time_limit_ms}>
                            <Input type="number" value={form.data.time_limit_ms} onChange={(e) => form.setData('time_limit_ms', Number(e.target.value))} />
                        </FormField>
                        <FormField label="Memory (MB)" error={form.errors.memory_limit_mb}>
                            <Input type="number" value={form.data.memory_limit_mb} onChange={(e) => form.setData('memory_limit_mb', Number(e.target.value))} />
                        </FormField>
                        <FormField label="Max attempts" error={form.errors.max_attempts}>
                            <Input type="number" value={form.data.max_attempts} onChange={(e) => form.setData('max_attempts', Number(e.target.value))} />
                        </FormField>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-6">
                        <SwitchField>
                            <Label>Requires mentor review</Label>
                            <Description>All tests must pass, then a mentor approves before counting as complete.</Description>
                            <Switch
                                checked={form.data.requires_mentor_review}
                                onChange={(checked) => form.setData('requires_mentor_review', checked)}
                            />
                        </SwitchField>
                        <SwitchField>
                            <Label>Active</Label>
                            <Description>Inactive challenges are ignored in progress checks.</Description>
                            <Switch checked={form.data.is_active} onChange={(checked) => form.setData('is_active', checked)} />
                        </SwitchField>
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button type="submit" disabled={form.processing}>
                        Save challenge
                    </Button>
                </div>
            </form>

            {challenge && (
                <div className="mt-8">
                    <ChallengeTestCaseManager challenge={challenge} />
                </div>
            )}

            <div className="mt-8 flex justify-between">
                {onPrev && (
                    <Button type="button" plain onClick={onPrev}>
                        Previous
                    </Button>
                )}
                <Button href={curriculumHref} outline>
                    Back to curriculum
                </Button>
            </div>
        </LevelStepShell>
    );
}
