import { FormField } from '@/components/form/form-field';
import { useConfirmDialog } from '@/components/confirm-dialog';
import { Button } from '@/components/catalyst/button';
import { Combobox, ComboboxDescription, ComboboxLabel, ComboboxOption } from '@/components/catalyst/combobox';
import { Label } from '@/components/catalyst/fieldset';
import { Listbox, ListboxOption } from '@/components/catalyst/listbox';
import { useValidatedForm } from '@/hooks/use-validated-form';
import { formatDisplayName } from '@/lib/user-profile';
import { queryClient } from '@/lib/query-client';
import { type LearningPath } from '@/types/learning';
import {
    AcademicCapIcon,
    ArrowRightIcon,
    BookOpenIcon,
    UserGroupIcon,
    UserPlusIcon,
} from '@heroicons/react/20/solid';
import { FormEventHandler, useMemo } from 'react';

interface PersonOption {
    id: number;
    name: string;
    first_name?: string | null;
    middle_name?: string | null;
    last_name?: string | null;
    email: string;
}

interface EnrollmentFormPanelProps {
    interns: PersonOption[];
    mentors: PersonOption[];
    paths: Pick<LearningPath, 'id' | 'name'>[];
}

function personLabel(person: PersonOption): string {
    return formatDisplayName(person);
}

export function EnrollmentFormPanel({ interns, mentors, paths }: EnrollmentFormPanelProps) {
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

    const selectedPath = useMemo(
        () => paths.find((path) => String(path.id) === data.learning_path_id) ?? null,
        [paths, data.learning_path_id],
    );

    const submit: FormEventHandler = async (event) => {
        event.preventDefault();

        const internName = selectedIntern ? personLabel(selectedIntern) : 'this intern';
        const pathName = selectedPath?.name ?? 'the selected path';
        const mentorName = selectedMentor ? personLabel(selectedMentor) : null;

        const confirmed = await confirm({
            title: 'Confirm enrollment',
            description: mentorName
                ? `${internName} will be enrolled in ${pathName} with ${mentorName} as mentor.`
                : `${internName} will be enrolled in ${pathName} without an assigned mentor.`,
            confirmLabel: 'Enroll intern',
            tone: 'success',
        });

        if (confirmed) {
            post(route('admin.enrollments.store'), {
                onSuccess: () => {
                    reset();
                    queryClient.invalidateQueries({ queryKey: ['admin.enrollments.table'] });
                },
                successToast: {
                    title: 'Enrollment created',
                    message: `${internName} can now access ${pathName}.`,
                },
            });
        }
    };

    const canSubmit = Boolean(data.user_id && data.learning_path_id);

    return (
        <>
            <ConfirmDialog />
            <section className="overflow-hidden rounded-2xl border border-zinc-950/10 bg-white shadow-sm dark:border-white/10 dark:bg-zinc-900">
                <div className="border-b border-zinc-950/8 bg-gradient-to-r from-violet-50/80 via-white to-blue-50/50 px-5 py-4 dark:border-white/8 dark:from-violet-950/20 dark:via-zinc-900 dark:to-blue-950/20 sm:px-6">
                    <div className="flex items-start gap-3">
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white shadow-sm">
                            <UserPlusIcon className="size-5" />
                        </span>
                        <div>
                            <h2 className="text-sm font-semibold text-zinc-950 dark:text-white">New enrollment</h2>
                            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                                Place an intern on a learning path and optionally assign a mentor to guide their progress.
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={submit} className="p-5 sm:p-6">
                    <div className="grid gap-5 lg:grid-cols-3">
                        <FormField error={errors.user_id}>
                            <Label className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-zinc-500 uppercase">
                                <AcademicCapIcon className="size-3.5" />
                                Intern
                            </Label>
                            <Combobox
                                value={selectedIntern}
                                onChange={(intern) => setData('user_id', intern ? String(intern.id) : '')}
                                options={interns}
                                displayValue={(intern) => (intern ? personLabel(intern) : '')}
                                placeholder="Search intern..."
                                className="mt-2"
                            >
                                {(intern) => (
                                    <ComboboxOption key={intern.id} value={intern}>
                                        <ComboboxLabel>{personLabel(intern)}</ComboboxLabel>
                                        <ComboboxDescription>{intern.email}</ComboboxDescription>
                                    </ComboboxOption>
                                )}
                            </Combobox>
                        </FormField>

                        <FormField error={errors.learning_path_id}>
                            <Label className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-zinc-500 uppercase">
                                <BookOpenIcon className="size-3.5" />
                                Learning path
                            </Label>
                            <Listbox
                                value={data.learning_path_id ? Number(data.learning_path_id) : null}
                                onChange={(pathId) => setData('learning_path_id', pathId ? String(pathId) : '')}
                                placeholder="Select published path"
                                className="mt-2"
                            >
                                {paths.map((path) => (
                                    <ListboxOption key={path.id} value={path.id}>
                                        {path.name}
                                    </ListboxOption>
                                ))}
                            </Listbox>
                        </FormField>

                        <FormField error={errors.mentor_id}>
                            <Label className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-zinc-500 uppercase">
                                <UserGroupIcon className="size-3.5" />
                                Mentor
                                <span className="font-normal normal-case text-zinc-400">(optional)</span>
                            </Label>
                            <Combobox
                                value={selectedMentor}
                                onChange={(mentor) => setData('mentor_id', mentor ? String(mentor.id) : '')}
                                options={mentors}
                                displayValue={(mentor) => (mentor ? personLabel(mentor) : '')}
                                placeholder="Assign mentor..."
                                className="mt-2"
                            >
                                {(mentor) => (
                                    <ComboboxOption key={mentor.id} value={mentor}>
                                        <ComboboxLabel>{personLabel(mentor)}</ComboboxLabel>
                                        <ComboboxDescription>{mentor.email}</ComboboxDescription>
                                    </ComboboxOption>
                                )}
                            </Combobox>
                        </FormField>
                    </div>

                    <div className="mt-6 flex flex-col gap-3 border-t border-zinc-950/8 pt-5 sm:flex-row sm:items-center sm:justify-between dark:border-white/8">
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                            {canSubmit ? (
                                <>
                                    Ready to enroll{' '}
                                    <span className="font-medium text-zinc-700 dark:text-zinc-200">
                                        {selectedIntern ? personLabel(selectedIntern) : 'intern'}
                                    </span>{' '}
                                    in{' '}
                                    <span className="font-medium text-zinc-700 dark:text-zinc-200">
                                        {selectedPath?.name ?? 'path'}
                                    </span>
                                    .
                                </>
                            ) : (
                                'Select an intern and learning path to continue.'
                            )}
                        </p>

                        <Button type="submit" disabled={processing || !canSubmit}>
                            Enroll intern
                            <ArrowRightIcon data-slot="icon" />
                        </Button>
                    </div>
                </form>
            </section>
        </>
    );
}
