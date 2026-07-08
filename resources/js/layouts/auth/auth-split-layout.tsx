import { AnimatedGridBackground } from '@/components/marketing/animated-grid-background';
import { AuthMarketingHeader, type AuthMarketingVariant } from '@/components/marketing/auth-marketing-header';
import { HeroCover } from '@/components/marketing/hero-cover';
import { LearningTrackGrid } from '@/components/marketing/learning-track-grid';
import { Badge } from '@/components/catalyst/badge';
import { accent, surfaces } from '@/lib/theme';
import clsx from 'clsx';
import type { ReactNode } from 'react';

interface AuthSplitLayoutProps {
    children: ReactNode;
    title?: string;
    description?: string;
    variant?: AuthMarketingVariant;
    aside?: 'hero' | 'tracks';
}

export default function AuthSplitLayout({
    children,
    title,
    description,
    variant = 'default',
    aside = 'hero',
}: AuthSplitLayoutProps) {
    return (
        <div className="relative isolate flex min-h-dvh flex-col text-slate-900 dark:text-slate-100">
            <AnimatedGridBackground />
            <AuthMarketingHeader variant={variant} />

            <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 items-center px-4 py-8 sm:px-6 sm:py-10">
                <div className="grid w-full items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-10">
                    <div className="mx-auto w-full max-w-md lg:max-w-none">
                        <Badge color="zinc" className={clsx('mb-4', accent.bgSoft, accent.textSoft)}>
                            ICT skills academy
                        </Badge>

                        {(title || description) && (
                            <div className="mb-5 space-y-2">
                                {title && (
                                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                                        {title}
                                    </h1>
                                )}
                                {description && (
                                    <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                                        {description}
                                    </p>
                                )}
                            </div>
                        )}

                        <div className={clsx('p-5 sm:p-6', surfaces.card)}>{children}</div>
                    </div>

                    <div className="hidden lg:block">
                        {aside === 'tracks' ? (
                            <div className="space-y-5">
                                <div className="max-w-md">
                                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                                        Four disciplines. One platform.
                                    </h2>
                                    <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                                        Programming, networking, DevOps, and cybersecurity—each with structured levels,
                                        labs, and mentor support.
                                    </p>
                                </div>
                                <LearningTrackGrid />
                            </div>
                        ) : (
                            <HeroCover />
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
