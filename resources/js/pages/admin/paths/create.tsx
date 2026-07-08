import { PathPreviewCard } from '@/components/admin/path-curriculum';
import { PathForm } from '@/components/admin/path-form';
import { Button } from '@/components/catalyst/button';
import { Heading } from '@/components/catalyst/heading';
import { Text } from '@/components/catalyst/text';
import { useConfirmDialog } from '@/components/confirm-dialog';
import { useValidatedForm } from '@/hooks/use-validated-form';
import AppLayout from '@/layouts/app-layout';
import { formHasFileUpload } from '@/lib/inertia-upload';
import { slugifyName } from '@/lib/path-icons';
import { type BreadcrumbItem } from '@/types';
import { ArrowLeftIcon } from '@heroicons/react/20/solid';
import { Head } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Learning Paths', href: '/admin/paths' },
    { title: 'Create', href: '/admin/paths/create' },
];

export default function AdminPathsCreate() {
    const [slugTouched, setSlugTouched] = useState(false);
    const { confirm, ConfirmDialog } = useConfirmDialog();

    const { data, setData, post, processing, errors } = useValidatedForm({
        name: '',
        slug: '',
        description: '',
        icon: 'code-bracket',
        is_active: true,
        sort_order: 0,
        cover_image: null as File | null,
        remove_cover: false,
    });

    const handleNameChange = (name: string) => {
        setData('name', name);

        if (!slugTouched) {
            setData('slug', slugifyName(name));
        }
    };

    const handleSlugChange = (slug: string) => {
        setSlugTouched(true);
        setData('slug', slug);
    };

    const submit: FormEventHandler = async (e) => {
        e.preventDefault();

        const confirmed = await confirm({
            title: 'Create learning path?',
            description: 'A new path will be added to the catalog. You can build levels and content on the next screen.',
            confirmLabel: 'Create path',
        });

        if (confirmed) {
            post(route('admin.paths.store'), {
                forceFormData: formHasFileUpload(data as Record<string, unknown>),
                successToast: { title: 'Learning path created', message: 'You can now build the curriculum.' },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Learning Path" />
            <ConfirmDialog />

            <Button href={route('admin.paths.index')} plain className="mb-4">
                <ArrowLeftIcon data-slot="icon" />
                Back to paths
            </Button>

            <Heading>Create learning path</Heading>
            <Text className="mt-2 max-w-2xl">
                Step 1 of 2 — Set up catalog details and cover image. Step 2 — Build levels, materials, videos, and quizzes.
            </Text>

            <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_22rem]">
                <PathForm
                    data={data}
                    errors={errors}
                    processing={processing}
                    submitLabel="Create path & build curriculum"
                    onSubmit={submit}
                    onNameChange={handleNameChange}
                    onSlugChange={handleSlugChange}
                    setData={setData}
                    cancelHref={route('admin.paths.index')}
                />

                <aside className="space-y-4 xl:sticky xl:top-6 xl:self-start">
                    <PathPreviewCard
                        name={data.name}
                        description={data.description}
                        icon={data.icon}
                        coverPreviewFile={data.cover_image}
                        isActive={data.is_active}
                    />
                    <div className="rounded-xl border border-zinc-950/10 bg-zinc-50 p-5 text-sm text-zinc-600 dark:border-white/10 dark:bg-zinc-800/50 dark:text-zinc-300">
                        <p className="font-semibold text-zinc-950 dark:text-white">After you create the path</p>
                        <ol className="mt-3 list-decimal space-y-2 pl-4">
                            <li>
                                Open the <strong>Curriculum</strong> tab
                            </li>
                            <li>Add levels (or use seeded levels)</li>
                            <li>Edit each level: overview → materials → videos → quiz</li>
                            <li>Mark the correct answer on every quiz question</li>
                            <li>Enroll interns from Enrollments</li>
                        </ol>
                    </div>
                </aside>
            </div>
        </AppLayout>
    );
}
