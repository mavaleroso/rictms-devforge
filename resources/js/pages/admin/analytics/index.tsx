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

interface CapstoneAnalyticsSummary {
    active_projects: number;
    draft_projects: number;
    completed_projects: number;
    archived_projects?: number;
    pending_reviews: number;
    avg_mentor_score: number | null;
    rejection_rate: number;
    journal_hours_logged: number;
}

interface CapstoneByTemplate {
    title: string;
    total: number;
    completed: number;
    active: number;
}

interface Props {
    stats: AnalyticsSummary;
    trend: AnalyticsTrendPoint[];
    by_path: AnalyticsPathBreakdown[];
    capstone?: CapstoneAnalyticsSummary;
    capstone_by_template?: CapstoneByTemplate[];
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

export default function AdminAnalyticsIndex({ stats, trend, by_path, capstone, capstone_by_template }: Props) {
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

            {capstone && (
                <section className="mt-6 grid gap-4 lg:grid-cols-3">
                    <div className="rounded-xl border border-zinc-950/10 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-zinc-900 lg:col-span-2">
                        <p className="text-xs font-semibold text-zinc-950 dark:text-white">Capstone</p>
                        <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
                            {[
                                { label: 'Active', value: capstone.active_projects },
                                { label: 'Draft', value: capstone.draft_projects },
                                { label: 'Completed', value: capstone.completed_projects },
                                { label: 'Pending reviews', value: capstone.pending_reviews },
                                { label: 'Avg score', value: capstone.avg_mentor_score ?? '—' },
                                { label: 'Rejection rate', value: `${capstone.rejection_rate}%` },
                                { label: 'Journal hours', value: capstone.journal_hours_logged },
                            ].map((item) => (
                                <div key={item.label} className="rounded-lg border border-zinc-950/5 bg-zinc-50/80 px-3 py-2 dark:border-white/5 dark:bg-zinc-800/40">
                                    <p className="text-[10px] font-semibold tracking-wide text-zinc-500 uppercase">{item.label}</p>
                                    <p className="mt-1 text-lg font-bold tabular-nums text-zinc-950 dark:text-white">{item.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="rounded-xl border border-zinc-950/10 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-zinc-900">
                        <p className="text-xs font-semibold text-zinc-950 dark:text-white">By template</p>
                        <ul className="mt-4 space-y-3">
                            {(capstone_by_template ?? []).length === 0 ? (
                                <li className="text-xs text-zinc-500">No capstone projects yet.</li>
                            ) : (
                                (capstone_by_template ?? []).map((item) => (
                                    <li key={item.title} className="flex items-start justify-between gap-3 border-b border-zinc-950/5 pb-3 last:border-0 last:pb-0 dark:border-white/5">
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-medium text-zinc-950 dark:text-white">{item.title}</p>
                                            <p className="text-[11px] text-zinc-500">
                                                {item.active} active · {item.completed} completed
                                            </p>
                                        </div>
                                        <span className="shrink-0 text-sm font-semibold tabular-nums text-zinc-950 dark:text-white">{item.total}</span>
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                </section>
            )}

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
