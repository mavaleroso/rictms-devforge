import { FormField } from '@/components/form/form-field';
import { StepChecklist, StepSidebarCard, LevelStepShell } from '@/components/admin/level-editor/level-step-shell';
import { useConfirmDialog } from '@/components/confirm-dialog';
import { Button } from '@/components/catalyst/button';
import { Description, Label } from '@/components/catalyst/fieldset';
import { Input } from '@/components/catalyst/input';
import { Listbox, ListboxOption } from '@/components/catalyst/listbox';
import { Textarea } from '@/components/catalyst/textarea';
import { formatDuration } from '@/lib/path-icons';
import { type Level } from '@/types/learning';
import { useValidatedForm } from '@/hooks/use-validated-form';
import { FormEventHandler } from 'react';

const DIFFICULTY_OPTIONS = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
] as const;

interface OverviewTabProps {
    pathId: number;
    level: Level;
    onPrev?: () => void;
    onNext?: () => void;
}

export function OverviewTab({ pathId, level, onPrev, onNext }: OverviewTabProps) {
    const { confirm, ConfirmDialog } = useConfirmDialog();
    const form = useValidatedForm({
        title: level.title,
        overview: level.overview ?? '',
        objectives: level.objectives ?? '',
        expected_outcome: level.expected_outcome ?? '',
        estimated_minutes: level.estimated_minutes,
        difficulty: level.difficulty,
    });

    const submit: FormEventHandler = async (e) => {
        e.preventDefault();

        const confirmed = await confirm({
            title: 'Save level overview?',
            description: 'Updates to title, goals, and settings will be visible to interns on this level.',
            confirmLabel: 'Save overview',
        });

        if (confirmed) {
            form.patch(route('admin.levels.update', [pathId, level.id]), {
                successToast: { title: 'Overview saved', message: 'Level details have been updated.' },
            });
        }
    };

    const saveAndContinue: FormEventHandler = async (e) => {
        e.preventDefault();

        const confirmed = await confirm({
            title: 'Save and continue?',
            description: 'Level overview will be saved before moving to materials.',
            confirmLabel: 'Save & continue',
        });

        if (confirmed) {
            form.patch(route('admin.levels.update', [pathId, level.id]), {
                onSuccess: () => onNext?.(),
                successToast: { title: 'Overview saved', message: 'Continuing to materials.' },
            });
        }
    };

    return (
        <LevelStepShell
            step="overview"
            onPrev={onPrev}
            onNext={onNext}
            nextLabel="Continue to materials"
            sidebar={
                <>
                    <StepSidebarCard title="Intern preview">
                        <p className="font-semibold text-zinc-950 dark:text-white">{form.data.title || 'Untitled level'}</p>
                        <p className="mt-2 line-clamp-4 text-zinc-500 dark:text-zinc-400">
                            {form.data.overview || 'Overview text appears on the level intro screen.'}
                        </p>
                        <p className="mt-3 text-xs text-zinc-400">
                            {formatDuration(form.data.estimated_minutes)} · {form.data.difficulty}
                        </p>
                    </StepSidebarCard>
                    <StepSidebarCard title="Checklist">
                        <StepChecklist
                            items={[
                                { label: 'Title is clear and specific', done: Boolean(form.data.title.trim()) },
                                { label: 'Overview explains what interns will do', done: Boolean(form.data.overview.trim()) },
                                { label: 'Objectives list measurable goals', done: Boolean(form.data.objectives.trim()) },
                                { label: 'Expected outcome is defined', done: Boolean(form.data.expected_outcome.trim()) },
                            ]}
                        />
                    </StepSidebarCard>
                    <StepSidebarCard title="Tip" variant="tip">
                        Use bullet points in objectives (one per line). Interns see this before unlocking materials.
                    </StepSidebarCard>
                </>
            }
        >
            <ConfirmDialog />
            <form onSubmit={submit} className="space-y-8">
                <div className="space-y-4">
                    <p className="text-xs font-semibold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">Identity</p>
                    <FormField error={form.errors.title}>
                        <Label>Level title</Label>
                        <Description>Shown in the curriculum list and level header.</Description>
                        <Input value={form.data.title} onChange={(e) => form.setData('title', e.target.value)} />
                    </FormField>
                </div>

                <div className="space-y-4 border-t border-zinc-950/5 pt-8 dark:border-white/5">
                    <p className="text-xs font-semibold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">Learning goals</p>
                    <FormField error={form.errors.overview}>
                        <Label>Overview</Label>
                        <Description>Short summary of what this level covers.</Description>
                        <Textarea value={form.data.overview} onChange={(e) => form.setData('overview', e.target.value)} rows={4} />
                    </FormField>
                    <FormField error={form.errors.objectives}>
                        <Label>Objectives</Label>
                        <Description>What interns should be able to do after completing this level.</Description>
                        <Textarea value={form.data.objectives} onChange={(e) => form.setData('objectives', e.target.value)} rows={4} />
                    </FormField>
                    <FormField error={form.errors.expected_outcome}>
                        <Label>Expected outcome</Label>
                        <Description>One sentence describing success for this level.</Description>
                        <Textarea
                            value={form.data.expected_outcome}
                            onChange={(e) => form.setData('expected_outcome', e.target.value)}
                            rows={2}
                        />
                    </FormField>
                </div>

                <div className="grid gap-4 border-t border-zinc-950/5 pt-8 sm:grid-cols-2 dark:border-white/5">
                    <p className="text-xs font-semibold tracking-wide text-zinc-500 uppercase sm:col-span-2 dark:text-zinc-400">Settings</p>
                    <FormField error={form.errors.estimated_minutes}>
                        <Label>Estimated minutes</Label>
                        <Input
                            type="number"
                            min={15}
                            value={form.data.estimated_minutes}
                            onChange={(e) => form.setData('estimated_minutes', Number(e.target.value))}
                        />
                    </FormField>
                    <FormField error={form.errors.difficulty}>
                        <Label>Difficulty</Label>
                        <Listbox value={form.data.difficulty} onChange={(value) => form.setData('difficulty', value)}>
                            {DIFFICULTY_OPTIONS.map((option) => (
                                <ListboxOption key={option.value} value={option.value}>
                                    {option.label}
                                </ListboxOption>
                            ))}
                        </Listbox>
                    </FormField>
                </div>

                <div className="flex flex-wrap gap-3 border-t border-zinc-950/5 pt-6 dark:border-white/5">
                    <Button type="submit" disabled={form.processing}>
                        Save overview
                    </Button>
                    {onNext && (
                        <Button type="button" outline disabled={form.processing} onClick={saveAndContinue}>
                            Save &amp; continue to materials
                        </Button>
                    )}
                </div>
            </form>
        </LevelStepShell>
    );
}
