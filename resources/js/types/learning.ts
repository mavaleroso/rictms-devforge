export type ProgressStatus = 'locked' | 'available' | 'in_progress' | 'completed';
export type EnrollmentStatus = 'active' | 'completed' | 'paused';
export type MaterialType = 'markdown' | 'pdf' | 'slides' | 'snippet' | 'standard';
export type VideoProvider = 'youtube' | 'upload';
export type QuestionType = 'multiple_choice' | 'identification' | 'true_false' | 'essay';
export type LevelDifficulty = 'beginner' | 'intermediate' | 'advanced';
export type LevelEditorTab = 'overview' | 'materials' | 'videos' | 'quiz' | 'challenge';

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
    coding_challenges?: CodingChallenge[];
    progress_status?: ProgressStatus;
}

export type ChallengeLanguage = 'php' | 'javascript' | 'python';

export interface CodingChallenge {
    id: number;
    title: string;
    description: string;
    constraints: string | null;
    examples: { input: string; output: string; explanation?: string }[];
    language: ChallengeLanguage;
    entry_point: string;
    starter_code: string;
    time_limit_ms: number;
    memory_limit_mb: number;
    max_attempts: number;
    requires_mentor_review: boolean;
    is_active: boolean;
    sort_order: number;
    test_cases?: ChallengeTestCase[];
    test_cases_count?: number;
    attempts_used?: number;
    tests_passed?: number;
    tests_total?: number;
    passed?: boolean;
    status?: string | null;
}

export interface ChallengeTestCase {
    id: number;
    label: string | null;
    input: { args: unknown[] };
    expected_output?: string;
    explanation?: string | null;
    is_sample: boolean;
    sort_order: number;
}

export interface LearningMaterialFile {
    id: number;
    url: string;
    original_name: string;
    sort_order: number;
}

export interface LearningMaterial {
    id: number;
    type: MaterialType;
    title: string;
    content: string | null;
    files?: LearningMaterialFile[];
    sort_order: number;
    completed?: boolean;
}

export interface Video {
    id: number;
    title: string;
    caption: string | null;
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
    last_answers?: Record<string, string>;
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
