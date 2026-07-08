import { BadgeGrid, StreakCard } from '@/components/gamification/badge-grid';
import { LeaderboardTable } from '@/components/gamification/leaderboard-table';
import { XpProgressCard } from '@/components/gamification/xp-progress-card';
import { Heading } from '@/components/catalyst/heading';
import { Text } from '@/components/catalyst/text';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { GamificationProfile, LeaderboardData } from '@/types/gamification';
import { FireIcon, TrophyIcon } from '@heroicons/react/20/solid';
import { Head, usePage } from '@inertiajs/react';
import type { SharedData } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Learn', href: '/learn/paths' },
    { title: 'Leaderboard', href: '/learn/leaderboard' },
];

interface Props {
    leaderboard: LeaderboardData;
    gamification: GamificationProfile;
    enrolled_path_id: number | null;
}

export default function LeaderboardIndex({ leaderboard, gamification, enrolled_path_id }: Props) {
    const { auth } = usePage<SharedData>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Leaderboard" />

            <div className="space-y-8">
                <section className="relative overflow-hidden rounded-2xl border border-zinc-950/10 bg-gradient-to-br from-amber-50 via-white to-violet-50 p-6 dark:border-white/10 dark:from-amber-950/20 dark:via-zinc-900 dark:to-violet-950/30 sm:p-8">
                    <div className="pointer-events-none absolute -right-16 -bottom-16 size-48 rounded-full bg-amber-400/10 blur-3xl" aria-hidden />
                    <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-500/20 dark:text-amber-300">
                                <TrophyIcon className="size-3.5" />
                                {leaderboard.scope === 'path' ? 'Cohort rankings' : 'Global rankings'}
                            </span>
                            <Heading className="mt-3">Leaderboard</Heading>
                            <Text className="mt-2 max-w-xl">
                                Compete with fellow interns on weekly XP and lifetime totals. Stay consistent to climb
                                the ranks and protect your streak.
                            </Text>
                        </div>
                        <div className="grid grid-cols-2 gap-3 sm:min-w-[240px]">
                            <div className="rounded-xl border border-zinc-950/5 bg-white/80 p-3 dark:border-white/10 dark:bg-zinc-900/80">
                                <p className="text-[10px] font-semibold tracking-wide text-zinc-500 uppercase">All-time rank</p>
                                <p className="mt-1 text-2xl font-bold text-zinc-950 dark:text-white">
                                    {leaderboard.viewer.all_time_rank ? `#${leaderboard.viewer.all_time_rank}` : '—'}
                                </p>
                            </div>
                            <div className="rounded-xl border border-zinc-950/5 bg-white/80 p-3 dark:border-white/10 dark:bg-zinc-900/80">
                                <p className="text-[10px] font-semibold tracking-wide text-zinc-500 uppercase">This week</p>
                                <p className="mt-1 text-2xl font-bold text-zinc-950 dark:text-white">
                                    {leaderboard.viewer.weekly_rank ? `#${leaderboard.viewer.weekly_rank}` : '—'}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="grid gap-6 xl:grid-cols-3">
                    <div className="space-y-4 xl:col-span-1">
                        <XpProgressCard summary={gamification} compact />
                        <StreakCard summary={gamification} />
                        <div className="rounded-xl border border-zinc-950/10 bg-white p-4 dark:border-white/10 dark:bg-zinc-900">
                            <p className="text-xs font-semibold text-zinc-950 dark:text-white">Your weekly XP</p>
                            <p className="mt-1 text-2xl font-bold tabular-nums text-violet-600 dark:text-violet-400">
                                {leaderboard.viewer.weekly_xp.toLocaleString()}
                            </p>
                            <p className="mt-2 flex items-center gap-1 text-[11px] text-zinc-500">
                                <FireIcon className="size-3.5 text-orange-500" />
                                {gamification.current_streak} day streak · {gamification.badges_earned} badges
                            </p>
                        </div>
                    </div>

                    <div className="space-y-8 xl:col-span-2">
                        <section>
                            <div className="mb-3 flex items-center justify-between">
                                <h2 className="text-sm font-semibold text-zinc-950 dark:text-white">All-time top learners</h2>
                                {enrolled_path_id && (
                                    <span className="text-[11px] text-zinc-500">Scoped to your learning path</span>
                                )}
                            </div>
                            <LeaderboardTable
                                entries={leaderboard.all_time}
                                highlightUserId={auth.user.id}
                            />
                        </section>

                        <section>
                            <div className="mb-3">
                                <h2 className="text-sm font-semibold text-zinc-950 dark:text-white">This week</h2>
                                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                                    Rankings based on XP earned in the last 7 days
                                </p>
                            </div>
                            <LeaderboardTable entries={leaderboard.weekly} xpLabel="Weekly XP" highlightUserId={auth.user.id} />
                        </section>
                    </div>
                </div>

                <section className="rounded-2xl border border-zinc-950/10 bg-white p-5 dark:border-white/10 dark:bg-zinc-900">
                    <div className="mb-4">
                        <h2 className="text-sm font-semibold text-zinc-950 dark:text-white">All achievements</h2>
                        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                            Unlock badges by completing milestones, maintaining streaks, and mastering assessments.
                        </p>
                    </div>
                    <BadgeGrid badges={gamification.badges} />
                </section>
            </div>
        </AppLayout>
    );
}
