import { Badge } from '@/components/catalyst/badge';
import { Heading } from '@/components/catalyst/heading';
import { ProgressBar } from '@/components/learning/progress-bar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/catalyst/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type Enrollment } from '@/types/learning';
import { Head } from '@inertiajs/react';

interface LevelProgressRow {
    level_number: number;
    level_title: string;
    status: string;
    completed_at: string | null;
}

interface Props {
    enrollment: { data: Enrollment };
    level_progress: LevelProgressRow[];
}

export default function MentorInternsShow({ enrollment: enrollmentProp, level_progress }: Props) {
    const enrollment = enrollmentProp.data;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'My Interns', href: '/mentor/interns' },
        { title: enrollment.user?.name ?? 'Intern', href: route('mentor.interns.show', enrollment.user?.id) },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={enrollment.user?.name ?? 'Intern'} />

            <Heading>{enrollment.user?.name}</Heading>
            <p className="mt-1 text-sm text-zinc-500">{enrollment.user?.email}</p>

            <div className="mt-6 max-w-md">
                <p className="text-sm font-medium">{enrollment.learning_path?.name}</p>
                <ProgressBar percentage={enrollment.progress_percentage} label="Overall progress" />
            </div>

            <div className="mt-10">
                <Heading level={2}>Level progress</Heading>
                <Table className="mt-4">
                    <TableHead>
                        <TableRow>
                            <TableHeader>Level</TableHeader>
                            <TableHeader>Title</TableHeader>
                            <TableHeader>Status</TableHeader>
                            <TableHeader>Completed</TableHeader>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {level_progress.map((row) => (
                            <TableRow key={row.level_number}>
                                <TableCell>L{row.level_number}</TableCell>
                                <TableCell>{row.level_title}</TableCell>
                                <TableCell>
                                    <Badge>{row.status}</Badge>
                                </TableCell>
                                <TableCell>{row.completed_at ? new Date(row.completed_at).toLocaleDateString() : '—'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </AppLayout>
    );
}
