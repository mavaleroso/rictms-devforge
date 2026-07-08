export type SubmissionStatus =
    | 'pending'
    | 'running'
    | 'passed'
    | 'failed'
    | 'needs_review'
    | 'approved'
    | 'rejected';

export type ChallengeLanguage = 'php' | 'javascript' | 'python';

export interface ChallengeExample {
    input: string;
    output: string;
    explanation?: string;
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

export interface CodingChallenge {
    id: number;
    level_id: number;
    title: string;
    slug: string | null;
    description: string;
    constraints: string | null;
    examples: ChallengeExample[];
    language: ChallengeLanguage;
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
