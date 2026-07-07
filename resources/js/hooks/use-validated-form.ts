import { useToast } from '@/components/toast/toast-provider';
import { useForm, type FormDataConvertible, type FormDataType, type FormOptions, type InertiaFormProps } from '@inertiajs/react';

export interface SuccessToast {
    title: string;
    message?: string;
}

export type ValidatedFormOptions<T extends FormDataConvertible> = FormOptions<T> & {
    onError?: (errors: Record<string, string>) => void;
    successToast?: SuccessToast;
};

function withFormToasts<T extends FormDataConvertible>(
    options: ValidatedFormOptions<T> | undefined,
    showValidationErrors: (errors: Record<string, string>) => void,
    showSuccess: (title: string, message?: string) => void,
): ValidatedFormOptions<T> {
    return {
        ...options,
        onError: (errors) => {
            showValidationErrors(errors);
            options?.onError?.(errors);
        },
        onSuccess: (page) => {
            if (options?.successToast) {
                showSuccess(options.successToast.title, options.successToast.message);
            }

            options?.onSuccess?.(page);
        },
    };
}

/**
 * Inertia useForm wrapper that shows a toast when Laravel validation fails
 * or when successToast is provided on submit options.
 * Field errors still render inline via FormField.
 */
export function useValidatedForm<TForm extends FormDataType>(
    initialData: TForm,
): InertiaFormProps<TForm> {
    const { showValidationErrors, showSuccess } = useToast();
    const form = useForm(initialData);

    const wrap = (options?: ValidatedFormOptions<TForm>) =>
        withFormToasts(options, showValidationErrors, showSuccess);

    return {
        ...form,
        post: (url, options) => form.post(url, wrap(options)),
        put: (url, options) => form.put(url, wrap(options)),
        patch: (url, options) => form.patch(url, wrap(options)),
        delete: (url, options) => form.delete(url, wrap(options)),
        get: (url, options) => form.get(url, wrap(options)),
    };
}
