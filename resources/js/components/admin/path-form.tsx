import { CoverImageField } from '@/components/admin/cover-image-field';
import { FormField } from '@/components/form/form-field';
import { Button } from '@/components/catalyst/button';
import { Description, Label } from '@/components/catalyst/fieldset';
import { Input } from '@/components/catalyst/input';
import { Listbox, ListboxOption } from '@/components/catalyst/listbox';
import { Subheading } from '@/components/catalyst/heading';
import { Switch, SwitchField } from '@/components/catalyst/switch';
import { Textarea } from '@/components/catalyst/textarea';
import { PATH_ICON_OPTIONS } from '@/lib/path-icons';
import type { ValidationErrors } from '@/lib/validation';
import type { FormEventHandler, ReactNode } from 'react';

export interface PathFormData {
    name: string;
    slug: string;
    description: string;
    icon: string;
    is_active: boolean;
    sort_order: number;
    cover_image: File | null;
    remove_cover: boolean;
}

interface PathFormProps {
    data: PathFormData;
    errors: ValidationErrors;
    processing: boolean;
    submitLabel: string;
    onSubmit: FormEventHandler;
    onNameChange: (name: string) => void;
    onSlugChange: (slug: string) => void;
    setData: <K extends keyof PathFormData>(key: K, value: PathFormData[K]) => void;
    existingCoverUrl?: string | null;
    cancelHref?: string;
    footer?: ReactNode;
    showSortOrder?: boolean;
}

function FormSection({ title, description, children }: { title: string; description: string; children: ReactNode }) {
    return (
        <section className="rounded-xl border border-zinc-950/10 bg-white p-6 dark:border-white/10 dark:bg-zinc-900">
            <Subheading>{title}</Subheading>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{description}</p>
            <div className="mt-5 space-y-4">{children}</div>
        </section>
    );
}

export function PathForm({
    data,
    errors,
    processing,
    submitLabel,
    onSubmit,
    onNameChange,
    onSlugChange,
    setData,
    existingCoverUrl,
    cancelHref,
    footer,
    showSortOrder = true,
}: PathFormProps) {
    return (
        <form onSubmit={onSubmit} className="space-y-6">
            <FormSection title="Basics" description="Name and URL slug interns will see in the catalog.">
                <FormField error={errors.name}>
                    <Label>Path name</Label>
                    <Description>A clear, outcome-focused title for the curriculum.</Description>
                    <Input value={data.name} onChange={(e) => onNameChange(e.target.value)} placeholder="e.g. Laravel + Inertia Full Stack" />
                </FormField>
                <FormField error={errors.slug}>
                    <Label>URL slug</Label>
                    <Description>Used in links. Leave blank to auto-generate from the name.</Description>
                    <Input value={data.slug} onChange={(e) => onSlugChange(e.target.value)} placeholder="laravel-inertia-full-stack" />
                </FormField>
            </FormSection>

            <FormSection title="Presentation" description="How this path appears in the learning catalog.">
                <FormField error={errors.description}>
                    <Label>Description</Label>
                    <Description>Summarize what interns will learn and who the path is for.</Description>
                    <Textarea
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        rows={4}
                        placeholder="Master Laravel 12 with Inertia.js, React, and company standards…"
                    />
                </FormField>
                <CoverImageField
                    error={errors.cover_image}
                    existingUrl={existingCoverUrl}
                    file={data.cover_image}
                    removeCover={data.remove_cover}
                    onFileChange={(file) => setData('cover_image', file)}
                    onRemoveCover={(remove) => setData('remove_cover', remove)}
                />
                <FormField error={errors.icon}>
                    <Label>Icon</Label>
                    <Description>Visual identifier shown on path cards.</Description>
                    <Listbox value={data.icon || null} onChange={(value) => setData('icon', value ?? '')} placeholder="Choose icon">
                        {PATH_ICON_OPTIONS.map((option) => (
                            <ListboxOption key={option.value} value={option.value}>
                                {option.label}
                            </ListboxOption>
                        ))}
                    </Listbox>
                </FormField>
            </FormSection>

            <FormSection title="Publishing" description="Control visibility and ordering in the catalog.">
                {showSortOrder && (
                    <FormField error={errors.sort_order}>
                        <Label>Sort order</Label>
                        <Description>Lower numbers appear first in the path list.</Description>
                        <Input
                            type="number"
                            min={0}
                            value={data.sort_order}
                            onChange={(e) => setData('sort_order', Number(e.target.value))}
                        />
                    </FormField>
                )}
                <SwitchField>
                    <Label>Published</Label>
                    <Description>When enabled, interns can discover and enroll in this path.</Description>
                    <Switch checked={data.is_active} onChange={(value) => setData('is_active', value)} />
                </SwitchField>
            </FormSection>

            <div className="flex flex-wrap items-center gap-3">
                <Button type="submit" disabled={processing}>
                    {submitLabel}
                </Button>
                {cancelHref && (
                    <Button href={cancelHref} plain>
                        Cancel
                    </Button>
                )}
                {footer}
            </div>
        </form>
    );
}
