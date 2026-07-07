import { ErrorMessage, Field } from '@/components/catalyst/fieldset';
import { withInvalidState } from '@/lib/validation';
import type { ReactNode } from 'react';

interface FormFieldProps {
    /** Laravel Form Request error message for this field. */
    error?: string;
    className?: string;
    children: ReactNode;
}

/**
 * Wraps Catalyst Field + control with invalid outline and error label below the control.
 * Messages must come from Laravel validation (useForm `errors` or page `errors` props).
 */
export function FormField({ error, className, children }: FormFieldProps) {
    const invalid = !!error;

    return (
        <Field className={className}>
            {withInvalidState(children, invalid)}
            {error && <ErrorMessage>{error}</ErrorMessage>}
        </Field>
    );
}
