import { ChallengeTestCaseManager } from '@/components/admin/challenge-test-case-manager';
import { StepChecklist, StepSidebarCard, LevelStepShell } from '@/components/admin/level-editor/level-step-shell';
import { useConfirmDialog } from '@/components/confirm-dialog';
import { FormField } from '@/components/form/form-field';
import { Badge } from '@/components/catalyst/badge';
import { Button } from '@/components/catalyst/button';
import { Description, Label } from '@/components/catalyst/fieldset';
import { Input } from '@/components/catalyst/input';
import { Listbox, ListboxOption } from '@/components/catalyst/listbox';
import { Textarea } from '@/components/catalyst/textarea';
import { Switch, SwitchField } from '@/components/catalyst/switch';
import { accent, surfaces } from '@/lib/theme';
import { type Level } from '@/types/learning';
import { useValidatedForm } from '@/hooks/use-validated-form';
import {
    CheckCircleIcon,
    ClockIcon,
    CodeBracketIcon,
    CpuChipIcon,
    ShieldCheckIcon,
} from '@heroicons/react/20/solid';
import clsx from 'clsx';
import { FormEventHandler } from 'react';

const LANGUAGES = [
    { value: 'php', label: 'PHP' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
] as const;

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
    const sampleCount = challenge?.test_cases?.filter((testCase) => testCase.is_sample).length ?? 0;

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

    const languageLabel = LANGUAGES.find((lang) => lang.value === form.data.language)?.label ?? form.data.language;

    return (
        <LevelStepShell
            step="challenge"
            onPrev={onPrev}
            sidebar={
                <>
                    <StepSidebarCard title="Workspace flow">
                        <p>
                            Interns solve in a split view—problem on the left, Monaco editor on the right. Run checks sample
                            cases; submit evaluates all cases including hidden ones.
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
                        Passing all tests (and mentor review when enabled) is required alongside materials, videos, and quiz
                        to unlock the next level.
                    </StepSidebarCard>
                </>
            }
        >
            <ConfirmDialog />

            <div className="mb-4 flex flex-wrap items-center gap-2">
                <Badge color="zinc" className={clsx('gap-1', accent.bgSoft, accent.textSoft)}>
                    <CodeBracketIcon className="size-3.5" />
                    {languageLabel}
                </Badge>
                <Badge color="zinc">
                    {testCaseCount} test {testCaseCount === 1 ? 'case' : 'cases'}
                </Badge>
                {sampleCount > 0 && <Badge color="blue">{sampleCount} sample</Badge>}
                {form.data.requires_mentor_review && (
                    <Badge color="amber" className="gap-1">
                        <ShieldCheckIcon className="size-3.5" />
                        Mentor review
                    </Badge>
                )}
                <Badge color={form.data.is_active ? 'lime' : 'zinc'}>{form.data.is_active ? 'Active' : 'Inactive'}</Badge>
            </div>

            <form onSubmit={saveSettings} className={clsx('overflow-hidden', surfaces.card)}>
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 px-4 py-3 dark:border-slate-800">
                    <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">Challenge configuration</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Problem statement, runtime limits, and grading flags</p>
                    </div>
                    <Button type="submit" color="dark/zinc" disabled={form.processing} className="!text-xs">
                        Save settings
                    </Button>
                </div>

                <div className="divide-y divide-slate-200/80 dark:divide-slate-800">
                    <section className="space-y-3 p-4">
                        <p className="text-[11px] font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
                            Problem
                        </p>
                        <div className="grid gap-3 sm:grid-cols-2">
                            <FormField error={form.errors.title} className="sm:col-span-2">
                                <Label>Title</Label>
                                <Input value={form.data.title} onChange={(e) => form.setData('title', e.target.value)} />
                            </FormField>
                            <FormField error={form.errors.entry_point}>
                                <Label>Entry point</Label>
                                <Input
                                    value={form.data.entry_point}
                                    onChange={(e) => form.setData('entry_point', e.target.value)}
                                    placeholder="solution"
                                    className="font-mono text-sm"
                                />
                            </FormField>
                            <FormField error={form.errors.language}>
                                <Label>Language</Label>
                                <Listbox value={form.data.language} onChange={(value) => form.setData('language', value)}>
                                    {LANGUAGES.map((option) => (
                                        <ListboxOption key={option.value} value={option.value}>
                                            {option.label}
                                        </ListboxOption>
                                    ))}
                                </Listbox>
                            </FormField>
                            <FormField error={form.errors.description} className="sm:col-span-2">
                                <Label>Description</Label>
                                <Textarea
                                    rows={5}
                                    value={form.data.description}
                                    onChange={(e) => form.setData('description', e.target.value)}
                                    placeholder="Describe inputs, output, and approach expectations…"
                                />
                            </FormField>
                            <FormField error={form.errors.constraints} className="sm:col-span-2">
                                <Label>Constraints</Label>
                                <Textarea
                                    rows={2}
                                    value={form.data.constraints}
                                    onChange={(e) => form.setData('constraints', e.target.value)}
                                    placeholder="1 <= n <= 10^4"
                                    className="font-mono text-xs"
                                />
                            </FormField>
                        </div>
                    </section>

                    <section className="space-y-3 p-4">
                        <p className="text-[11px] font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
                            Starter template
                        </p>
                        <FormField error={form.errors.starter_code}>
                            <Label>Starter code</Label>
                            <Description>Pre-filled in the intern editor before they begin.</Description>
                            <Textarea
                                rows={6}
                                value={form.data.starter_code}
                                onChange={(e) => form.setData('starter_code', e.target.value)}
                                className="font-mono text-xs leading-5"
                            />
                        </FormField>
                    </section>

                    <section className="space-y-3 p-4">
                        <p className="text-[11px] font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
                            Runtime & attempts
                        </p>
                        <div className="grid gap-3 sm:grid-cols-3">
                            <FormField error={form.errors.time_limit_ms}>
                                <Label className="inline-flex items-center gap-1.5">
                                    <ClockIcon className="size-3.5 text-slate-400" />
                                    Time limit (ms)
                                </Label>
                                <Input
                                    type="number"
                                    value={form.data.time_limit_ms}
                                    onChange={(e) => form.setData('time_limit_ms', Number(e.target.value))}
                                />
                            </FormField>
                            <FormField error={form.errors.memory_limit_mb}>
                                <Label className="inline-flex items-center gap-1.5">
                                    <CpuChipIcon className="size-3.5 text-slate-400" />
                                    Memory (MB)
                                </Label>
                                <Input
                                    type="number"
                                    value={form.data.memory_limit_mb}
                                    onChange={(e) => form.setData('memory_limit_mb', Number(e.target.value))}
                                />
                            </FormField>
                            <FormField error={form.errors.max_attempts}>
                                <Label>Max attempts</Label>
                                <Input
                                    type="number"
                                    value={form.data.max_attempts}
                                    onChange={(e) => form.setData('max_attempts', Number(e.target.value))}
                                />
                            </FormField>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                            <div className={clsx('rounded-lg border border-slate-200/80 p-3 dark:border-slate-800', surfaces.cardMuted)}>
                                <SwitchField>
                                    <Label>Mentor review</Label>
                                    <Description>Require mentor approval after all tests pass.</Description>
                                    <Switch
                                        checked={form.data.requires_mentor_review}
                                        onChange={(checked) => form.setData('requires_mentor_review', checked)}
                                    />
                                </SwitchField>
                            </div>
                            <div className={clsx('rounded-lg border border-slate-200/80 p-3 dark:border-slate-800', surfaces.cardMuted)}>
                                <SwitchField>
                                    <Label>Active</Label>
                                    <Description>Inactive challenges are excluded from progression.</Description>
                                    <Switch checked={form.data.is_active} onChange={(checked) => form.setData('is_active', checked)} />
                                </SwitchField>
                            </div>
                        </div>
                    </section>
                </div>
            </form>

            {challenge ? (
                <div className="mt-4">
                    <ChallengeTestCaseManager challenge={challenge} />
                </div>
            ) : (
                <div className={clsx('mt-4 rounded-lg border border-dashed border-slate-300 p-6 text-center dark:border-slate-700', surfaces.cardMuted)}>
                    <CodeBracketIcon className="mx-auto size-7 text-slate-400" />
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Save challenge settings to add test cases.</p>
                </div>
            )}

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200/80 pt-4 dark:border-slate-800">
                {onPrev ? (
                    <Button type="button" plain onClick={onPrev} className="!text-sm">
                        Previous step
                    </Button>
                ) : (
                    <span />
                )}
                <Button href={curriculumHref} outline className="!text-sm">
                    <CheckCircleIcon data-slot="icon" className="!size-4" />
                    Back to curriculum
                </Button>
            </div>
        </LevelStepShell>
    );
}
