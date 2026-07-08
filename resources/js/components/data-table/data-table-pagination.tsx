import { Button } from '@/components/catalyst/button';
import { Select } from '@/components/catalyst/select';
import { buildPageRange } from '@/components/data-table/pagination-utils';
import type { PaginationMeta } from '@/types/pagination';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';

interface DataTablePaginationProps {
    meta: PaginationMeta;
    pageIndex: number;
    pageSize: number;
    pageSizeOptions: number[];
    onPageChange: (pageIndex: number) => void;
    onPageSizeChange: (pageSize: number) => void;
    isLoading?: boolean;
    compact?: boolean;
}

interface PageButtonProps {
    page: number;
    isActive: boolean;
    disabled?: boolean;
    onClick: () => void;
}

function PageButton({ page, isActive, disabled = false, onClick }: PageButtonProps) {
    return (
        <button
            type="button"
            disabled={disabled}
            onClick={onClick}
            aria-current={isActive ? 'page' : undefined}
            className={clsx(
                'inline-flex min-w-8 items-center justify-center rounded-md px-2.5 py-1 text-xs font-medium tabular-nums transition-colors',
                'disabled:cursor-not-allowed disabled:opacity-50',
                isActive
                    ? 'bg-zinc-900 text-white shadow-sm dark:bg-white dark:text-zinc-900'
                    : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800',
            )}
        >
            {page}
        </button>
    );
}

export function DataTablePagination({
    meta,
    pageIndex,
    pageSize,
    pageSizeOptions,
    onPageChange,
    onPageSizeChange,
    isLoading = false,
    compact = true,
}: DataTablePaginationProps) {
    const totalPages = Math.max(meta.last_page, 1);
    const currentPage = meta.current_page;
    const canPrevious = pageIndex > 0;
    const canNext = pageIndex + 1 < totalPages;
    const rangeStart = meta.from ?? 0;
    const rangeEnd = meta.to ?? 0;
    const pages = buildPageRange(currentPage, totalPages);

    return (
        <div
            className={clsx(
                'flex flex-col gap-3 border-t border-zinc-950/8 bg-zinc-50/70 sm:flex-row sm:items-center sm:justify-between dark:border-white/8 dark:bg-zinc-900/50',
                compact ? 'px-4 py-3' : 'px-6 py-4',
            )}
        >
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {meta.total === 0 ? (
                    'No entries to display'
                ) : (
                    <>
                        Showing{' '}
                        <span className="font-medium text-zinc-800 tabular-nums dark:text-zinc-200">{rangeStart}</span>
                        {'–'}
                        <span className="font-medium text-zinc-800 tabular-nums dark:text-zinc-200">{rangeEnd}</span>
                        {' of '}
                        <span className="font-medium text-zinc-800 tabular-nums dark:text-zinc-200">{meta.total}</span>
                    </>
                )}
            </p>

            <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                    <label htmlFor="table-page-size" className="text-xs text-zinc-500 dark:text-zinc-400">
                        Rows
                    </label>
                    <Select
                        id="table-page-size"
                        value={String(pageSize)}
                        disabled={isLoading}
                        onChange={(event) => onPageSizeChange(Number(event.target.value))}
                        className={clsx(compact ? 'w-[4.5rem] !text-xs' : 'w-20')}
                        aria-label="Rows per page"
                    >
                        {pageSizeOptions.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </Select>
                </div>

                <nav aria-label="Pagination" className="flex items-center gap-1">
                    <Button
                        plain
                        disabled={!canPrevious || isLoading}
                        onClick={() => onPageChange(pageIndex - 1)}
                        className="!px-2 !py-1"
                        aria-label="Previous page"
                    >
                        <ChevronLeftIcon className="size-4" />
                    </Button>

                    {pages.map((page, index) =>
                        page === 'ellipsis' ? (
                            <span
                                key={`ellipsis-${index}`}
                                className="inline-flex min-w-8 items-center justify-center px-1 text-xs text-zinc-400 select-none"
                                aria-hidden
                            >
                                …
                            </span>
                        ) : (
                            <PageButton
                                key={page}
                                page={page}
                                isActive={page === currentPage}
                                disabled={isLoading}
                                onClick={() => onPageChange(page - 1)}
                            />
                        ),
                    )}

                    <Button
                        plain
                        disabled={!canNext || isLoading}
                        onClick={() => onPageChange(pageIndex + 1)}
                        className="!px-2 !py-1"
                        aria-label="Next page"
                    >
                        <ChevronRightIcon className="size-4" />
                    </Button>
                </nav>
            </div>
        </div>
    );
}
