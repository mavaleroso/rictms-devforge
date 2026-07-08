import AppLogo from '@/components/app-logo';
import { ThemeToggleButton } from '@/components/marketing/theme-toggle-button';
import { Button } from '@/components/catalyst/button';
import { LANDING_SECTIONS } from '@/lib/landing-sections';
import { accent } from '@/lib/theme';
import { Link } from '@inertiajs/react';
import clsx from 'clsx';
import { useEffect, useMemo, useState } from 'react';

interface LandingHeaderProps {
    isGuest: boolean;
}

export function LandingHeader({ isGuest }: LandingHeaderProps) {
    const sections = useMemo(
        () => LANDING_SECTIONS.filter((section) => !section.guestOnly || isGuest),
        [isGuest],
    );
    const [activeSection, setActiveSection] = useState(sections[0]?.id ?? 'paths');

    useEffect(() => {
        const sectionElements = sections
            .map((section) => document.getElementById(section.id))
            .filter((element): element is HTMLElement => element !== null);

        if (sectionElements.length === 0) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

                if (visible[0]?.target.id) {
                    setActiveSection(visible[0].target.id);
                }
            },
            {
                rootMargin: '-20% 0px -55% 0px',
                threshold: [0.1, 0.35, 0.6],
            },
        );

        sectionElements.forEach((element) => observer.observe(element));

        return () => observer.disconnect();
    }, [sections]);

    return (
        <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
            <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
                <Link href={route('home')} className="shrink-0">
                    <AppLogo />
                </Link>

                <nav
                    aria-label="Page sections"
                    className="hidden min-w-0 flex-1 items-center justify-center gap-1 md:flex"
                >
                    {sections.map((section) => (
                        <a
                            key={section.id}
                            href={`#${section.id}`}
                            className={clsx(
                                'rounded-md px-2.5 py-1.5 text-xs font-medium transition sm:px-3 sm:text-sm',
                                activeSection === section.id
                                    ? clsx(accent.bgSoft, accent.textSoft)
                                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white',
                            )}
                        >
                            {section.label}
                        </a>
                    ))}
                </nav>

                <div className="ml-auto flex shrink-0 items-center gap-2">
                    <ThemeToggleButton />

                    {isGuest ? (
                        <>
                            <Button href={route('login')} plain className="!text-sm">
                                Sign in
                            </Button>
                            <Button href={route('register')} color="dark/zinc" className="!text-sm">
                                Get started
                            </Button>
                        </>
                    ) : (
                        <Button href={route('dashboard')} color="dark/zinc" className="!text-sm">
                            Dashboard
                        </Button>
                    )}
                </div>
            </div>

            <nav
                aria-label="Page sections mobile"
                className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 pb-3 md:hidden sm:px-6"
            >
                {sections.map((section) => (
                    <a
                        key={section.id}
                        href={`#${section.id}`}
                        className={clsx(
                            'shrink-0 rounded-md px-2.5 py-1 text-xs font-medium transition',
                            activeSection === section.id
                                ? clsx(accent.bgSoft, accent.textSoft)
                                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white',
                        )}
                    >
                        {section.label}
                    </a>
                ))}
            </nav>
        </header>
    );
}
