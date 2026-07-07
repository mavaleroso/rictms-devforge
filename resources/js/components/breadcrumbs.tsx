import { Link } from '@/components/catalyst/link';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { Fragment } from 'react';

export function Breadcrumbs({ breadcrumbs }: { breadcrumbs: BreadcrumbItemType[] }) {
    if (breadcrumbs.length === 0) {
        return null;
    }

    return (
        <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                {breadcrumbs.map((item, index) => {
                    const isLast = index === breadcrumbs.length - 1;

                    return (
                        <Fragment key={item.href}>
                            <li>
                                {isLast ? (
                                    <span className="font-medium text-zinc-950 dark:text-white">{item.title}</span>
                                ) : (
                                    <Link href={item.href} className="hover:text-zinc-950 dark:hover:text-white">
                                        {item.title}
                                    </Link>
                                )}
                            </li>
                            {!isLast && <li aria-hidden="true">/</li>}
                        </Fragment>
                    );
                })}
            </ol>
        </nav>
    );
}
