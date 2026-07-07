export const SEX_OPTIONS = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
    { value: 'prefer_not_to_say', label: 'Prefer not to say' },
] as const;

export function formatSex(value?: string | null): string {
    if (!value) {
        return 'Not specified';
    }

    return SEX_OPTIONS.find((option) => option.value === value)?.label ?? value;
}

export function composeFullName(first: string, middle: string, last: string): string {
    return [first, middle, last].map((part) => part.trim()).filter(Boolean).join(' ');
}

export function splitFullName(name: string): { first_name: string; middle_name: string; last_name: string } {
    const parts = name.trim().split(/\s+/).filter(Boolean);

    if (parts.length === 0) {
        return { first_name: '', middle_name: '', last_name: '' };
    }

    if (parts.length === 1) {
        return { first_name: parts[0], middle_name: '', last_name: '' };
    }

    if (parts.length === 2) {
        return { first_name: parts[0], middle_name: '', last_name: parts[1] };
    }

    return {
        first_name: parts[0],
        middle_name: parts.slice(1, -1).join(' '),
        last_name: parts[parts.length - 1],
    };
}
