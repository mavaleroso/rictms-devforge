export type CapstoneProjectStatus = 'draft' | 'active' | 'completed' | 'archived';
export type CapstoneMilestoneStatus = 'pending' | 'in_progress' | 'submitted' | 'approved' | 'rejected';
export type CapstoneTaskStatus = 'backlog' | 'todo' | 'in_progress' | 'in_review' | 'done';
export type CapstoneTaskPriority = 'low' | 'medium' | 'high';
export type JournalMood = 'great' | 'good' | 'ok' | 'struggling';

export interface CapstoneTemplate {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    objectives: string | null;
    estimated_weeks: number;
    is_active: boolean;
    milestones_count?: number;
    tasks_count?: number;
    milestones?: CapstoneTemplateMilestone[];
}

export interface CapstoneTemplateMilestone {
    id: number;
    title: string;
    description: string | null;
    sort_order: number;
}

export interface CapstoneMilestone {
    id: number;
    title: string;
    description: string | null;
    status: CapstoneMilestoneStatus;
    sort_order: number;
    submitted_at?: string | null;
    reviewed_at?: string | null;
    mentor_feedback?: string | null;
    mentor_score?: number | null;
    project?: {
        id: number;
        title: string;
        enrollment?: { user?: { id: number; name: string } };
    };
}

export interface CapstoneTask {
    id: number;
    title: string;
    description: string | null;
    status: CapstoneTaskStatus;
    priority: CapstoneTaskPriority;
    due_date?: string | null;
    milestone_id?: number | null;
    assignee?: { id: number; name: string } | null;
}

export interface CapstoneProject {
    id: number;
    title: string;
    description: string | null;
    status: CapstoneProjectStatus;
    started_at?: string | null;
    completed_at?: string | null;
    template?: CapstoneTemplate;
    milestones?: CapstoneMilestone[];
    enrollment?: { mentor?: { id: number; name: string } | null };
}

export interface CapstoneProjectStats {
    milestones_approved: number;
    milestones_total: number;
    tasks_done: number;
    tasks_total: number;
    progress: number;
}

export interface JournalEntry {
    id: number;
    entry_date: string;
    content: string;
    mood: JournalMood | null;
    hours_spent: string | number | null;
}

export interface KanbanColumn {
    status: CapstoneTaskStatus;
    tasks: { data: CapstoneTask[] };
}
