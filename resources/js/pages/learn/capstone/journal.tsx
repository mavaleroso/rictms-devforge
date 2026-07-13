import { CapstoneNav } from '@/components/capstone/capstone-nav';
import { Badge } from '@/components/catalyst/badge';
import { Button } from '@/components/catalyst/button';
import { FormField } from '@/components/form/form-field';
import { Textarea } from '@/components/catalyst/textarea';
import { Input } from '@/components/catalyst/input';
import { Heading } from '@/components/catalyst/heading';
import { MOOD_LABEL } from '@/lib/capstone-labels';
import AppLayout from '@/layouts/app-layout';
import { useValidatedForm } from '@/hooks/use-validated-form';
import type { BreadcrumbItem } from '@/types';
import type { CapstoneProject, JournalEntry, JournalMood } from '@/types/capstone';
import { Head } from '@inertiajs/react';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Learn', href: '/learn/paths' },
    { title: 'Capstone', href: '/learn/capstone' },
    { title: 'Journal', href: '/learn/capstone/journal' },
];

interface Props {
    project: { data: CapstoneProject };
    entries: { data: JournalEntry[] };
    milestones: { id: number; title: string }[];
    today: string;
}

export default function CapstoneJournal({ project: projectProp, entries: entriesProp, milestones, today }: Props) {
    const project = projectProp.data;
    const entries = entriesProp.data;

    const form = useValidatedForm({
        entry_date: today,
        content: '',
        mood: '' as JournalMood | '',
        hours_spent: '',
        milestone_id: '' as string | number,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        form.transform((data) => ({
            ...data,
            milestone_id: data.milestone_id === '' ? null : Number(data.milestone_id),
            mood: data.mood || null,
            hours_spent: data.hours_spent === '' ? null : data.hours_spent,
        }));
        form.post(route('learn.capstone.journal.store'), {
            onSuccess: () => form.setData('content', ''),
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Daily journal" />

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <Heading>Daily journal</Heading>
                <CapstoneNav current="journal" />
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
                <form onSubmit={submit} className="rounded-xl border border-zinc-950/10 bg-white p-4 dark:border-white/10 dark:bg-zinc-900">
                    <h2 className="text-sm font-semibold text-zinc-950 dark:text-white">Log today</h2>
                    <p className="mt-1 text-xs text-zinc-500">Tag entries to a milestone so mentors see them during review.</p>
                    <div className="mt-3 space-y-3">
                        <FormField label="Date" error={form.errors.entry_date}>
                            <Input type="date" value={form.data.entry_date} onChange={(e) => form.setData('entry_date', e.target.value)} />
                        </FormField>
                        <FormField label="Related milestone">
                            <select
                                value={form.data.milestone_id}
                                onChange={(e) => form.setData('milestone_id', e.target.value ? Number(e.target.value) : '')}
                                className="w-full rounded-lg border border-zinc-950/10 px-3 py-2 text-sm dark:border-white/10 dark:bg-zinc-950"
                            >
                                <option value="">General / untagged</option>
                                {milestones.map((m) => (
                                    <option key={m.id} value={m.id}>
                                        {m.title}
                                    </option>
                                ))}
                            </select>
                        </FormField>
                        <FormField label="Mood">
                            <select
                                value={form.data.mood}
                                onChange={(e) => form.setData('mood', e.target.value as JournalMood | '')}
                                className="w-full rounded-lg border border-zinc-950/10 px-3 py-2 text-sm dark:border-white/10 dark:bg-zinc-950"
                            >
                                <option value="">Select mood</option>
                                {(Object.entries(MOOD_LABEL) as [JournalMood, string][]).map(([value, label]) => (
                                    <option key={value} value={value}>
                                        {label}
                                    </option>
                                ))}
                            </select>
                        </FormField>
                        <FormField label="Hours spent" error={form.errors.hours_spent}>
                            <Input type="number" step="0.5" min="0" max="24" value={form.data.hours_spent} onChange={(e) => form.setData('hours_spent', e.target.value)} />
                        </FormField>
                        <FormField label="What did you accomplish?" error={form.errors.content}>
                            <Textarea rows={5} value={form.data.content} onChange={(e) => form.setData('content', e.target.value)} placeholder="Shipped auth flow, fixed deployment pipeline..." />
                        </FormField>
                    </div>
                    <Button type="submit" className="mt-4" disabled={form.processing}>
                        Save entry
                    </Button>
                </form>

                <section className="space-y-3">
                    <h2 className="text-sm font-semibold text-zinc-950 dark:text-white">Recent entries</h2>
                    {entries.length === 0 ? (
                        <p className="rounded-xl border border-dashed border-zinc-300 px-4 py-8 text-center text-sm text-zinc-500 dark:border-zinc-600">
                            No journal entries yet. Log your first day of capstone work.
                        </p>
                    ) : (
                        entries.map((entry) => (
                            <article key={entry.id} className="rounded-xl border border-zinc-950/10 bg-white p-4 dark:border-white/10 dark:bg-zinc-900">
                                <div className="flex flex-wrap items-center gap-2">
                                    <p className="text-xs font-semibold text-zinc-950 dark:text-white">{entry.entry_date}</p>
                                    {entry.mood && <Badge color="zinc">{MOOD_LABEL[entry.mood]}</Badge>}
                                    {entry.milestone && <Badge color="blue">{entry.milestone.title}</Badge>}
                                    {entry.hours_spent && (
                                        <span className="text-[11px] text-zinc-500">{entry.hours_spent}h logged</span>
                                    )}
                                </div>
                                <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-600 dark:text-zinc-300">{entry.content}</p>
                            </article>
                        ))
                    )}
                </section>
            </div>
        </AppLayout>
    );
}
