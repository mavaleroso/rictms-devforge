export interface Recommendation {
    type: string;
    title: string;
    reason: string;
    href: string;
    priority: number;
}

export interface TutorMessage {
    id: number;
    role: 'user' | 'assistant';
    content: string;
    created_at?: string;
}

export interface TutorSession {
    id: number;
    title: string;
    context_type: string;
    context_id: number | null;
    messages: TutorMessage[];
}
