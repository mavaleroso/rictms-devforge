import type { FormDataConvertible, FormDataType, InertiaFormProps } from '@inertiajs/react';
import type { ValidatedFormOptions } from '@/hooks/use-validated-form';

/**
 * PHP cannot parse multipart file uploads on PATCH/PUT requests.
 * Use POST + _method=patch when the form includes files (Inertia + Laravel).
 */
export function submitMultipartPatch<T extends FormDataType>(
    form: InertiaFormProps<T>,
    url: string,
    options?: ValidatedFormOptions<T>,
): void {
    const resetTransform = () => {
        form.transform((payload) => payload);
    };

    form.transform((payload) => ({ ...payload, _method: 'patch' }) as T);
    form.post(url, {
        ...options,
        forceFormData: true,
        onSuccess: (page) => {
            resetTransform();
            options?.onSuccess?.(page);
        },
        onError: (errors) => {
            resetTransform();
            options?.onError?.(errors);
        },
        onFinish: () => {
            resetTransform();
            options?.onFinish?.();
        },
    });
}

export function formHasFileUpload(data: Record<string, FormDataConvertible>): boolean {
    return Object.values(data).some((value) => value instanceof File);
}
