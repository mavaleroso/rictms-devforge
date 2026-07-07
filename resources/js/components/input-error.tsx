import { ErrorMessage } from '@/components/catalyst/fieldset';

/**
 * @deprecated Use FormField with Laravel `errors.field` from useValidatedForm instead.
 */
export default function InputError({ message, className = '' }: { message?: string; className?: string }) {
    if (!message) {
        return null;
    }

    return <ErrorMessage className={className}>{message}</ErrorMessage>;
}
