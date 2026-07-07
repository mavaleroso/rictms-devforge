import { FormField } from '@/components/form/form-field';
import { Button } from '@/components/catalyst/button';
import { Description, Label } from '@/components/catalyst/fieldset';
import { useCoverImagePreview } from '@/hooks/use-cover-image-preview';
import clsx from 'clsx';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/20/solid';
import { useRef } from 'react';

interface CoverImageFieldProps {
    error?: string;
    existingUrl?: string | null;
    file: File | null;
    removeCover: boolean;
    onFileChange: (file: File | null) => void;
    onRemoveCover: (remove: boolean) => void;
}

export function CoverImageField({
    error,
    existingUrl,
    file,
    removeCover,
    onFileChange,
    onRemoveCover,
}: CoverImageFieldProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const displayUrl = useCoverImagePreview(file, existingUrl, removeCover);

    return (
        <FormField error={error}>
            <Label>Cover image</Label>
            <Description>Recommended 16:9 image (JPG or PNG, max 2 MB). Shown on path cards in the catalog.</Description>

            <div className="mt-3 space-y-3">
                {displayUrl ? (
                    <div className="relative overflow-hidden rounded-xl border border-zinc-950/10 dark:border-white/10">
                        <img src={displayUrl} alt="Path cover preview" className="aspect-video w-full object-cover" />
                        <div className="absolute top-2 right-2 flex gap-2">
                            <Button type="button" plain onClick={() => inputRef.current?.click()}>
                                Replace
                            </Button>
                            <Button
                                type="button"
                                plain
                                onClick={() => {
                                    onFileChange(null);
                                    onRemoveCover(true);
                                    if (inputRef.current) {
                                        inputRef.current.value = '';
                                    }
                                }}
                            >
                                <XMarkIcon data-slot="icon" />
                                Remove
                            </Button>
                        </div>
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        className={clsx(
                            'flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 transition',
                            'border-zinc-300 hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-600 dark:hover:border-zinc-500 dark:hover:bg-zinc-800/50',
                        )}
                    >
                        <PhotoIcon className="size-10 text-zinc-400" />
                        <span className="mt-3 text-sm font-medium text-zinc-700 dark:text-zinc-200">Upload cover image</span>
                        <span className="mt-1 text-xs text-zinc-500">Click to browse files</span>
                    </button>
                )}

                <input
                    ref={inputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="sr-only"
                    onChange={(e) => {
                        const next = e.target.files?.[0] ?? null;
                        onFileChange(next);
                        onRemoveCover(false);
                    }}
                />
            </div>
        </FormField>
    );
}
