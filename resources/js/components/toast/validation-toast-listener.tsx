import { useToast } from '@/components/toast/toast-provider';
import { hasValidationErrors } from '@/lib/validation';
import { usePage } from '@inertiajs/react';
import { useEffect, useRef } from 'react';

function normalizeErrors(errors: unknown): Record<string, string> {
    if (!errors || typeof errors !== 'object') {
        return {};
    }

    return Object.fromEntries(
        Object.entries(errors as Record<string, string | string[]>)
            .map(([key, value]) => [key, Array.isArray(value) ? (value[0] ?? '') : value])
            .filter((entry): entry is [string, string] => typeof entry[1] === 'string' && entry[1].length > 0),
    );
}

/**
 * Shows a toast when Laravel Form Request validation errors arrive via Inertia page props.
 */
export function ValidationToastListener() {
    const { errors } = usePage<{ errors?: Record<string, string | string[]> }>().props;
    const { showValidationErrors } = useToast();
    const lastSignature = useRef('');

    useEffect(() => {
        const validationErrors = normalizeErrors(errors);

        if (!hasValidationErrors(validationErrors)) {
            lastSignature.current = '';

            return;
        }

        const signature = JSON.stringify(validationErrors);

        if (signature === lastSignature.current) {
            return;
        }

        lastSignature.current = signature;
        showValidationErrors(validationErrors);
    }, [errors, showValidationErrors]);

    return null;
}
