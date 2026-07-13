import { ChallengeTestCaseManager } from '@/components/admin/challenge-test-case-manager';
import { StepChecklist, StepSidebarCard, LevelStepShell } from '@/components/admin/level-editor/level-step-shell';
import { useConfirmDialog, type ConfirmOptions } from '@/components/confirm-dialog';
import { FormField } from '@/components/form/form-field';
import { CodeEditor } from '@/components/form/code-editor';
import { RichTextEditor } from '@/components/form/rich-text-editor';
import { Badge } from '@/components/catalyst/badge';
import { Button } from '@/components/catalyst/button';
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '@/components/catalyst/dialog';
import { Description, Label } from '@/components/catalyst/fieldset';
import { Input } from '@/components/catalyst/input';
import { Listbox, ListboxOption } from '@/components/catalyst/listbox';
import { Subheading } from '@/components/catalyst/heading';
import { Textarea } from '@/components/catalyst/textarea';
import { Switch, SwitchField } from '@/components/catalyst/switch';
import { useValidatedForm } from '@/hooks/use-validated-form';
import { monacoLanguage } from '@/lib/coding-challenge-library';
import { type ChallengeLanguage, type CodingChallenge, type Level } from '@/types/learning';
import {
    CheckCircleIcon,
    ClockIcon,
    CodeBracketIcon,
    CpuChipIcon,
    PencilSquareIcon,
    PlusIcon,
    ShieldCheckIcon,
    TrashIcon,
} from '@heroicons/react/20/solid';
import { router } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

const LANGUAGES = [
    { value: 'php', label: 'PHP' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
] as const;

const ENVIRONMENTS = [
    {
        value: 'laravel_inertia_react',
        label: 'Laravel + Inertia + React',
        description: 'Full-stack DevForge stack used at every level.',
    },
] as const;

interface ChallengeFormData {
    title: string;
    description: string;
    constraints: string;
    language: ChallengeLanguage;
    environment: 'laravel_inertia_react';
    workspace_mode: 'single_file' | 'project';
    template_key: string;
    entry_point: string;
    starter_code: string;
    time_limit_ms: number;
    memory_limit_mb: number;
    max_attempts: number;
    requires_mentor_review: boolean;
    is_active: boolean;
    sort_order: number;
}

function emptyForm(levelNumber: number, sortOrder: number): ChallengeFormData {
    return {
        title: `Level ${levelNumber} Challenge`,
        description: '',
        constraints: '',
        language: 'php',
        environment: 'laravel_inertia_react',
        workspace_mode: 'single_file',
        template_key: 'laravel-inertia-react-template',
        entry_point: 'solution',
        starter_code: '',
        time_limit_ms: 2000,
        memory_limit_mb: 128,
        max_attempts: 5,
        requires_mentor_review: false,
        is_active: true,
        sort_order: sortOrder,
    };
}

function formFromChallenge(challenge: CodingChallenge): ChallengeFormData {
    return {
        title: challenge.title,
        description: challenge.description,
        constraints: challenge.constraints ?? '',
        language: challenge.language,
        environment: challenge.environment ?? 'laravel_inertia_react',
        workspace_mode: challenge.workspace_mode ?? 'single_file',
        template_key: challenge.template_key ?? 'laravel-inertia-react-template',
        entry_point: challenge.entry_point,
        starter_code: challenge.starter_code,
        time_limit_ms: challenge.time_limit_ms,
        memory_limit_mb: challenge.memory_limit_mb,
        max_attempts: challenge.max_attempts,
        requires_mentor_review: challenge.requires_mentor_review,
        is_active: challenge.is_active,
        sort_order: challenge.sort_order,
    };
}

function descriptionPreview(description: string | null): string | null {
    if (!description) {
        return null;
    }

    const text = description
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    return text || null;
}

interface ChallengeTabProps {
    pathId: number;
    level: Level;
    onPrev?: () => void;
    curriculumHref: string;
}

function ChallengeCard({
    challenge,
    onEdit,
    onDelete,
}: {
    challenge: CodingChallenge;
    onEdit: () => void;
    onDelete: () => void;
}) {
    const testCaseCount = challenge.test_cases?.length ?? challenge.test_cases_count ?? 0;
    const sampleCount = challenge.test_cases?.filter((testCase) => testCase.is_sample).length ?? 0;
    const languageLabel = LANGUAGES.find((lang) => lang.value === challenge.language)?.label ?? challenge.language;
    const environmentLabel =
        challenge.environment_label ??
        ENVIRONMENTS.find((env) => env.value === challenge.environment)?.label ??
        'Laravel + Inertia + React';
    const preview = descriptionPreview(challenge.description);

    return (
        <article className="flex gap-4 rounded-lg border border-zinc-950/10 p-4 dark:border-white/10">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                <CodeBracketIcon className="size-5 text-zinc-500" />
            </div>
            <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-zinc-950 dark:text-white">{challenge.title}</p>
                    <Badge color="violet">{environmentLabel}</Badge>
                    <Badge color="zinc">{languageLabel}</Badge>
                    <Badge color="zinc">
                        {testCaseCount} test {testCaseCount === 1 ? 'case' : 'cases'}
                    </Badge>
                    {sampleCount > 0 && <Badge color="blue">{sampleCount} sample</Badge>}
                    {challenge.requires_mentor_review && (
                        <Badge color="amber" className="gap-1">
                            <ShieldCheckIcon className="size-3.5" />
                            Mentor review
                        </Badge>
                    )}
                    <Badge color={challenge.is_active ? 'lime' : 'zinc'}>{challenge.is_active ? 'Active' : 'Inactive'}</Badge>
                </div>
                {preview && <p className="mt-2 line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400">{preview}</p>}
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    Entry point: <code className="font-mono">{challenge.entry_point}()</code>
                </p>
            </div>
            <div className="flex shrink-0 gap-1">
                <Button type="button" plain onClick={onEdit} aria-label="Edit challenge">
                    <PencilSquareIcon className="size-4" />
                </Button>
                <Button type="button" plain onClick={onDelete} aria-label="Delete challenge">
                    <TrashIcon className="size-4" />
                </Button>
            </div>
        </article>
    );
}

export function ChallengeTab({ pathId, level, onPrev, curriculumHref }: ChallengeTabProps) {
    const { confirm, ConfirmDialog } = useConfirmDialog();
    const challenges = level.coding_challenges ?? [];
    const nextSortOrder = challenges.length + 1;
    const [dialogOpen, setDialogOpen] = useState(challenges.length === 0);
    const [editing, setEditing] = useState<CodingChallenge | null>(null);
    const configuredChallenges = challenges.filter((challenge) =>
        Boolean(challenge.description?.replace(/<[^>]+>/g, '').trim() && challenge.entry_point?.trim()),
    );
    const challengesWithTests = challenges.filter(
        (challenge) => (challenge.test_cases?.length ?? challenge.test_cases_count ?? 0) > 0,
    );

    const openCreate = () => {
        setEditing(null);
        setDialogOpen(true);
    };

    const openEdit = (challenge: CodingChallenge) => {
        setEditing(challenge);
        setDialogOpen(true);
    };

    const closeDialog = () => {
        setDialogOpen(false);
        setEditing(null);
    };

    const deleteChallenge = async (challenge: CodingChallenge) => {
        const confirmed = await confirm({
            title: 'Delete challenge?',
            description: `"${challenge.title}" and its test cases will be permanently removed from this level.`,
            confirmLabel: 'Delete',
            variant: 'danger',
        });

        if (confirmed) {
            router.delete(route('admin.challenges.destroy', challenge.id));
        }
    };

    return (
        <LevelStepShell
            step="challenge"
            onPrev={onPrev}
            sidebar={
                <>
                    <StepSidebarCard title="Workspace flow">
                        <p>
                            Interns solve each challenge in a split view—problem on the left, Monaco editor on the right. Run
                            checks sample cases; submit evaluates all cases including hidden ones.
                        </p>
                    </StepSidebarCard>
                    <StepSidebarCard title="Checklist">
                        <StepChecklist
                            items={[
                                { label: 'At least one challenge configured', done: configuredChallenges.length > 0 },
                                { label: 'Each challenge has test cases', done: challengesWithTests.length === challenges.length && challenges.length > 0 },
                            ]}
                        />
                    </StepSidebarCard>
                    <StepSidebarCard title="Learning environment" variant="tip">
                        Every challenge in this curriculum uses the Laravel + Inertia + React environment so interns practice
                        the same stack at every level. Language selects the runner (PHP/JS/Python) inside that environment.
                    </StepSidebarCard>
                    <StepSidebarCard title="Completion rule" variant="tip">
                        All active challenges must pass (including mentor review when enabled) alongside materials, videos, and
                        quiz to unlock the next level.
                    </StepSidebarCard>
                </>
            }
        >
            <ConfirmDialog />

            <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <Subheading level={3}>
                        {challenges.length} {challenges.length === 1 ? 'challenge' : 'challenges'}
                    </Subheading>
                    <Button type="button" onClick={openCreate}>
                        <PlusIcon data-slot="icon" />
                        Add challenge
                    </Button>
                </div>

                {challenges.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-zinc-300 p-8 text-center dark:border-zinc-600">
                        <CodeBracketIcon className="mx-auto size-8 text-zinc-400" />
                        <p className="mt-3 text-sm text-zinc-500">No coding challenges yet. Add your first problem to get started.</p>
                    </div>
                ) : (
                    <ul className="space-y-3">
                        {challenges.map((challenge) => (
                            <li key={challenge.id}>
                                <ChallengeCard
                                    challenge={challenge}
                                    onEdit={() => openEdit(challenge)}
                                    onDelete={() => deleteChallenge(challenge)}
                                />
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <ChallengeDialog
                key={editing?.id ?? 'new'}
                open={dialogOpen}
                onClose={closeDialog}
                pathId={pathId}
                levelId={level.id}
                levelNumber={level.number}
                challenge={editing}
                initialData={editing ? formFromChallenge(editing) : emptyForm(level.number, nextSortOrder)}
                confirm={confirm}
            />

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

interface ChallengeDialogProps {
    open: boolean;
    onClose: () => void;
    pathId: number;
    levelId: number;
    levelNumber: number;
    challenge: CodingChallenge | null;
    initialData: ChallengeFormData;
    confirm: (options: ConfirmOptions) => Promise<boolean>;
}

function ChallengeDialog({
    open,
    onClose,
    pathId,
    levelId,
    levelNumber,
    challenge,
    initialData,
    confirm,
}: ChallengeDialogProps) {
    const form = useValidatedForm(initialData);

    const submit: FormEventHandler = async (e) => {
        e.preventDefault();

        const confirmed = await confirm(
            challenge
                ? {
                      title: 'Save challenge changes?',
                      description: `"${form.data.title || challenge.title}" will be updated for this level.`,
                      confirmLabel: 'Save challenge',
                  }
                : {
                      title: 'Add challenge?',
                      description: `"${form.data.title || 'This challenge'}" will be added to the level curriculum.`,
                      confirmLabel: 'Add challenge',
                  },
        );

        if (!confirmed) {
            return;
        }

        const options = {
            onSuccess: onClose,
            successToast: challenge
                ? { title: 'Challenge saved', message: `"${form.data.title}" was updated.` }
                : { title: 'Challenge added', message: `"${form.data.title}" was added to this level.` },
        };

        if (challenge) {
            form.patch(route('admin.challenges.update', challenge.id), options);

            return;
        }

        form.post(route('admin.challenges.store', [pathId, levelId]), options);
    };

    return (
        <Dialog open={open} onClose={onClose} size="5xl">
            <DialogTitle>{challenge ? 'Edit challenge' : 'Add challenge'}</DialogTitle>
            <DialogDescription>
                Configure the problem statement, starter template, runtime limits, and grading flags for level {levelNumber}.
            </DialogDescription>
            <DialogBody className="max-h-[70vh] overflow-y-auto">
                <form id="challenge-form" onSubmit={submit} className="space-y-6">
                    <section className="space-y-3">
                        <p className="text-[11px] font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">Problem</p>
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
                            <FormField error={form.errors.environment}>
                                <Label>Environment</Label>
                                <Listbox
                                    value={form.data.environment}
                                    onChange={(value) => form.setData('environment', value)}
                                >
                                    {ENVIRONMENTS.map((option) => (
                                        <ListboxOption key={option.value} value={option.value}>
                                            {option.label}
                                        </ListboxOption>
                                    ))}
                                </Listbox>
                                <Description>
                                    {ENVIRONMENTS.find((env) => env.value === form.data.environment)?.description}
                                </Description>
                            </FormField>
                            <FormField error={form.errors.workspace_mode}>
                                <Label>Workspace</Label>
                                <Listbox
                                    value={form.data.workspace_mode}
                                    onChange={(value) => form.setData('workspace_mode', value)}
                                >
                                    <ListboxOption value="single_file">Single file</ListboxOption>
                                    <ListboxOption value="project">Project template</ListboxOption>
                                </Listbox>
                                <Description>
                                    Project mode loads the installed Laravel + Inertia + React starter kit for file navigation tasks.
                                </Description>
                            </FormField>
                            {form.data.workspace_mode === 'project' && (
                                <FormField error={form.errors.template_key} className="sm:col-span-2">
                                    <Label>Template</Label>
                                    <Input
                                        value={form.data.template_key}
                                        onChange={(e) => form.setData('template_key', e.target.value)}
                                        className="font-mono text-sm"
                                    />
                                </FormField>
                            )}
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
                                <Description>Problem statement shown to interns in the challenge workspace.</Description>
                                <RichTextEditor
                                    value={form.data.description}
                                    onChange={(html) => form.setData('description', html)}
                                    invalid={!!form.errors.description}
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

                    <section className="space-y-3">
                        <p className="text-[11px] font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
                            Starter template
                        </p>
                        <FormField error={form.errors.starter_code}>
                            <Label>Starter code</Label>
                            <Description>Pre-filled in the intern editor before they begin.</Description>
                            <CodeEditor
                                value={form.data.starter_code}
                                onChange={(code) => form.setData('starter_code', code)}
                                language={monacoLanguage(form.data.language)}
                                invalid={!!form.errors.starter_code}
                                height={280}
                            />
                        </FormField>
                    </section>

                    <section className="space-y-3">
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
                            <div className="rounded-lg border border-slate-200/80 p-3 dark:border-slate-800">
                                <SwitchField>
                                    <Label>Mentor review</Label>
                                    <Description>Require mentor approval after all tests pass.</Description>
                                    <Switch
                                        checked={form.data.requires_mentor_review}
                                        onChange={(checked) => form.setData('requires_mentor_review', checked)}
                                    />
                                </SwitchField>
                            </div>
                            <div className="rounded-lg border border-slate-200/80 p-3 dark:border-slate-800">
                                <SwitchField>
                                    <Label>Active</Label>
                                    <Description>Inactive challenges are excluded from progression.</Description>
                                    <Switch checked={form.data.is_active} onChange={(checked) => form.setData('is_active', checked)} />
                                </SwitchField>
                            </div>
                        </div>
                    </section>
                </form>

                {challenge ? (
                    <div className="mt-6 border-t border-slate-200/80 pt-6 dark:border-slate-800">
                        <ChallengeTestCaseManager challenge={challenge} />
                    </div>
                ) : (
                    <div className="mt-6 rounded-lg border border-dashed border-slate-300 p-6 text-center dark:border-slate-700">
                        <CodeBracketIcon className="mx-auto size-7 text-slate-400" />
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Save the challenge first to add test cases.</p>
                    </div>
                )}
            </DialogBody>
            <DialogActions>
                <Button plain onClick={onClose}>
                    Cancel
                </Button>
                <Button type="submit" form="challenge-form" disabled={form.processing}>
                    {challenge ? 'Save challenge' : 'Add challenge'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
