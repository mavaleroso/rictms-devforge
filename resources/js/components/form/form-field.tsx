import { ErrorMessage, Field, Label } from '@/components/catalyst/fieldset';
import { withInvalidState } from '@/lib/validation';
import type { ReactNode } from 'react';

interface FormFieldProps {
    /** Optional field label rendered above the control. */
    label?: string;
    /** Laravel Form Request error message for this field. */
    error?: string;
    className?: string;
    children: ReactNode;
}

/**
 * Wraps Catalyst Field + control with invalid outline and error label below the control.
 * Messages must come from Laravel validation (useForm `errors` or page `errors` props).
 */
export function FormField({ label, error, className, children }: FormFieldProps) {
    const invalid = !!error;

    return (
        <Field className={className}>
            {label && <Label>{label}</Label>}
            {withInvalidState(children, invalid)}
            {error && <ErrorMessage>{error}</ErrorMessage>}
        </Field>
    );
}
