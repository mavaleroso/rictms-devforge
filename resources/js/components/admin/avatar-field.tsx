import { FormField } from '@/components/form/form-field';
import { Button } from '@/components/catalyst/button';
import { Description, Label } from '@/components/catalyst/fieldset';
import { useCoverImagePreview } from '@/hooks/use-cover-image-preview';
import clsx from 'clsx';
import { CameraIcon, PhotoIcon, XMarkIcon } from '@heroicons/react/20/solid';
import { useRef } from 'react';

interface AvatarFieldProps {
    error?: string;
    name: string;
    existingUrl?: string | null;
    file: File | null;
    removeAvatar: boolean;
    variant?: 'inline' | 'stacked';
    onFileChange: (file: File | null) => void;
    onRemoveAvatar: (remove: boolean) => void;
}

export function AvatarField({
    error,
    name,
    existingUrl,
    file,
    removeAvatar,
    variant = 'inline',
    onFileChange,
    onRemoveAvatar,
}: AvatarFieldProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const displayUrl = useCoverImagePreview(file, existingUrl, removeAvatar);
    const initials = name
        .split(' ')
        .filter(Boolean)
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    const clearAvatar = () => {
        onFileChange(null);
        onRemoveAvatar(true);
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    if (variant === 'stacked') {
        return (
            <FormField error={error}>
                <Label>Profile photo</Label>
                <Description>JPG, PNG, or WebP · max 2 MB</Description>
                <div className="mt-3 flex flex-col items-center gap-3">
                    <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        className="group relative size-24 overflow-hidden rounded-2xl ring-1 ring-zinc-950/10 transition hover:ring-brand-500/40 dark:ring-white/10"
                    >
                        {displayUrl ? (
                            <img src={displayUrl} alt="" className="size-full object-cover" />
                        ) : (
                            <span className="flex size-full items-center justify-center bg-gradient-to-br from-brand-500/10 to-zinc-100 text-xl font-semibold text-brand-700 dark:from-brand-400/10 dark:to-zinc-800 dark:text-brand-300">
                                {initials || <PhotoIcon className="size-8 text-brand-500/60" />}
                            </span>
                        )}
                        <span className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1 bg-zinc-950/60 py-1.5 text-[10px] font-medium text-white opacity-0 transition group-hover:opacity-100">
                            <CameraIcon className="size-3.5" />
                            Change
                        </span>
                    </button>
                    <div className="flex gap-2">
                        <Button type="button" outline onClick={() => inputRef.current?.click()}>
                            Upload
                        </Button>
                        {displayUrl && (
                            <Button type="button" plain onClick={clearAvatar}>
                                <XMarkIcon data-slot="icon" />
                                Remove
                            </Button>
                        )}
                    </div>
                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="sr-only"
                        onChange={(e) => {
                            onFileChange(e.target.files?.[0] ?? null);
                            onRemoveAvatar(false);
                        }}
                    />
                </div>
            </FormField>
        );
    }

    return (
        <FormField error={error}>
            <div
                className={clsx(
                    'flex items-center gap-4 rounded-xl border border-zinc-950/5 bg-zinc-50/80 p-4 dark:border-white/5 dark:bg-zinc-800/30',
                    error && 'border-red-300 dark:border-red-500/30',
                )}
            >
                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="group relative size-16 shrink-0 overflow-hidden rounded-xl ring-1 ring-zinc-950/10 transition hover:ring-brand-500/40 dark:ring-white/10"
                >
                    {displayUrl ? (
                        <img src={displayUrl} alt="" className="size-full object-cover" />
                    ) : (
                        <span className="flex size-full items-center justify-center bg-gradient-to-br from-brand-500/10 to-zinc-100 text-base font-semibold text-brand-700 dark:from-brand-400/10 dark:to-zinc-800 dark:text-brand-300">
                            {initials || <PhotoIcon className="size-6 text-brand-500/60" />}
                        </span>
                    )}
                    <span className="absolute inset-0 flex items-center justify-center bg-zinc-950/50 opacity-0 transition group-hover:opacity-100">
                        <CameraIcon className="size-5 text-white" />
                    </span>
                </button>

                <div className="min-w-0 flex-1">
                    <Label>Profile photo</Label>
                    <Description className="mt-0.5">Square image recommended · max 2 MB</Description>
                    <div className="mt-2 flex flex-wrap gap-2">
                        <Button type="button" outline onClick={() => inputRef.current?.click()}>
                            {displayUrl ? 'Replace' : 'Upload photo'}
                        </Button>
                        {displayUrl && (
                            <Button type="button" plain onClick={clearAvatar}>
                                Remove
                            </Button>
                        )}
                    </div>
                </div>

                <input
                    ref={inputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="sr-only"
                    onChange={(e) => {
                        onFileChange(e.target.files?.[0] ?? null);
                        onRemoveAvatar(false);
                    }}
                />
            </div>
        </FormField>
    );
}
