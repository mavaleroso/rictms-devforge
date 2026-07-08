import { Button } from '@/components/catalyst/button';
import type { Recommendation } from '@/types/integrations';
import {
    AcademicCapIcon,
    BookOpenIcon,
    CodeBracketIcon,
    FireIcon,
    PlayCircleIcon,
    QuestionMarkCircleIcon,
    RocketLaunchIcon,
} from '@heroicons/react/20/solid';
import { Link } from '@inertiajs/react';
import clsx from 'clsx';
import type { ComponentType, SVGProps } from 'react';

const iconMap: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
    material: BookOpenIcon,
    video: PlayCircleIcon,
    quiz: QuestionMarkCircleIcon,
    challenge: CodeBracketIcon,
    level: AcademicCapIcon,
    streak: FireIcon,
    capstone: RocketLaunchIcon,
};

interface RecommendationCardProps {
    items: Recommendation[];
}

export function RecommendationCards({ items }: RecommendationCardProps) {
    if (items.length === 0) {
        return null;
    }

    return (
        <section className="rounded-2xl border border-zinc-950/10 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-zinc-900 sm:p-5">
            <div className="mb-3">
                <h2 className="text-sm font-semibold text-zinc-950 dark:text-white">Recommended next</h2>
                <p className="mt-0.5 text-xs text-zinc-500">Personalized based on your progress</p>
            </div>
            <ul className="space-y-2">
                {items.map((item) => {
                    const Icon = iconMap[item.type] ?? BookOpenIcon;

                    return (
                        <li key={`${item.type}-${item.href}`}>
                            <Link
                                href={item.href}
                                className="group flex items-center gap-3 rounded-xl border border-zinc-950/5 px-3 py-2.5 transition hover:border-blue-300/50 hover:bg-blue-50/40 dark:border-white/5 dark:hover:border-blue-500/20 dark:hover:bg-blue-950/20"
                            >
                                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600 group-hover:bg-blue-500/10 group-hover:text-blue-600 dark:bg-zinc-800 dark:text-zinc-300">
                                    <Icon className="size-4" />
                                </span>
                                <span className="min-w-0 flex-1">
                                    <span className="block truncate text-sm font-medium text-zinc-950 dark:text-white">
                                        {item.title}
                                    </span>
                                    <span className="block truncate text-[11px] text-zinc-500">{item.reason}</span>
                                </span>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}
