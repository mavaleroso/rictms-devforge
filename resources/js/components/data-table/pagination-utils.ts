/**
 * Build a compact page list with ellipsis, e.g. [1, 'ellipsis', 4, 5, 6, 'ellipsis', 20]
 */
export function buildPageRange(currentPage: number, totalPages: number): Array<number | 'ellipsis'> {
    if (totalPages <= 0) {
        return [];
    }

    if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const pages = new Set<number>([1, totalPages, currentPage, currentPage - 1, currentPage + 1]);

    const sorted = [...pages].filter((page) => page >= 1 && page <= totalPages).sort((a, b) => a - b);
    const result: Array<number | 'ellipsis'> = [];

    for (let index = 0; index < sorted.length; index += 1) {
        const page = sorted[index];
        const previous = sorted[index - 1];

        if (index > 0 && page - previous > 1) {
            result.push('ellipsis');
        }

        result.push(page);
    }

    return result;
}
