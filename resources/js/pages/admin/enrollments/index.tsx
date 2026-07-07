import { Badge } from '@/components/catalyst/badge';
import { FormField } from '@/components/form/form-field';
import { useConfirmDialog } from '@/components/confirm-dialog';
import { Button } from '@/components/catalyst/button';
import { Label } from '@/components/catalyst/fieldset';
import { Heading } from '@/components/catalyst/heading';
import { Combobox, ComboboxDescription, ComboboxLabel, ComboboxOption } from '@/components/catalyst/combobox';
import { Listbox, ListboxOption } from '@/components/catalyst/listbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/catalyst/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type Enrollment, type LearningPath, type PaginatedCollection } from '@/types/learning';
import { Head } from '@inertiajs/react';
import { useValidatedForm } from '@/hooks/use-validated-form';
import { FormEventHandler, useMemo } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Enrollments', href: '/admin/enrollments' },
];

interface UserOption {
    id: number;
    name: string;
    email: string;
}

interface Props {
    enrollments: PaginatedCollection<Enrollment>;
    interns: UserOption[];
    mentors: UserOption[];
    paths: Pick<LearningPath, 'id' | 'name'>[];
}

export default function AdminEnrollmentsIndex({ enrollments, interns, mentors, paths }: Props) {
    const { confirm, ConfirmDialog } = useConfirmDialog();
    const { data, setData, post, processing, errors, reset } = useValidatedForm({
        user_id: '',
        learning_path_id: '',
        mentor_id: '',
    });

    const selectedIntern = useMemo(
        () => interns.find((intern) => String(intern.id) === data.user_id) ?? null,
        [interns, data.user_id],
    );

    const selectedMentor = useMemo(
        () => mentors.find((mentor) => String(mentor.id) === data.mentor_id) ?? null,
        [mentors, data.mentor_id],
    );

    const submit: FormEventHandler = async (e) => {
        e.preventDefault();

        const internName = selectedIntern?.name ?? 'this intern';
        const pathName = paths.find((path) => String(path.id) === data.learning_path_id)?.name ?? 'the selected path';

        const confirmed = await confirm({
            title: 'Enroll intern?',
            description: `${internName} will be enrolled in ${pathName} and can start the learning path.`,
            confirmLabel: 'Enroll',
        });

        if (confirmed) {
            post(route('admin.enrollments.store'), {
                onSuccess: () => reset(),
                successToast: { title: 'Intern enrolled', message: `${internName} can now access ${pathName}.` },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Enrollments" />
            <ConfirmDialog />
            <Heading>Enrollments</Heading>

            <form onSubmit={submit} className="mt-6 grid max-w-4xl gap-4 rounded-lg border border-zinc-200 p-4 sm:grid-cols-4 dark:border-zinc-700">
                <FormField error={errors.user_id}>
                    <Label>Intern</Label>
                    <Combobox
                        value={selectedIntern}
                        onChange={(intern) => setData('user_id', intern ? String(intern.id) : '')}
                        options={interns}
                        displayValue={(intern) => intern?.name}
                        placeholder="Search intern…"
                    >
                        {(intern) => (
                            <ComboboxOption key={intern.id} value={intern}>
                                <ComboboxLabel>{intern.name}</ComboboxLabel>
                                <ComboboxDescription>{intern.email}</ComboboxDescription>
                            </ComboboxOption>
                        )}
                    </Combobox>
                </FormField>
                <FormField error={errors.learning_path_id}>
                    <Label>Path</Label>
                    <Listbox
                        value={data.learning_path_id ? Number(data.learning_path_id) : null}
                        onChange={(pathId) => setData('learning_path_id', pathId ? String(pathId) : '')}
                        placeholder="Select path"
                    >
                        {paths.map((path) => (
                            <ListboxOption key={path.id} value={path.id}>
                                {path.name}
                            </ListboxOption>
                        ))}
                    </Listbox>
                </FormField>
                <FormField error={errors.mentor_id}>
                    <Label>Mentor</Label>
                    <Combobox
                        value={selectedMentor}
                        onChange={(mentor) => setData('mentor_id', mentor ? String(mentor.id) : '')}
                        options={mentors}
                        displayValue={(mentor) => mentor?.name}
                        placeholder="Optional mentor…"
                    >
                        {(mentor) => (
                            <ComboboxOption key={mentor.id} value={mentor}>
                                <ComboboxLabel>{mentor.name}</ComboboxLabel>
                                <ComboboxDescription>{mentor.email}</ComboboxDescription>
                            </ComboboxOption>
                        )}
                    </Combobox>
                </FormField>
                <div className="flex items-end">
                    <Button type="submit" disabled={processing}>
                        Enroll
                    </Button>
                </div>
            </form>

            <Table className="mt-8">
                <TableHead>
                    <TableRow>
                        <TableHeader>Intern</TableHeader>
                        <TableHeader>Path</TableHeader>
                        <TableHeader>Mentor</TableHeader>
                        <TableHeader>Progress</TableHeader>
                        <TableHeader>Status</TableHeader>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {enrollments.data.map((e) => (
                        <TableRow key={e.id}>
                            <TableCell>{e.user?.name}</TableCell>
                            <TableCell>{e.learning_path?.name}</TableCell>
                            <TableCell>{e.mentor?.name ?? '—'}</TableCell>
                            <TableCell>{e.progress_percentage}%</TableCell>
                            <TableCell>
                                <Badge color={e.status === 'completed' ? 'green' : 'blue'}>{e.status}</Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </AppLayout>
    );
}
