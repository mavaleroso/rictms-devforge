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

export function formatMiddleInitial(middle: string): string {
    const trimmed = middle.trim();

    if (!trimmed) {
        return '';
    }

    const letter = trimmed.replace(/\./g, '').charAt(0);

    return letter ? `${letter.toUpperCase()}.` : '';
}

export function composeFullName(first: string, middle: string, last: string): string {
    const middleInitial = formatMiddleInitial(middle);

    return [first, middleInitial, last].map((part) => part.trim()).filter(Boolean).join(' ');
}

export function formatDisplayName(user: {
    name: string;
    first_name?: string | null;
    middle_name?: string | null;
    last_name?: string | null;
}): string {
    if (user.first_name || user.middle_name || user.last_name) {
        return composeFullName(user.first_name ?? '', user.middle_name ?? '', user.last_name ?? '');
    }

    const split = splitFullName(user.name);

    return composeFullName(split.first_name, split.middle_name, split.last_name) || user.name;
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
