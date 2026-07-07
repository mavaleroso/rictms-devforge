export type ProgressStatus = 'locked' | 'available' | 'in_progress' | 'completed';
export type EnrollmentStatus = 'active' | 'completed' | 'paused';
export type MaterialType = 'markdown' | 'pdf' | 'slides' | 'snippet' | 'standard';
export type VideoProvider = 'youtube' | 'upload';
export type QuestionType = 'multiple_choice' | 'identification' | 'true_false' | 'essay';
export type LevelDifficulty = 'beginner' | 'intermediate' | 'advanced';
export type LevelEditorTab = 'overview' | 'materials' | 'videos' | 'quiz';

export interface LearningPath {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    icon: string | null;
    cover_image_url?: string | null;
    is_active: boolean;
    sort_order?: number;
    levels_count?: number;
    enrollments_count?: number;
    total_estimated_minutes?: number;
    levels?: Level[];
}

export interface Level {
    id: number;
    learning_path_id: number;
    number: number;
    title: string;
    overview: string | null;
    objectives: string | null;
    expected_outcome: string | null;
    estimated_minutes: number;
    difficulty: LevelDifficulty;
    materials_count?: number;
    videos_count?: number;
    materials?: LearningMaterial[];
    videos?: Video[];
    quiz?: Quiz | null;
    progress_status?: ProgressStatus;
}

export interface LearningMaterial {
    id: number;
    type: MaterialType;
    title: string;
    content: string | null;
    file_path: string | null;
    sort_order: number;
    completed?: boolean;
}

export interface Video {
    id: number;
    title: string;
    provider: VideoProvider;
    url: string | null;
    file_path: string | null;
    sort_order: number;
    completed?: boolean;
}

export interface Quiz {
    id: number;
    title: string;
    passing_score: number;
    max_attempts: number;
    questions_count?: number;
    questions?: QuizQuestion[];
    attempts_used?: number;
    best_score?: number;
    passed?: boolean;
}

export interface QuizQuestion {
    id: number;
    type: QuestionType;
    question: string;
    points: number;
    sort_order: number;
    correct_answer?: string;
    options?: QuizOption[];
}

export interface QuizOption {
    id: number;
    label: string;
    is_correct?: boolean;
    sort_order: number;
}

export interface Enrollment {
    id: number;
    status: EnrollmentStatus;
    progress_percentage: number;
    started_at: string | null;
    completed_at: string | null;
    user?: { id: number; name: string; email: string };
    learning_path?: LearningPath;
    mentor?: { id: number; name: string } | null;
    current_level?: Level | null;
}

export interface PaginatedCollection<T> {
    data: T[];
}
