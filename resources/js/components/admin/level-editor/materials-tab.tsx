import { FormField } from '@/components/form/form-field';
import { RichTextEditor } from '@/components/form/rich-text-editor';
import { StepChecklist, StepSidebarCard, LevelStepShell } from '@/components/admin/level-editor/level-step-shell';
import { useConfirmDialog, type ConfirmOptions } from '@/components/confirm-dialog';
import { Badge } from '@/components/catalyst/badge';
import { Button } from '@/components/catalyst/button';
import { Checkbox, CheckboxField } from '@/components/catalyst/checkbox';
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '@/components/catalyst/dialog';
import { Description, Label } from '@/components/catalyst/fieldset';
import { Input } from '@/components/catalyst/input';
import { Listbox, ListboxOption } from '@/components/catalyst/listbox';
import { Subheading } from '@/components/catalyst/heading';
import { useValidatedForm } from '@/hooks/use-validated-form';
import { formHasFileUpload, submitMultipartPatch } from '@/lib/inertia-upload';
import { type LearningMaterial, type LearningMaterialFile, type Level, type MaterialType } from '@/types/learning';
import { ArrowUpTrayIcon, BookOpenIcon, PencilSquareIcon, PlusIcon, TrashIcon } from '@heroicons/react/20/solid';
import { router } from '@inertiajs/react';
import clsx from 'clsx';
import { FormEventHandler, useMemo, useState } from 'react';

const MATERIAL_TYPES = [
    { value: 'markdown', label: 'Lesson', hint: 'Rich lesson content with headings, lists, and code blocks' },
    { value: 'standard', label: 'Reference', hint: 'Reference notes or checklist content' },
    { value: 'snippet', label: 'Snippet', hint: 'Short code or command examples' },
    { value: 'pdf', label: 'PDF document', hint: 'Upload a PDF and add optional intro notes' },
    { value: 'slides', label: 'Slides', hint: 'Upload a presentation deck with optional intro notes' },
] as const;

const ACCEPTED_RESOURCE_TYPES =
    'application/pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg,image/png,image/gif,image/webp';

interface MaterialFormData {
    type: MaterialType;
    title: string;
    content: string;
    sort_order: number;
    files: File[];
    remove_file_ids: number[];
}

function emptyForm(sortOrder: number): MaterialFormData {
    return {
        type: 'markdown',
        title: '',
        content: '',
        sort_order: sortOrder,
        files: [],
        remove_file_ids: [],
    };
}

function formFromMaterial(material: LearningMaterial): MaterialFormData {
    return {
        type: material.type,
        title: material.title,
        content: material.content ?? '',
        sort_order: material.sort_order,
        files: [],
        remove_file_ids: [],
    };
}

function contentPreview(content: string | null): string | null {
    if (!content) {
        return null;
    }

    const text = content
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    return text || null;
}

interface MaterialsTabProps {
    pathId: number;
    level: Level;
    onPrev?: () => void;
    onNext?: () => void;
}

function MaterialCard({
    material,
    onEdit,
    onDelete,
}: {
    material: LearningMaterial;
    onEdit: () => void;
    onDelete: () => void;
}) {
    const preview = contentPreview(material.content);
    const attachments = material.files ?? [];

    return (
        <article className="flex gap-4 rounded-lg border border-zinc-950/10 p-4 dark:border-white/10">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                <BookOpenIcon className="size-5 text-zinc-500" />
            </div>
            <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-zinc-950 dark:text-white">{material.title}</p>
                    <Badge>{material.type}</Badge>
                    {attachments.length > 0 && (
                        <Badge color="zinc">
                            {attachments.length} {attachments.length === 1 ? 'file' : 'files'}
                        </Badge>
                    )}
                </div>
                {preview && <p className="mt-2 line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400">{preview}</p>}
                {attachments.length > 0 && (
                    <p className="mt-1 truncate text-xs text-zinc-500 dark:text-zinc-400">
                        Resources: {attachments.map((file) => file.original_name).join(', ')}
                    </p>
                )}
            </div>
            <div className="flex shrink-0 gap-1">
                <Button type="button" plain onClick={onEdit} aria-label="Edit material">
                    <PencilSquareIcon className="size-4" />
                </Button>
                <Button type="button" plain onClick={onDelete} aria-label="Delete material">
                    <TrashIcon className="size-4" />
                </Button>
            </div>
        </article>
    );
}

export function MaterialsTab({ pathId, level, onPrev, onNext }: MaterialsTabProps) {
    const { confirm, ConfirmDialog } = useConfirmDialog();
    const materials = level.materials ?? [];
    const nextSortOrder = materials.length + 1;
    const [dialogOpen, setDialogOpen] = useState(materials.length === 0);
    const [editing, setEditing] = useState<LearningMaterial | null>(null);

    const openCreate = () => {
        setEditing(null);
        setDialogOpen(true);
    };

    const openEdit = (material: LearningMaterial) => {
        setEditing(material);
        setDialogOpen(true);
    };

    const closeDialog = () => {
        setDialogOpen(false);
        setEditing(null);
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
                            <li>Concept lesson with rich text</li>
                            <li>Company standards or checklist</li>
                            <li>Optional PDF or slide deck</li>
                        </ol>
                    </StepSidebarCard>
                    <StepSidebarCard title="Checklist">
                        <StepChecklist items={[{ label: 'At least one material added', done: materials.length > 0 }]} />
                    </StepSidebarCard>
                    <StepSidebarCard title="Rich text tip" variant="tip">
                        Use headings, lists, and code blocks for readable lessons. Attach PDFs or slide decks when learners need downloadable resources.
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
                    <Button type="button" onClick={openCreate}>
                        <PlusIcon data-slot="icon" />
                        Add material
                    </Button>
                </div>

                {materials.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-zinc-300 p-8 text-center dark:border-zinc-600">
                        <BookOpenIcon className="mx-auto size-8 text-zinc-400" />
                        <p className="mt-3 text-sm text-zinc-500">No materials yet. Add your first lesson to get started.</p>
                    </div>
                ) : (
                    <ul className="space-y-3">
                        {materials.map((material) => (
                            <li key={material.id}>
                                <MaterialCard
                                    material={material}
                                    onEdit={() => openEdit(material)}
                                    onDelete={() => deleteMaterial(material)}
                                />
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <MaterialDialog
                key={editing?.id ?? 'new'}
                open={dialogOpen}
                onClose={closeDialog}
                pathId={pathId}
                levelId={level.id}
                material={editing}
                initialData={editing ? formFromMaterial(editing) : emptyForm(nextSortOrder)}
                confirm={confirm}
            />
        </LevelStepShell>
    );
}

interface MaterialDialogProps {
    open: boolean;
    onClose: () => void;
    pathId: number;
    levelId: number;
    material: LearningMaterial | null;
    initialData: MaterialFormData;
    confirm: (options: ConfirmOptions) => Promise<boolean>;
}

function MaterialDialog({ open, onClose, pathId, levelId, material, initialData, confirm }: MaterialDialogProps) {
    const form = useValidatedForm(initialData);
    const [selectedFileNames, setSelectedFileNames] = useState<string[]>([]);
    const typeHint = useMemo(() => MATERIAL_TYPES.find((item) => item.value === form.data.type)?.hint ?? '', [form.data.type]);
    const existingFiles = material?.files ?? [];
    const hasFileUpload = formHasFileUpload(form.data as Record<string, unknown>);

    const toggleRemoveFile = (fileId: number, remove: boolean) => {
        form.setData(
            'remove_file_ids',
            remove
                ? [...form.data.remove_file_ids, fileId]
                : form.data.remove_file_ids.filter((id) => id !== fileId),
        );
    };

    const submit: FormEventHandler = async (e) => {
        e.preventDefault();

        const confirmed = await confirm(
            material
                ? {
                      title: 'Save material changes?',
                      description: `"${form.data.title || material.title}" will be updated for this level.`,
                      confirmLabel: 'Save material',
                  }
                : {
                      title: 'Add material?',
                      description: `"${form.data.title || 'This material'}" will be added to the level curriculum.`,
                      confirmLabel: 'Add material',
                  },
        );

        if (!confirmed) {
            return;
        }

        const options = {
            onSuccess: onClose,
            successToast: material
                ? { title: 'Material saved', message: `"${form.data.title}" was updated.` }
                : { title: 'Material added', message: `"${form.data.title}" was added to this level.` },
        };

        if (material) {
            if (hasFileUpload) {
                submitMultipartPatch(form, route('admin.materials.update', material.id), options);
            } else {
                form.patch(route('admin.materials.update', material.id), options);
            }

            return;
        }

        form.post(route('admin.materials.store', [pathId, levelId]), {
            ...options,
            forceFormData: hasFileUpload,
        });
    };

    return (
        <Dialog open={open} onClose={onClose} size="2xl">
            <DialogTitle>{material ? 'Edit material' : 'Add material'}</DialogTitle>
            <DialogDescription>{typeHint}</DialogDescription>
            <DialogBody>
                <form id="material-form" onSubmit={submit} className="space-y-4">
                    <FormField error={form.errors.type}>
                        <Label>Content type</Label>
                        <Listbox value={form.data.type} onChange={(value) => form.setData('type', value)}>
                            {MATERIAL_TYPES.map((option) => (
                                <ListboxOption key={option.value} value={option.value}>
                                    {option.label}
                                </ListboxOption>
                            ))}
                        </Listbox>
                    </FormField>
                    <FormField error={form.errors.title}>
                        <Label>Title</Label>
                        <Input value={form.data.title} onChange={(e) => form.setData('title', e.target.value)} placeholder="e.g. Introduction to Eloquent" />
                    </FormField>
                    <FormField error={form.errors.content}>
                        <Label>Content</Label>
                        <RichTextEditor
                            value={form.data.content}
                            onChange={(html) => form.setData('content', html)}
                            invalid={!!form.errors.content}
                            placeholder="Write your lesson here…"
                        />
                    </FormField>
                    <FormField error={form.errors.files}>
                        <Label>Resource files</Label>
                        <Description>PDF, PowerPoint, Word, or image · max 25 MB each · optional · multiple allowed</Description>
                        <Input
                            type="file"
                            multiple
                            accept={ACCEPTED_RESOURCE_TYPES}
                            onChange={(e) => {
                                const files = Array.from(e.target.files ?? []);
                                form.setData('files', files);
                                setSelectedFileNames(files.map((file) => file.name));
                            }}
                        />
                        {selectedFileNames.length > 0 && (
                            <ul className="mt-2 space-y-1 text-xs text-zinc-500">
                                {selectedFileNames.map((name) => (
                                    <li key={name} className="flex items-center gap-1.5">
                                        <ArrowUpTrayIcon className="size-3.5 shrink-0" />
                                        {name}
                                    </li>
                                ))}
                            </ul>
                        )}
                        {existingFiles.length > 0 && (
                            <div className="mt-4 space-y-2 rounded-lg border border-zinc-200 p-3 dark:border-zinc-700">
                                <p className="text-xs font-medium text-zinc-600 dark:text-zinc-300">Current files</p>
                                {existingFiles.map((file: LearningMaterialFile) => (
                                    <ExistingFileRow
                                        key={file.id}
                                        file={file}
                                        markedForRemoval={form.data.remove_file_ids.includes(file.id)}
                                        onToggleRemove={(remove) => toggleRemoveFile(file.id, remove)}
                                    />
                                ))}
                            </div>
                        )}
                    </FormField>
                </form>
            </DialogBody>
            <DialogActions>
                <Button plain onClick={onClose}>
                    Cancel
                </Button>
                <Button type="submit" form="material-form" disabled={form.processing}>
                    {material ? 'Save material' : 'Add material'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

function ExistingFileRow({
    file,
    markedForRemoval,
    onToggleRemove,
}: {
    file: LearningMaterialFile;
    markedForRemoval: boolean;
    onToggleRemove: (remove: boolean) => void;
}) {
    return (
        <div className="flex items-center justify-between gap-3">
            <p className={clsx('min-w-0 truncate text-xs text-zinc-500', markedForRemoval && 'line-through opacity-60')}>
                {file.original_name}
            </p>
            <CheckboxField>
                <Checkbox checked={markedForRemoval} onChange={onToggleRemove} />
                <Label>Remove</Label>
            </CheckboxField>
        </div>
    );
}
