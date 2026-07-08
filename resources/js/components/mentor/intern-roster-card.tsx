import { EnrollmentProgressBar, EnrollmentStatusBadge } from '@/components/admin/enrollment-status-badge';
import { Avatar } from '@/components/catalyst/avatar';
import { Button } from '@/components/catalyst/button';
import { useInitials } from '@/hooks/use-initials';
import { formatDisplayName } from '@/lib/user-profile';
import type { Enrollment, EnrollmentStatus } from '@/types/learning';
import { ArrowRightIcon } from '@heroicons/react/20/solid';

interface InternRosterCardProps {
    enrollment: Enrollment & {
        user?: {
            id: number;
            name: string;
            first_name?: string | null;
            middle_name?: string | null;
            last_name?: string | null;
            email?: string;
            avatar_url?: string | null;
        };
        learning_path?: { name: string };
        current_level?: { number: number; title: string } | null;
    };
}

export function InternRosterCard({ enrollment }: InternRosterCardProps) {
    const getInitials = useInitials();
    const user = enrollment.user;

    if (!user) {
        return null;
    }

    const displayName = formatDisplayName(user);

    return (
        <article className="flex flex-col rounded-xl border border-zinc-950/10 bg-white p-4 shadow-sm transition hover:border-zinc-950/15 dark:border-white/10 dark:bg-zinc-900 dark:hover:border-white/15">
            <div className="flex items-start gap-3">
                <Avatar
                    src={user.avatar_url}
                    initials={getInitials(displayName)}
                    alt={displayName}
                    className="size-11 ring-1 ring-zinc-950/8 dark:ring-white/10"
                />
                <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-zinc-950 dark:text-white">{displayName}</p>
                    <p className="truncate text-xs text-zinc-500">{user.email}</p>
                    <p className="mt-1 truncate text-xs font-medium text-violet-600 dark:text-violet-400">
                        {enrollment.learning_path?.name}
                    </p>
                </div>
                <EnrollmentStatusBadge status={enrollment.status as EnrollmentStatus} />
            </div>

            <div className="mt-4">
                <div className="mb-1 flex justify-between text-[11px] text-zinc-500">
                    <span>Overall progress</span>
                    <span>{enrollment.progress_percentage}%</span>
                </div>
                <EnrollmentProgressBar value={enrollment.progress_percentage} />
            </div>

            {enrollment.current_level && (
                <p className="mt-3 text-[11px] text-zinc-500">
                    Current: <span className="font-medium text-zinc-700 dark:text-zinc-300">L{enrollment.current_level.number} — {enrollment.current_level.title}</span>
                </p>
            )}

            <Button href={route('mentor.interns.show', user.id)} outline className="mt-4 !text-xs">
                View profile
                <ArrowRightIcon data-slot="icon" />
            </Button>
        </article>
    );
}
