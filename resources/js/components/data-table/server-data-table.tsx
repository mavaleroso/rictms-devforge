import { Button } from '@/components/catalyst/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/catalyst/table';
import { DataTablePagination } from '@/components/data-table/data-table-pagination';
import { DataTableSearch } from '@/components/data-table/data-table-search';
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { buildQueryString, fetchJson } from '@/lib/fetch-json';
import type { PaginatedResponse, ServerTableParams } from '@/types/pagination';
import {
    ArrowPathIcon,
    ChevronDownIcon,
    ChevronUpDownIcon,
    ChevronUpIcon,
    MagnifyingGlassIcon,
} from '@heroicons/react/20/solid';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
    type ColumnDef,
    type PaginationState,
    type SortingState,
} from '@tanstack/react-table';
import clsx from 'clsx';
import { useEffect, useMemo, useState, type ReactNode } from 'react';

export interface DataTableColumnMeta {
    align?: 'left' | 'center' | 'right';
    headerClassName?: string;
    cellClassName?: string;
}

export interface ServerDataTableProps<TData> {
    columns: ColumnDef<TData, unknown>[];
    queryKey: string;
    fetchUrl: string;
    perPage?: number;
    perPageOptions?: number[];
    searchable?: boolean;
    searchPlaceholder?: string;
    title?: string;
    description?: ReactNode;
    emptyTitle?: string;
    emptyDescription?: ReactNode;
    emptyAction?: ReactNode;
    className?: string;
    headerClassName?: string;
    striped?: boolean;
    dense?: boolean;
    compact?: boolean;
}

async function fetchPaginated<TData>(fetchUrl: string, params: ServerTableParams): Promise<PaginatedResponse<TData>> {
    const query = buildQueryString({
        page: params.page,
        per_page: params.per_page,
        sort: params.sort,
        direction: params.direction,
        search: params.search,
    });

    return fetchJson<PaginatedResponse<TData>>(`${fetchUrl}${query}`);
}

function getColumnMeta(meta: unknown): DataTableColumnMeta {
    return (meta as DataTableColumnMeta | undefined) ?? {};
}

function alignClassName(align?: DataTableColumnMeta['align']): string | undefined {
    if (align === 'right') {
        return 'text-right';
    }

    if (align === 'center') {
        return 'text-center';
    }

    return undefined;
}

function SortIndicator({ direction }: { direction: false | 'asc' | 'desc' }) {
    if (direction === 'asc') {
        return <ChevronUpIcon className="size-3.5 text-zinc-900 dark:text-zinc-100" />;
    }

    if (direction === 'desc') {
        return <ChevronDownIcon className="size-3.5 text-zinc-900 dark:text-zinc-100" />;
    }

    return <ChevronUpDownIcon className="size-3.5 text-zinc-400 opacity-0 transition-opacity group-hover/th:opacity-100 dark:text-zinc-500" />;
}

export function ServerDataTable<TData>({
    columns,
    queryKey,
    fetchUrl,
    perPage = 15,
    perPageOptions = [10, 15, 25, 50],
    searchable = true,
    searchPlaceholder = 'Search records...',
    title,
    description,
    emptyTitle = 'No records found',
    emptyDescription = 'Adjust your filters or search terms and try again.',
    emptyAction,
    className,
    headerClassName,
    striped = false,
    dense,
    compact = true,
}: ServerDataTableProps<TData>) {
    const isDense = dense ?? compact;

    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: perPage,
    });
    const [sorting, setSorting] = useState<SortingState>([]);
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebouncedValue(search);

    useEffect(() => {
        setPagination((current) => ({ ...current, pageIndex: 0 }));
    }, [debouncedSearch]);

    const sort = sorting[0];

    const queryParams = useMemo<ServerTableParams>(
        () => ({
            page: pagination.pageIndex + 1,
            per_page: pagination.pageSize,
            sort: sort?.id,
            direction: sort?.desc ? 'desc' : 'asc',
            search: debouncedSearch || undefined,
        }),
        [pagination.pageIndex, pagination.pageSize, sort?.id, sort?.desc, debouncedSearch],
    );

    const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
        queryKey: [queryKey, queryParams],
        queryFn: () => fetchPaginated<TData>(fetchUrl, queryParams),
        placeholderData: keepPreviousData,
    });

    const table = useReactTable({
        data: data?.data ?? [],
        columns,
        pageCount: data?.meta.last_page ?? -1,
        state: {
            pagination,
            sorting,
        },
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        manualSorting: true,
        autoResetPageIndex: false,
    });

    const rows = table.getRowModel().rows;
    const meta = data?.meta;
    const showEmpty = !isLoading && rows.length === 0;
    const showSkeleton = isLoading && !data;
    const isFiltered = debouncedSearch.length > 0;

    return (
        <div
            className={clsx(
                'overflow-hidden rounded-xl border border-zinc-950/10 bg-white shadow-sm ring-1 ring-zinc-950/5 dark:border-white/10 dark:bg-zinc-900 dark:ring-white/5',
                className,
            )}
        >
            {(title || description || searchable) && (
                <div
                    className={clsx(
                        'border-b border-zinc-950/8 dark:border-white/8',
                        compact ? 'px-4 py-3.5' : 'px-6 py-5',
                        headerClassName,
                    )}
                >
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <div className="min-w-0 space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                                {title && (
                                    <h2 className={clsx('font-semibold text-zinc-950 dark:text-white', compact ? 'text-sm' : 'text-base')}>
                                        {title}
                                    </h2>
                                )}
                                {meta && (
                                    <span className="inline-flex items-center rounded-md bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-600 tabular-nums dark:bg-zinc-800 dark:text-zinc-300">
                                        {meta.total} {meta.total === 1 ? 'record' : 'records'}
                                    </span>
                                )}
                                {isFiltered && (
                                    <span className="inline-flex items-center rounded-md bg-blue-500/10 px-2 py-0.5 text-[11px] font-medium text-blue-700 dark:text-blue-300">
                                        Search active
                                    </span>
                                )}
                            </div>
                            {description && (
                                <p className={clsx('text-zinc-500 dark:text-zinc-400', compact ? 'text-xs' : 'text-sm')}>{description}</p>
                            )}
                        </div>

                        {searchable && (
                            <DataTableSearch
                                value={search}
                                onChange={setSearch}
                                placeholder={searchPlaceholder}
                                isLoading={isFetching && isFiltered}
                                compact={compact}
                                className="w-full shrink-0 lg:max-w-xs"
                            />
                        )}
                    </div>
                </div>
            )}

            {isError ? (
                <div className={clsx('text-center', compact ? 'px-4 py-12' : 'px-6 py-16')}>
                    <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-red-500/10">
                        <ArrowPathIcon className="size-5 text-red-600 dark:text-red-400" />
                    </div>
                    <p className="mt-4 text-sm font-medium text-zinc-950 dark:text-white">Could not load records</p>
                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                        {error instanceof Error ? error.message : 'An unexpected error occurred.'}
                    </p>
                    <Button className="mt-4" outline onClick={() => refetch()}>
                        <ArrowPathIcon data-slot="icon" />
                        Retry
                    </Button>
                </div>
            ) : showEmpty ? (
                <div className={clsx('text-center', compact ? 'px-4 py-14' : 'px-6 py-20')}>
                    <div className="mx-auto flex size-11 items-center justify-center rounded-full border border-dashed border-zinc-300 dark:border-zinc-600">
                        <MagnifyingGlassIcon className="size-5 text-zinc-400" />
                    </div>
                    <p className="mt-4 text-sm font-semibold text-zinc-950 dark:text-white">{emptyTitle}</p>
                    <p className="mx-auto mt-1.5 max-w-md text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                        {emptyDescription}
                    </p>
                    {emptyAction && <div className="mt-4">{emptyAction}</div>}
                </div>
            ) : (
                <div className="relative">
                    {isFetching && data && (
                        <div className="absolute inset-x-0 top-0 z-20 h-px bg-zinc-200 dark:bg-zinc-700">
                            <div className="h-full w-full origin-left animate-pulse bg-zinc-900/40 dark:bg-white/30" />
                        </div>
                    )}

                    <Table striped={striped} dense={isDense} className="[--gutter:theme(spacing.4)]">
                        <TableHead className="border-b border-zinc-950/8 bg-zinc-50 dark:border-white/8 dark:bg-zinc-800/50">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id} className="hover:bg-transparent">
                                    {headerGroup.headers.map((header) => {
                                        const canSort = header.column.getCanSort();
                                        const sorted = header.column.getIsSorted();
                                        const columnMeta = getColumnMeta(header.column.columnDef.meta);

                                        return (
                                            <TableHeader
                                                key={header.id}
                                                className={clsx(
                                                    compact ? '!py-2.5' : '!py-3',
                                                    'text-xs font-medium text-zinc-500 dark:text-zinc-400',
                                                    alignClassName(columnMeta.align),
                                                    columnMeta.headerClassName,
                                                )}
                                            >
                                                {header.isPlaceholder ? null : canSort ? (
                                                    <button
                                                        type="button"
                                                        className={clsx(
                                                            'group/th inline-flex items-center gap-1.5 transition-colors',
                                                            sorted
                                                                ? 'text-zinc-900 dark:text-zinc-100'
                                                                : 'hover:text-zinc-700 dark:hover:text-zinc-200',
                                                            alignClassName(columnMeta.align),
                                                        )}
                                                        onClick={header.column.getToggleSortingHandler()}
                                                    >
                                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                                        <SortIndicator direction={sorted} />
                                                    </button>
                                                ) : (
                                                    flexRender(header.column.columnDef.header, header.getContext())
                                                )}
                                            </TableHeader>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableHead>

                        {showSkeleton ? (
                            <DataTableSkeleton columns={columns.length} compact={compact} />
                        ) : (
                            <TableBody>
                                {rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        className="group border-b border-zinc-950/5 transition-colors last:border-b-0 hover:bg-zinc-50/70 dark:border-white/5 dark:hover:bg-white/[0.02]"
                                    >
                                        {row.getVisibleCells().map((cell) => {
                                            const columnMeta = getColumnMeta(cell.column.columnDef.meta);

                                            return (
                                                <TableCell
                                                    key={cell.id}
                                                    className={clsx(
                                                        compact && '!py-3 align-middle',
                                                        alignClassName(columnMeta.align),
                                                        columnMeta.cellClassName,
                                                    )}
                                                >
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                ))}
                            </TableBody>
                        )}
                    </Table>
                </div>
            )}

            {meta && !isError && !showEmpty && !showSkeleton && (
                <DataTablePagination
                    meta={meta}
                    pageIndex={pagination.pageIndex}
                    pageSize={pagination.pageSize}
                    pageSizeOptions={perPageOptions}
                    isLoading={isFetching}
                    compact={compact}
                    onPageChange={(pageIndex) => table.setPageIndex(pageIndex)}
                    onPageSizeChange={(pageSize) => {
                        table.setPageSize(pageSize);
                        table.setPageIndex(0);
                    }}
                />
            )}
        </div>
    );
}
