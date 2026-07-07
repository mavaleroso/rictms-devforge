import { useEffect, useState } from 'react';

/** Local file preview, or server URL (with optional cache-bust query). */
export function useCoverImagePreview(
    file: File | null,
    serverUrl?: string | null,
    removeCover = false,
): string | null {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        if (!file) {
            setPreviewUrl(null);

            return;
        }

        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [file]);

    if (removeCover) {
        return null;
    }

    return previewUrl ?? serverUrl ?? null;
}
