import { FormField } from '@/components/form/form-field';
import { Button } from '@/components/catalyst/button';
import { Label } from '@/components/catalyst/fieldset';
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
    compact?: boolean;
    onFileChange: (file: File | null) => void;
    onRemoveAvatar: (remove: boolean) => void;
}

export function AvatarField({
    error,
    name,
    existingUrl,
    file,
    removeAvatar,
    compact = false,
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

    const sizeClass = compact ? 'size-20' : 'size-28';

    return (
        <FormField error={error}>
            <Label className={compact ? 'sr-only' : undefined}>Profile photo</Label>

            <div className={clsx('flex flex-col items-center', compact ? 'gap-2' : 'gap-3')}>
                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className={clsx(
                        'group relative overflow-hidden rounded-xl ring-1 ring-zinc-950/10 transition hover:ring-violet-500/30 dark:ring-white/10',
                        sizeClass,
                    )}
                >
                    {displayUrl ? (
                        <img src={displayUrl} alt="" className="size-full object-cover" />
                    ) : (
                        <span className="flex size-full items-center justify-center bg-gradient-to-br from-violet-500/15 to-zinc-100 text-lg font-semibold text-violet-700 dark:from-violet-400/15 dark:to-zinc-800 dark:text-violet-300">
                            {initials || <PhotoIcon className="size-7 text-violet-500/70" />}
                        </span>
                    )}
                    <span className="absolute inset-x-0 bottom-0 flex items-center justify-center bg-zinc-950/55 py-1 text-[10px] font-medium text-white opacity-0 transition group-hover:opacity-100">
                        <CameraIcon className="size-3.5" />
                    </span>
                </button>

                <div className="flex flex-wrap justify-center gap-1">
                    <Button type="button" plain className="!px-2 !py-1 text-xs" onClick={() => inputRef.current?.click()}>
                        Upload
                    </Button>
                    {displayUrl && (
                        <Button
                            type="button"
                            plain
                            className="!px-2 !py-1 text-xs"
                            onClick={() => {
                                onFileChange(null);
                                onRemoveAvatar(true);
                                if (inputRef.current) {
                                    inputRef.current.value = '';
                                }
                            }}
                        >
                            <XMarkIcon className="size-3.5" />
                        </Button>
                    )}
                </div>

                <input
                    ref={inputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="sr-only"
                    onChange={(e) => {
                        const next = e.target.files?.[0] ?? null;
                        onFileChange(next);
                        onRemoveAvatar(false);
                    }}
                />
            </div>
        </FormField>
    );
}
