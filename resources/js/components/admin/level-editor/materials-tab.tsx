import { FormField } from '@/components/form/form-field';
import { StepChecklist, StepSidebarCard, LevelStepShell } from '@/components/admin/level-editor/level-step-shell';
import { useConfirmDialog } from '@/components/confirm-dialog';
import { Badge } from '@/components/catalyst/badge';
import { Button } from '@/components/catalyst/button';
import { Description, Label } from '@/components/catalyst/fieldset';
import { Input } from '@/components/catalyst/input';
import { Listbox, ListboxOption } from '@/components/catalyst/listbox';
import { Subheading } from '@/components/catalyst/heading';
import { Textarea } from '@/components/catalyst/textarea';
import { type LearningMaterial, type Level } from '@/types/learning';
import { useValidatedForm } from '@/hooks/use-validated-form';
import { BookOpenIcon, PlusIcon, TrashIcon } from '@heroicons/react/20/solid';
import { router } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

const MATERIAL_TYPES = [
    { value: 'markdown', label: 'Markdown', hint: 'Formatted lessons with headings and code blocks' },
    { value: 'standard', label: 'Standard', hint: 'Plain text or simple reference content' },
    { value: 'snippet', label: 'Snippet', hint: 'Short code or command examples' },
    { value: 'pdf', label: 'PDF', hint: 'Uploaded document reference (content field for notes)' },
] as const;

interface MaterialsTabProps {
    pathId: number;
    level: Level;
    onPrev?: () => void;
    onNext?: () => void;
}

function MaterialCard({ material, onDelete }: { material: LearningMaterial; onDelete: () => void }) {
    return (
        <article className="flex gap-4 rounded-lg border border-zinc-950/10 p-4 dark:border-white/10">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                <BookOpenIcon className="size-5 text-zinc-500" />
            </div>
            <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-zinc-950 dark:text-white">{material.title}</p>
                    <Badge>{material.type}</Badge>
                </div>
                {material.content && (
                    <p className="mt-2 line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400">{material.content}</p>
                )}
            </div>
            <Button type="button" plain onClick={onDelete} aria-label="Delete material">
                <TrashIcon className="size-4" />
            </Button>
        </article>
    );
}

export function MaterialsTab({ pathId, level, onPrev, onNext }: MaterialsTabProps) {
    const { confirm, ConfirmDialog } = useConfirmDialog();
    const materials = level.materials ?? [];
    const [showForm, setShowForm] = useState(materials.length === 0);

    const form = useValidatedForm({
        type: 'markdown' as const,
        title: '',
        content: '',
        sort_order: materials.length + 1,
    });

    const addMaterial: FormEventHandler = async (e) => {
        e.preventDefault();

        const confirmed = await confirm({
            title: 'Add material?',
            description: `"${form.data.title || 'This material'}" will be added to the level curriculum.`,
            confirmLabel: 'Add material',
        });

        if (!confirmed) {
            return;
        }

        form.post(route('admin.materials.store', [pathId, level.id]), {
            onSuccess: () => {
                form.reset('title', 'content');
                setShowForm(false);
            },
            successToast: { title: 'Material added', message: `"${form.data.title}" was added to this level.` },
        });
    };

    const deleteMaterial = async (material: LearningMaterial) => {
        const confirmed = await confirm({
            title: 'Delete material?',
            description: `"${material.title}" will be permanently removed from this level.`,
            confirmLabel: 'Delete',
            variant: 'danger',
        });

        if (confirmed) {
            router.delete(route('admin.materials.destroy', material.id));
        }
    };

    const selectedType = MATERIAL_TYPES.find((t) => t.value === form.data.type);

    return (
        <LevelStepShell
            step="materials"
            onPrev={onPrev}
            onNext={onNext}
            nextLabel="Continue to videos"
            sidebar={
                <>
                    <StepSidebarCard title="Recommended order">
                        <ol className="list-decimal space-y-1 pl-4">
                            <li>Concept lesson (Markdown)</li>
                            <li>Company standards or checklist</li>
                            <li>Optional code snippet</li>
                        </ol>
                    </StepSidebarCard>
                    <StepSidebarCard title="Checklist">
                        <StepChecklist items={[{ label: 'At least one material added', done: materials.length > 0 }]} />
                    </StepSidebarCard>
                    <StepSidebarCard title="Markdown tip" variant="tip">
                        Use <code className="rounded bg-zinc-200 px-1 dark:bg-zinc-700"># Heading</code> and fenced code blocks for readable lessons.
                    </StepSidebarCard>
                </>
            }
        >
            <ConfirmDialog />
            <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <Subheading level={3}>
                        {materials.length} {materials.length === 1 ? 'material' : 'materials'}
                    </Subheading>
                    <Button type="button" outline onClick={() => setShowForm((value) => !value)}>
                        <PlusIcon data-slot="icon" />
                        {showForm ? 'Hide form' : 'Add material'}
                    </Button>
                </div>

                {materials.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-zinc-300 p-8 text-center dark:border-zinc-600">
                        <BookOpenIcon className="mx-auto size-8 text-zinc-400" />
                        <p className="mt-3 text-sm text-zinc-500">No materials yet. Add your first lesson below.</p>
                    </div>
                ) : (
                    <ul className="space-y-3">
                        {materials.map((material) => (
                            <li key={material.id}>
                                <MaterialCard material={material} onDelete={() => deleteMaterial(material)} />
                            </li>
                        ))}
                    </ul>
                )}

                {showForm && (
                    <form
                        onSubmit={addMaterial}
                        className="space-y-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-5 dark:border-white/10 dark:bg-zinc-800/40"
                    >
                        <Subheading level={3}>New material</Subheading>
                        <FormField error={form.errors.type}>
                            <Label>Content type</Label>
                            <Listbox value={form.data.type} onChange={(value) => form.setData('type', value)}>
                                {MATERIAL_TYPES.map((option) => (
                                    <ListboxOption key={option.value} value={option.value}>
                                        {option.label}
                                    </ListboxOption>
                                ))}
                            </Listbox>
                            {selectedType && <Description className="mt-2">{selectedType.hint}</Description>}
                        </FormField>
                        <FormField error={form.errors.title}>
                            <Label>Title</Label>
                            <Input value={form.data.title} onChange={(e) => form.setData('title', e.target.value)} placeholder="e.g. Introduction to Eloquent" />
                        </FormField>
                        <FormField error={form.errors.content}>
                            <Label>Content</Label>
                            <Textarea value={form.data.content} onChange={(e) => form.setData('content', e.target.value)} rows={8} placeholder="# Lesson title&#10;&#10;Write your lesson here…" />
                        </FormField>
                        <div className="flex gap-3">
                            <Button type="submit" disabled={form.processing}>
                                Add material
                            </Button>
                            {materials.length > 0 && (
                                <Button type="button" plain onClick={() => setShowForm(false)}>
                                    Cancel
                                </Button>
                            )}
                        </div>
                    </form>
                )}
            </div>
        </LevelStepShell>
    );
}
