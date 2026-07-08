import { TableBody, TableCell, TableRow } from '@/components/catalyst/table';
import clsx from 'clsx';

interface DataTableSkeletonProps {
    columns: number;
    rows?: number;
    compact?: boolean;
}

const widthPattern = ['w-[72%]', 'w-[55%]', 'w-[80%]', 'w-[48%]', 'w-[62%]', 'w-[36%]'];

export function DataTableSkeleton({ columns, rows = 6, compact = true }: DataTableSkeletonProps) {
    return (
        <TableBody>
            {Array.from({ length: rows }).map((_, rowIndex) => (
                <TableRow key={rowIndex} className="pointer-events-none">
                    {Array.from({ length: columns }).map((__, columnIndex) => (
                        <TableCell key={columnIndex} className={clsx(compact && '!py-3')}>
                            <div
                                className={clsx(
                                    'h-3.5 animate-pulse rounded-md bg-zinc-200/80 dark:bg-zinc-700/80',
                                    widthPattern[(rowIndex + columnIndex) % widthPattern.length],
                                    columnIndex === 0 && 'h-8 w-40 max-w-full',
                                )}
                            />
                        </TableCell>
                    ))}
                </TableRow>
            ))}
        </TableBody>
    );
}
