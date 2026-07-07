import { Badge } from '@/components/catalyst/badge';
import { SidebarItem, SidebarLabel, SidebarSection } from '@/components/catalyst/sidebar';
import { type Level, type ProgressStatus } from '@/types/learning';
import { LockClosedIcon, CheckCircleIcon } from '@heroicons/react/20/solid';

const statusColors: Record<ProgressStatus, 'zinc' | 'blue' | 'amber' | 'green'> = {
    locked: 'zinc',
    available: 'blue',
    in_progress: 'amber',
    completed: 'green',
};

interface LevelSidebarProps {
    pathId: number;
    levels: Level[];
    currentLevelId?: number;
}

export function LevelSidebar({ pathId, levels, currentLevelId }: LevelSidebarProps) {
    return (
        <SidebarSection>
            {levels.map((level) => {
                const status = (level.progress_status ?? 'locked') as ProgressStatus;
                const isLocked = status === 'locked';
                const href = isLocked ? undefined : route('learn.levels.show', [pathId, level.id]);

                return (
                    <SidebarItem key={level.id} href={href} current={level.id === currentLevelId}>
                        {status === 'completed' ? (
                            <CheckCircleIcon data-slot="icon" className="text-green-600" />
                        ) : isLocked ? (
                            <LockClosedIcon data-slot="icon" className="text-zinc-400" />
                        ) : null}
                        <SidebarLabel>
                            <span className="flex items-center gap-2">
                                <span className="text-zinc-500">L{level.number}</span>
                                <span className="truncate">{level.title}</span>
                                <Badge color={statusColors[status]} className="ml-auto text-xs">
                                    {status.replace('_', ' ')}
                                </Badge>
                            </span>
                        </SidebarLabel>
                    </SidebarItem>
                );
            })}
        </SidebarSection>
    );
}
