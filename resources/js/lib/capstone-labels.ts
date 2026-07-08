import type { CapstoneMilestoneStatus, CapstoneTaskPriority, CapstoneTaskStatus, JournalMood } from '@/types/capstone';

export const TASK_STATUS_LABEL: Record<CapstoneTaskStatus, string> = {
    backlog: 'Backlog',
    todo: 'To Do',
    in_progress: 'In Progress',
    in_review: 'In Review',
    done: 'Done',
};

export const TASK_STATUS_COLOR: Record<CapstoneTaskStatus, 'zinc' | 'blue' | 'amber' | 'violet' | 'lime'> = {
    backlog: 'zinc',
    todo: 'blue',
    in_progress: 'amber',
    in_review: 'violet',
    done: 'lime',
};

export const TASK_PRIORITY_LABEL: Record<CapstoneTaskPriority, string> = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
};

export const MILESTONE_STATUS_LABEL: Record<CapstoneMilestoneStatus, string> = {
    pending: 'Pending',
    in_progress: 'In Progress',
    submitted: 'Awaiting review',
    approved: 'Approved',
    rejected: 'Needs revision',
};

export const MILESTONE_STATUS_COLOR: Record<CapstoneMilestoneStatus, 'zinc' | 'blue' | 'amber' | 'lime' | 'red'> = {
    pending: 'zinc',
    in_progress: 'blue',
    submitted: 'amber',
    approved: 'lime',
    rejected: 'red',
};

export const MOOD_LABEL: Record<JournalMood, string> = {
    great: 'Great',
    good: 'Good',
    ok: 'Okay',
    struggling: 'Struggling',
};

export const BOARD_COLUMNS: CapstoneTaskStatus[] = ['backlog', 'todo', 'in_progress', 'in_review', 'done'];
