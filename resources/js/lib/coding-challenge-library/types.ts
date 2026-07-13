export type SubmissionStatus =
    | 'pending'
    | 'running'
    | 'passed'
    | 'failed'
    | 'needs_review'
    | 'approved'
    | 'rejected';

export type ChallengeLanguage = 'php' | 'javascript' | 'python';
export type ChallengeEnvironment = 'laravel_inertia_react';
export type ChallengeWorkspaceMode = 'single_file' | 'project';
export type ChallengeAssertionType =
    | 'function_output'
    | 'file_contains'
    | 'file_regex'
    | 'file_exists'
    | 'file_equals';

export interface ChallengeExample {
    input: string;
    output: string;
    explanation?: string;
}

export interface ChallengeTestCase {
    id: number;
    label: string | null;
    assertion_type?: ChallengeAssertionType;
    target_path?: string | null;
    input: { args: unknown[] };
    expected_output?: string;
    explanation?: string | null;
    is_sample: boolean;
    sort_order: number;
}

export interface WorkspaceFile {
    path: string;
    language: string;
    editable: boolean;
    content: string;
}

export interface CodingChallenge {
    id: number;
    level_id: number;
    title: string;
    slug: string | null;
    description: string;
    constraints: string | null;
    examples: ChallengeExample[];
    language: ChallengeLanguage;
    environment?: ChallengeEnvironment;
    environment_label?: string;
    environment_description?: string;
    environment_stack?: string[];
    workspace_mode?: ChallengeWorkspaceMode;
    template_key?: string | null;
    preview_url?: string | null;
    preview_path?: string | null;
    target_files?: string[];
    workspace_files?: WorkspaceFile[];
    entry_point: string;
    starter_code: string;
    time_limit_ms: number;
    memory_limit_mb: number;
    max_attempts: number;
    requires_mentor_review: boolean;
    is_active: boolean;
    test_cases?: ChallengeTestCase[];
    test_cases_count?: number;
    attempts_used?: number;
    tests_passed?: number;
    tests_total?: number;
    passed?: boolean;
    status?: SubmissionStatus | null;
}

export interface ChallengeLanguageOption {
    id: string;
    label: string;
    monaco_id: string;
}

export interface TestCaseResult {
    test_case_id: number;
    label: string | null;
    passed: boolean;
    expected_output?: string | null;
    actual_output?: string | null;
    error_message?: string | null;
    runtime_ms: number;
    is_sample: boolean;
}

export interface EvaluationResponse {
    status: SubmissionStatus;
    tests_passed: number;
    tests_total: number;
    runtime_ms: number;
    results: TestCaseResult[];
}

export interface ChallengeSubmission {
    id: number;
    status: SubmissionStatus;
    language: ChallengeLanguage;
    code?: string;
    files?: Record<string, string> | null;
    attempt_number: number;
    tests_passed: number;
    tests_total: number;
    runtime_ms: number | null;
    submission_source?: 'editor' | 'github';
    github_owner?: string | null;
    github_repo?: string | null;
    github_ref?: string | null;
    github_path?: string | null;
    mentor_feedback: string | null;
    mentor_score: number | null;
    reviewed_at: string | null;
    created_at: string;
    user?: { id: number; name: string; email: string };
    challenge?: CodingChallenge;
    results?: ChallengeSubmissionResult[];
}

export interface ChallengeSubmissionResult {
    id: number;
    passed: boolean;
    actual_output?: string | null;
    error_message?: string | null;
    runtime_ms: number | null;
    test_case?: ChallengeTestCase;
}
