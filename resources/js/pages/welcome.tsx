import { AnimatedGridBackground } from '@/components/marketing/animated-grid-background';
import { HeroCover } from '@/components/marketing/hero-cover';
import { LabShowcase } from '@/components/marketing/lab-showcase';
import { LandingHeader } from '@/components/marketing/landing-header';
import { LearningProcessTimeline } from '@/components/marketing/learning-process-timeline';
import { LearningTrackGrid } from '@/components/marketing/learning-track-grid';
import { Badge } from '@/components/catalyst/badge';
import { Button } from '@/components/catalyst/button';
import { PRACTICE_MODALITIES } from '@/lib/learning-process';
import { PLATFORM_HIGHLIGHTS } from '@/lib/learning-tracks';
import { accent, surfaces } from '@/lib/theme';
import { type SharedData } from '@/types';
import {
    AcademicCapIcon,
    CheckBadgeIcon,
    UserGroupIcon,
} from '@heroicons/react/20/solid';
import { Head, usePage } from '@inertiajs/react';
import clsx from 'clsx';

const highlightIcons = [AcademicCapIcon, CheckBadgeIcon, UserGroupIcon] as const;

const audiencePoints = [
  {
    title: 'For interns',
    items: [
      'Clear weekly goals across four ICT disciplines',
      'Labs and challenges that mirror real tickets',
      'XP, badges, and certificates you can show mentors',
    ],
  },
  {
    title: 'For mentors & leads',
    items: [
      'Completion and assessment analytics per cohort',
      'Review queues for challenges and capstone work',
      'Structured rubrics instead of ad-hoc check-ins',
    ],
  },
] as const;

export default function Welcome() {
    const { auth, name } = usePage<SharedData>().props;
    const isGuest = !auth.user;

    return (
        <>
            <Head title={`${name} — Learn programming, networking, DevOps, and cybersecurity`} />

            <div className="relative isolate flex min-h-screen flex-col text-slate-900 dark:text-slate-100">
                <AnimatedGridBackground />

                <LandingHeader isGuest={isGuest} />

                <main className="relative z-10 mx-auto w-full max-w-6xl flex-1 px-4 sm:px-6">
                    {/* Hero */}
                    <section className="grid items-center gap-8 py-8 sm:py-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-10">
                        <div>
                            <Badge color="zinc" className={clsx('mb-4', accent.bgSoft, accent.textSoft)}>
                                ICT skills academy
                            </Badge>
                            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-[2.5rem] lg:leading-tight dark:text-white">
                                Job-ready training across programming, networking, DevOps, and cybersecurity.
                            </h1>
                            <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-400">
                                {name} delivers structured learning paths with practical labs, assessments, and mentor
                                support—built for interns and teams who need realistic, hands-on skill development.
                            </p>
                            {isGuest && (
                                <div className="mt-6 flex flex-wrap gap-3">
                                    <Button href={route('register')} color="dark/zinc">
                                        Create free account
                                    </Button>
                                    <Button href={route('login')} outline>
                                        I already have an account
                                    </Button>
                                </div>
                            )}
                            <dl className="mt-8 grid grid-cols-3 gap-3 text-center sm:max-w-lg">
                                {[
                                    { label: 'Disciplines', value: '4' },
                                    { label: 'Path levels', value: '20+' },
                                    { label: 'Hands-on tasks', value: 'Labs' },
                                ].map((stat) => (
                                    <div
                                        key={stat.label}
                                        className={clsx('rounded-xl px-3 py-3', surfaces.cardMuted)}
                                    >
                                        <dt className="text-[10px] font-medium tracking-wide text-slate-500 uppercase">
                                            {stat.label}
                                        </dt>
                                        <dd className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">
                                            {stat.value}
                                        </dd>
                                    </div>
                                ))}
                            </dl>
                        </div>

                        <HeroCover />
                    </section>

                    {/* Learning paths */}
                    <section id="paths" className="scroll-mt-28 border-t border-slate-200/80 py-10 md:scroll-mt-20 dark:border-slate-800">
                        <div className="mb-6 max-w-2xl">
                            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                                Four disciplines. One consistent learning experience.
                            </h2>
                            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                                Whether you are writing APIs, tracing network faults, shipping pipelines, or hardening
                                systems, every path follows the same progression—from concepts to verified competence.
                            </p>
                        </div>
                        <LearningTrackGrid />
                    </section>

                    {/* How it works */}
                    <section id="process" className="scroll-mt-28 border-t border-slate-200/80 py-10 md:scroll-mt-20 dark:border-slate-800">
                        <div className="mb-8 max-w-2xl">
                            <Badge color="zinc" className={clsx('mb-3', accent.bgSoft, accent.textSoft)}>
                                How it works
                            </Badge>
                            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                                From enrollment to job-ready proof—in four steps.
                            </h2>
                            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                                The platform guides learners through a repeatable workflow mentors can trust. Steps cycle
                                automatically below, or click any step to explore.
                            </p>
                        </div>
                        <LearningProcessTimeline />
                    </section>

                    {/* Practice modalities */}
                    <section id="practice" className="scroll-mt-28 border-t border-slate-200/80 py-10 md:scroll-mt-20 dark:border-slate-800">
                        <div className="mb-6 max-w-2xl">
                            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                                Practice that mirrors the job—not just slide decks.
                            </h2>
                            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                                Every level mixes content types so interns build muscle memory for the work they will do on
                                day one.
                            </p>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            {PRACTICE_MODALITIES.map((item) => (
                                <div key={item.title} className={clsx('p-5', surfaces.card)}>
                                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{item.title}</h3>
                                    <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                                        {item.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Interactive labs */}
                    <section id="labs" className="scroll-mt-28 border-t border-slate-200/80 py-10 md:scroll-mt-20 dark:border-slate-800">
                        <div className="mb-6 max-w-2xl">
                            <Badge color="zinc" className={clsx('mb-3', accent.bgSoft, accent.textSoft)}>
                                Hands-on labs
                            </Badge>
                            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                                Editor, compiler, and tester—built into every programming path.
                            </h2>
                            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                                Interns write code in a Monaco editor, compile in an isolated sandbox, and verify results
                                with automated test cases. Networking, DevOps, and security labs follow the same
                                learn-by-doing model.
                            </p>
                        </div>
                        <LabShowcase />
                    </section>

                    {/* Platform highlights */}
                    <section id="features" className="scroll-mt-28 border-t border-slate-200/80 py-10 md:scroll-mt-20 dark:border-slate-800">
                        <div className="grid gap-4 sm:grid-cols-3">
                            {PLATFORM_HIGHLIGHTS.map((item, index) => {
                                const Icon = highlightIcons[index];

                                return (
                                    <div key={item.title} className={clsx('p-5', surfaces.card)}>
                                        <span
                                            className={clsx(
                                                'inline-flex size-8 items-center justify-center rounded-lg',
                                                accent.bgSoft,
                                            )}
                                        >
                                            <Icon className={clsx('size-4', accent.textSoft)} />
                                        </span>
                                        <h2 className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">
                                            {item.title}
                                        </h2>
                                        <p className="mt-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                                            {item.description}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {/* Audience */}
                    <section id="audience" className="scroll-mt-28 border-t border-slate-200/80 py-10 md:scroll-mt-20 dark:border-slate-800">
                        <div className="mb-6 max-w-2xl">
                            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                                Built for interns and the mentors who guide them.
                            </h2>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            {audiencePoints.map((group) => (
                                <div key={group.title} className={clsx('p-5 sm:p-6', surfaces.card)}>
                                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{group.title}</h3>
                                    <ul className="mt-4 space-y-2.5">
                                        {group.items.map((item) => (
                                            <li
                                                key={item}
                                                className="flex items-start gap-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400"
                                            >
                                                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand-500" />
                                                {item}
                                </li>
                                        ))}
                            </ul>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* CTA */}
                    {isGuest && (
                        <section id="get-started" className="scroll-mt-28 pb-10 md:scroll-mt-20">
                            <div
                                className={clsx(
                                    'flex flex-col items-start justify-between gap-5 p-6 sm:flex-row sm:items-center sm:p-8',
                                    surfaces.heroDark,
                                )}
                            >
                                <div>
                                    <h2 className="text-lg font-semibold text-white">
                                        Start your first learning path today.
                                    </h2>
                                    <p className="mt-2 max-w-lg text-sm text-brand-100/90">
                                        Join {name} to access structured ICT training—programming, networking, DevOps,
                                        and cybersecurity—in one place.
                                    </p>
                                </div>
                                <div className="flex shrink-0 flex-wrap gap-3">
                                    <Button href={route('register')} color="light">
                                        Create free account
                                    </Button>
                                    <Button href={route('login')} outline className="!border-white/25 !text-white hover:!bg-white/10">
                                        Sign in
                                    </Button>
                                </div>
                        </div>
                        </section>
                    )}
                    </main>

                <footer className="relative z-10 border-t border-slate-200/80 py-6 dark:border-slate-800">
                    <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 text-center sm:flex-row sm:px-6 sm:text-left">
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            © {new Date().getFullYear()} {name}. Structured learning for modern technology teams.
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Programming · Networking · DevOps · Cybersecurity
                        </p>
                </div>
                </footer>
            </div>
        </>
    );
}
