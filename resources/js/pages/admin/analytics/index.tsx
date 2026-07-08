import { CompletionChart, PathBreakdown } from '@/components/analytics/completion-chart';
import { Badge } from '@/components/catalyst/badge';
import { Button } from '@/components/catalyst/button';
import { DataTableMetaText, ServerDataTable, type DataTableColumnMeta } from '@/components/data-table';
import { MentorPageHero } from '@/components/mentor/mentor-page-hero';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import type { AnalyticsPathBreakdown, AnalyticsSummary, AnalyticsTrendPoint, Certificate } from '@/types/certificate';
import { ArrowDownTrayIcon, ChartBarIcon } from '@heroicons/react/20/solid';
import { Head } from '@inertiajs/react';
import { type ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Analytics', href: '/admin/analytics' },
];

interface Props {
    stats: AnalyticsSummary;
    trend: AnalyticsTrendPoint[];
    by_path: AnalyticsPathBreakdown[];
}

function formatDate(value?: string | null): string {
    if (!value) return '—';
    return new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function useCertificateColumns(): ColumnDef<Certificate, unknown>[] {
    return useMemo(
        () => [
            {
                id: 'intern',
                header: 'Intern',
                enableSorting: false,
                cell: ({ row }) => (
                    <DataTableMetaText
                        primary={row.original.user?.name ?? '—'}
                        secondary={row.original.user?.email}
                    />
                ),
            },
            {
                id: 'path',
                header: 'Path',
                enableSorting: false,
                cell: ({ row }) => (
                    <DataTableMetaText
                        primary={row.original.learning_path?.name ?? '—'}
                        secondary={row.original.certificate_number}
                    />
                ),
            },
            {
                id: 'issued_at',
                header: 'Issued',
                enableSorting: true,
                meta: { align: 'right', cellClassName: 'tabular-nums' } satisfies DataTableColumnMeta,
                cell: ({ row }) => (
                    <span className="text-xs text-zinc-600 dark:text-zinc-300">{formatDate(row.original.issued_at)}</span>
                ),
            },
            {
                id: 'verify',
                header: '',
                enableSorting: false,
                meta: { align: 'right' } satisfies DataTableColumnMeta,
                cell: ({ row }) => (
                    <Badge color="blue" className="font-mono text-[10px]">
                        {row.original.verification_code.slice(0, 8)}…
                    </Badge>
                ),
            },
        ],
        [],
    );
}

export default function AdminAnalyticsIndex({ stats, trend, by_path }: Props) {
    const columns = useCertificateColumns();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Analytics" />

            <MentorPageHero
                icon={ChartBarIcon}
                iconClassName="bg-emerald-600"
                title="Completion analytics"
                description="Track program outcomes, issued certificates, and export completion records for reporting."
                stats={[
                    { label: 'Completion rate', value: `${stats.completion_rate}%`, accent: 'lime' },
                    { label: 'Certificates', value: stats.certificates_issued, accent: 'blue' },
                    { label: 'This month', value: stats.certificates_this_month, accent: 'default' },
                    {
                        label: 'Avg days',
                        value: stats.avg_days_to_complete ?? '—',
                        accent: 'default',
                    },
                ]}
            >
                <Button href={route('admin.analytics.export')} outline className="!text-xs">
                    <ArrowDownTrayIcon data-slot="icon" />
                    Export CSV
                </Button>
            </MentorPageHero>

            <div className="mt-6 grid gap-4 lg:grid-cols-3">
                <div className="rounded-xl border border-zinc-950/10 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-zinc-900 lg:col-span-2">
                    <div className="mb-3 flex items-center justify-between">
                        <p className="text-xs font-semibold text-zinc-950 dark:text-white">6-month trend</p>
                        <div className="flex gap-3 text-[10px] text-zinc-500">
                            <span className="flex items-center gap-1">
                                <span className="size-2 rounded-sm bg-emerald-500" /> Completions
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="size-2 rounded-sm bg-blue-500" /> Certificates
                            </span>
                        </div>
                    </div>
                    <CompletionChart data={trend} />
                </div>
                <div className="rounded-xl border border-zinc-950/10 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-zinc-900">
                    <p className="text-xs font-semibold text-zinc-950 dark:text-white">By learning path</p>
                    <div className="mt-4">
                        <PathBreakdown items={by_path} />
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2 border-t border-zinc-950/5 pt-4 dark:border-white/5">
                        <div>
                            <p className="text-[10px] text-zinc-500 uppercase">Active</p>
                            <p className="text-lg font-bold tabular-nums">{stats.active_enrollments}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-zinc-500 uppercase">Completed</p>
                            <p className="text-lg font-bold tabular-nums">{stats.completed_enrollments}</p>
                        </div>
                    </div>
                </div>
            </div>

            <section className="mt-6">
                <ServerDataTable<Certificate>
                    title="Issued certificates"
                    description="Search by intern, path, or certificate number."
                    queryKey="admin.analytics.table"
                    fetchUrl={route('admin.analytics.table')}
                    searchPlaceholder="Search certificates..."
                    columns={columns}
                    emptyTitle="No certificates issued yet"
                    emptyDescription="Certificates are generated when interns complete their learning path."
                />
            </section>
        </AppLayout>
    );
}
