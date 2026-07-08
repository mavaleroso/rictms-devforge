export class FetchJsonError extends Error {
    constructor(
        message: string,
        public status: number,
        public errors?: Record<string, string[]>,
    ) {
        super(message);
        this.name = 'FetchJsonError';
    }
}

function getCsrfToken(): string | null {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);

    return match ? decodeURIComponent(match[1]) : null;
}

export async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
    const csrf = getCsrfToken();
    const headers = new Headers(init?.headers);

    headers.set('Accept', 'application/json');
    headers.set('X-Requested-With', 'XMLHttpRequest');

    if (csrf) {
        headers.set('X-XSRF-TOKEN', csrf);
    }

    const response = await fetch(url, {
        credentials: 'same-origin',
        ...init,
        headers,
    });

    if (!response.ok) {
        const body = (await response.json().catch(() => null)) as {
            message?: string;
            errors?: Record<string, string[]>;
        } | null;

        const firstError = body?.errors ? Object.values(body.errors).flat()[0] : undefined;

        throw new FetchJsonError(
            firstError ?? body?.message ?? `Request failed with status ${response.status}`,
            response.status,
            body?.errors,
        );
    }

    return response.json() as Promise<T>;
}

export function buildQueryString(params: Record<string, string | number | undefined>): string {
    const searchParams = new URLSearchParams();

    for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== '') {
            searchParams.set(key, String(value));
        }
    }

    const query = searchParams.toString();

    return query ? `?${query}` : '';
}
