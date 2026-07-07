import { Badge } from '@/components/catalyst/badge';
import { Heading } from '@/components/catalyst/heading';
import { TextLink } from '@/components/catalyst/text';
import { ProgressBar } from '@/components/learning/progress-bar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/catalyst/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type Enrollment, type PaginatedCollection } from '@/types/learning';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'My Interns', href: '/mentor/interns' },
];

interface Props {
    interns: PaginatedCollection<Enrollment>;
}

export default function MentorInternsIndex({ interns }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Interns" />
            <Heading>Assigned interns</Heading>

            <Table className="mt-6">
                <TableHead>
                    <TableRow>
                        <TableHeader>Intern</TableHeader>
                        <TableHeader>Path</TableHeader>
                        <TableHeader>Progress</TableHeader>
                        <TableHeader>Status</TableHeader>
                        <TableHeader className="text-right">View</TableHeader>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {interns.data.map((e) => (
                        <TableRow key={e.id}>
                            <TableCell className="font-medium">{e.user?.name}</TableCell>
                            <TableCell>{e.learning_path?.name}</TableCell>
                            <TableCell>
                                <div className="w-32">
                                    <ProgressBar percentage={e.progress_percentage} />
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge color={e.status === 'completed' ? 'green' : 'blue'}>{e.status}</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <TextLink href={route('mentor.interns.show', e.user?.id)}>Details</TextLink>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </AppLayout>
    );
}
