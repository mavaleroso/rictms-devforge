import type { ProgressStatus } from '@/types/learning';

export const progressStatusLabel: Record<ProgressStatus, string> = {
    locked: 'Locked',
    available: 'Start',
    in_progress: 'In progress',
    completed: 'Completed',
};

export const progressStatusColor: Record<ProgressStatus, 'zinc' | 'blue' | 'amber' | 'green' | 'purple'> = {
    locked: 'zinc',
    available: 'purple',
    in_progress: 'amber',
    completed: 'green',
};

export function levelStatus(level: { progress_status?: ProgressStatus }): ProgressStatus {
    return level.progress_status ?? 'locked';
}
