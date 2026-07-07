import { FormField } from '@/components/form/form-field';
import { useConfirmDialog } from '@/components/confirm-dialog';
import { Button } from '@/components/catalyst/button';
import { Description, Label } from '@/components/catalyst/fieldset';
import { Input } from '@/components/catalyst/input';
import { Listbox, ListboxOption } from '@/components/catalyst/listbox';
import { Subheading } from '@/components/catalyst/heading';
import { Textarea } from '@/components/catalyst/textarea';
import { type LevelDifficulty } from '@/types/learning';
import { useValidatedForm } from '@/hooks/use-validated-form';
import { FormEventHandler } from 'react';

const DIFFICULTY_OPTIONS: { value: LevelDifficulty; label: string }[] = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
];

interface AddLevelFormProps {
    pathId: number;
    nextNumber: number;
    onCancel?: () => void;
}

export function AddLevelForm({ pathId, nextNumber, onCancel }: AddLevelFormProps) {
    const { confirm, ConfirmDialog } = useConfirmDialog();
    const { data, setData, post, processing, errors, reset } = useValidatedForm({
        title: '',
        number: nextNumber,
        overview: '',
        estimated_minutes: 60,
        difficulty: 'beginner' as LevelDifficulty,
    });

    const submit: FormEventHandler = async (e) => {
        e.preventDefault();

        const confirmed = await confirm({
            title: 'Add level to curriculum?',
            description: `Level ${data.number} will be created with a default quiz. You can add materials and questions in the level editor.`,
            confirmLabel: 'Add level',
        });

        if (!confirmed) {
            return;
        }

        post(route('admin.levels.store', pathId), {
            onSuccess: () => reset(),
            successToast: { title: 'Level added', message: 'Open the level editor to add materials and quiz questions.' },
        });
    };

    return (
        <form onSubmit={submit} className="rounded-xl border border-zinc-950/10 bg-white p-6 dark:border-white/10 dark:bg-zinc-900">
            <ConfirmDialog />
            <Subheading>Add level to curriculum</Subheading>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Each level unlocks in order. A default quiz is created automatically — add questions in the level editor.
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <FormField error={errors.title}>
                    <Label>Level title</Label>
                    <Input value={data.title} onChange={(e) => setData('title', e.target.value)} placeholder="e.g. Eloquent ORM" />
                </FormField>
                <FormField error={errors.number}>
                    <Label>Level number</Label>
                    <Description>Sequential order in the path.</Description>
                    <Input type="number" min={1} value={data.number} onChange={(e) => setData('number', Number(e.target.value))} />
                </FormField>
                <FormField error={errors.difficulty}>
                    <Label>Difficulty</Label>
                    <Listbox value={data.difficulty} onChange={(value) => setData('difficulty', value)}>
                        {DIFFICULTY_OPTIONS.map((option) => (
                            <ListboxOption key={option.value} value={option.value}>
                                {option.label}
                            </ListboxOption>
                        ))}
                    </Listbox>
                </FormField>
                <FormField error={errors.estimated_minutes}>
                    <Label>Estimated minutes</Label>
                    <Input
                        type="number"
                        min={15}
                        value={data.estimated_minutes}
                        onChange={(e) => setData('estimated_minutes', Number(e.target.value))}
                    />
                </FormField>
            </div>

            <FormField error={errors.overview} className="mt-4">
                <Label>Overview (optional)</Label>
                <Textarea value={data.overview} onChange={(e) => setData('overview', e.target.value)} rows={3} />
            </FormField>

            <div className="mt-5 flex gap-3">
                <Button type="submit" disabled={processing}>
                    Add level & edit content
                </Button>
                {onCancel && (
                    <Button type="button" plain onClick={onCancel}>
                        Cancel
                    </Button>
                )}
            </div>
        </form>
    );
}
