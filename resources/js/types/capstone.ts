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
    requires_kickoff?: boolean;
    allow_parallel_milestones?: boolean;
    milestones_count?: number;
    tasks_count?: number;
    milestones?: CapstoneTemplateMilestone[];
    tasks?: CapstoneTemplateTask[];
}

export interface CapstoneTemplateMilestone {
    id: number;
    title: string;
    description: string | null;
    sort_order: number;
    requires_mentor_signoff?: boolean;
    allows_parallel?: boolean;
    is_final_showcase?: boolean;
}

export interface CapstoneTemplateTask {
    id: number;
    title: string;
    description: string | null;
    capstone_template_milestone_id?: number | null;
    default_status?: CapstoneTaskStatus;
    priority?: CapstoneTaskPriority;
    sort_order?: number;
}

export interface CapstoneMilestoneAttachment {
    id: number;
    original_name: string;
    size_bytes?: number | null;
    mime_type?: string | null;
    url: string;
}

export interface CapstoneMilestone {
    id: number;
    title: string;
    description: string | null;
    status: CapstoneMilestoneStatus;
    sort_order: number;
    requires_mentor_signoff?: boolean;
    allows_parallel?: boolean;
    is_final_showcase?: boolean;
    submitted_at?: string | null;
    reviewed_at?: string | null;
    submission_notes?: string | null;
    resubmission_notes?: string | null;
    deliverable_url?: string | null;
    repo_url?: string | null;
    demo_url?: string | null;
    mentor_feedback?: string | null;
    mentor_score?: number | null;
    attachments?: CapstoneMilestoneAttachment[] | { data: CapstoneMilestoneAttachment[] };
    tasks?: CapstoneTask[] | { data: CapstoneTask[] };
    project?: {
        id: number;
        title: string;
        status?: CapstoneProjectStatus;
        enrollment?: {
            user?: { id: number; name: string } | null;
            mentor?: { id: number; name: string } | null;
        };
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
    allow_parallel_milestones?: boolean;
    started_at?: string | null;
    kickoff_approved_at?: string | null;
    completed_at?: string | null;
    archived_at?: string | null;
    needs_kickoff?: boolean;
    template?: CapstoneTemplate;
    milestones?: CapstoneMilestone[];
    enrollment?: {
        id?: number;
        user?: { id: number; name: string } | null;
        mentor?: { id: number; name: string } | null;
    };
}

export interface CapstoneProjectStats {
    milestones_approved: number;
    milestones_total: number;
    tasks_done: number;
    tasks_total: number;
    progress: number;
    estimated_weeks?: number;
    elapsed_weeks?: number;
    hours_logged?: number;
    active_milestone_title?: string | null;
}

export interface CapstoneLevelStatus {
    status: string;
    level_number: number;
    is_complete: boolean;
    capstone_complete: boolean;
}

export interface JournalEntry {
    id: number;
    entry_date: string;
    content: string;
    mood: JournalMood | null;
    hours_spent: string | number | null;
    milestone_id?: number | null;
    milestone?: { id: number; title: string } | null;
}

export interface KanbanColumn {
    status: CapstoneTaskStatus;
    tasks: { data: CapstoneTask[] };
}
