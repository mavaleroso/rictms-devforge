import { PathIconBadge } from '@/components/admin/path-icon';
import { PathForm } from '@/components/admin/path-form';
import { AddLevelForm } from '@/components/admin/add-level-form';
import { PathCurriculum, PathStatsGrid } from '@/components/admin/path-curriculum';
import { useConfirmDialog } from '@/components/confirm-dialog';
import { Badge } from '@/components/catalyst/badge';
import { Button } from '@/components/catalyst/button';
import { Heading, Subheading } from '@/components/catalyst/heading';
import { Text } from '@/components/catalyst/text';
import AppLayout from '@/layouts/app-layout';
import { useCoverImagePreview } from '@/hooks/use-cover-image-preview';
import { formHasFileUpload, submitMultipartPatch } from '@/lib/inertia-upload';
import { slugifyName } from '@/lib/path-icons';
import { type BreadcrumbItem } from '@/types';
import { type LearningPath } from '@/types/learning';
import { ArrowLeftIcon } from '@heroicons/react/20/solid';
import { Head } from '@inertiajs/react';
import { useValidatedForm } from '@/hooks/use-validated-form';
import { FormEventHandler, useState } from 'react';

interface Props {
    path: { data: LearningPath };
}

type EditTab = 'details' | 'curriculum';

export default function AdminPathsEdit({ path: pathProp }: Props) {
    const path = pathProp.data;
    const [tab, setTab] = useState<EditTab>('curriculum');
    const [slugTouched, setSlugTouched] = useState(false);
    const [showAddLevel, setShowAddLevel] = useState(false);
    const { confirm, ConfirmDialog } = useConfirmDialog();

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Learning Paths', href: '/admin/paths' },
        { title: path.name, href: route('admin.paths.edit', path.id) },
    ];

    const form = useValidatedForm({
        name: path.name,
        slug: path.slug,
        description: path.description ?? '',
        icon: path.icon ?? 'code-bracket',
        is_active: path.is_active,
        sort_order: path.sort_order ?? 0,
        cover_image: null as File | null,
        remove_cover: false,
    });

    const { data, setData, patch, processing, errors } = form;

    const coverDisplayUrl = useCoverImagePreview(data.cover_image, path.cover_image_url, data.remove_cover);

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

    const savePath = () => {
        const onSuccess = () => {
            setData('cover_image', null);
            setData('remove_cover', false);
        };

        const hasCoverFile = formHasFileUpload(data as Record<string, unknown>);
        const removingCover = data.remove_cover;

        // PHP does not parse multipart uploads on PATCH — spoof via POST when files are involved.
        if (hasCoverFile || removingCover) {
            submitMultipartPatch(form, route('admin.paths.update', path.id), {
                onSuccess,
                successToast: { title: 'Path settings saved', message: 'Your changes have been updated.' },
            });
            return;
        }

        patch(route('admin.paths.update', path.id), {
            onSuccess,
            successToast: { title: 'Path settings saved', message: 'Your changes have been updated.' },
        });
    };

    const submit: FormEventHandler = async (e) => {
        e.preventDefault();

        const confirmed = await confirm({
            title: 'Save path settings?',
            description: 'Your changes to name, description, cover image, and publishing options will be updated.',
            confirmLabel: 'Save changes',
        });

        if (confirmed) {
            savePath();
        }
    };

    const levelsCount = path.levels?.length ?? path.levels_count ?? 0;
    const enrollmentsCount = path.enrollments_count ?? 0;
    const totalMinutes = path.total_estimated_minutes ?? path.levels?.reduce((sum, level) => sum + level.estimated_minutes, 0) ?? 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${path.name}`} />
            <ConfirmDialog />

            <Button href={route('admin.paths.index')} plain className="mb-4">
                <ArrowLeftIcon data-slot="icon" />
                All paths
            </Button>

            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex gap-4">
                    {coverDisplayUrl ? (
                        <img
                            src={coverDisplayUrl}
                            alt=""
                            className="size-20 shrink-0 rounded-2xl object-cover ring-1 ring-zinc-950/10 dark:ring-white/10"
                        />
                    ) : (
                        <PathIconBadge icon={data.icon || path.icon} className="size-14 rounded-2xl" />
                    )}
                    <div>
                        <div className="flex flex-wrap items-center gap-3">
                            <Heading>{data.name || path.name}</Heading>
                            <Badge color={data.is_active ? 'green' : 'zinc'}>{data.is_active ? 'Published' : 'Draft'}</Badge>
                        </div>
                        <Text className="mt-1">
                            <code className="text-zinc-600 dark:text-zinc-300">{data.slug || path.slug}</code>
                        </Text>
                        {(data.description || path.description) && (
                            <Text className="mt-2 max-w-2xl">{data.description || path.description}</Text>
                        )}
                    </div>
                </div>

                <PathStatsGrid
                    levelsCount={levelsCount}
                    enrollmentsCount={enrollmentsCount}
                    totalMinutes={totalMinutes}
                    isActive={path.is_active}
                />
            </div>

            <div className="mt-8 flex flex-wrap gap-2 border-b border-zinc-200 pb-3 dark:border-zinc-700">
                <Button type="button" color={tab === 'curriculum' ? 'dark/zinc' : undefined} plain={tab !== 'curriculum'} onClick={() => setTab('curriculum')}>
                    Curriculum
                </Button>
                <Button type="button" color={tab === 'details' ? 'dark/zinc' : undefined} plain={tab !== 'details'} onClick={() => setTab('details')}>
                    Path settings
                </Button>
            </div>

            {tab === 'details' && (
                <div className="mt-6 max-w-3xl">
                    <PathForm
                        data={data}
                        errors={errors}
                        processing={processing}
                        submitLabel="Save changes"
                        onSubmit={submit}
                        onNameChange={handleNameChange}
                        onSlugChange={handleSlugChange}
                        setData={setData}
                        existingCoverUrl={path.cover_image_url}
                    />
                </div>
            )}

            {tab === 'curriculum' && (
                <div className="mt-6">
                    <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <Subheading>Level curriculum</Subheading>
                            <Text className="mt-1">Each level unlocks sequentially. Edit content to add materials, videos, and assessments.</Text>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Button href={route('admin.enrollments.index')} outline>
                                Manage enrollments
                            </Button>
                            <Button type="button" onClick={() => setShowAddLevel((value) => !value)}>
                                {showAddLevel ? 'Hide form' : 'Add level'}
                            </Button>
                        </div>
                    </div>
                    {showAddLevel && (
                        <div className="mb-6">
                            <AddLevelForm pathId={path.id} nextNumber={levelsCount + 1} onCancel={() => setShowAddLevel(false)} />
                        </div>
                    )}
                    <PathCurriculum path={path} />
                </div>
            )}
        </AppLayout>
    );
}
