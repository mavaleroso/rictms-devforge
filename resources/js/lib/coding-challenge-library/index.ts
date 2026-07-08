import type {
    ChallengeLanguage,
    ChallengeSubmission,
    CodingChallenge,
    EvaluationResponse,
    SubmissionStatus,
} from '@/lib/coding-challenge-library/types';

export const SUBMISSION_STATUS_LABEL: Record<SubmissionStatus, string> = {
    pending: 'Pending',
    running: 'Running',
    passed: 'Accepted',
    failed: 'Wrong Answer',
    needs_review: 'Pending Review',
    approved: 'Approved',
    rejected: 'Rejected',
};

export const SUBMISSION_STATUS_COLOR: Record<
    SubmissionStatus,
    'lime' | 'amber' | 'orange' | 'red' | 'zinc' | 'blue' | 'violet'
> = {
    pending: 'zinc',
    running: 'blue',
    passed: 'lime',
    failed: 'red',
    needs_review: 'amber',
    approved: 'lime',
    rejected: 'red',
};

export function attemptsRemaining(challenge: { max_attempts: number; attempts_used?: number; passed?: boolean }): number {
    if (challenge.passed) {
        return 0;
    }

    return Math.max(0, challenge.max_attempts - (challenge.attempts_used ?? 0));
}

export function formatRuntime(ms: number | null | undefined): string {
    if (ms == null) {
        return '—';
    }

    return ms < 1000 ? `${ms} ms` : `${(ms / 1000).toFixed(2)} s`;
}

export function formatTestInput(input: { args?: unknown[] }): string {
    const args = input.args ?? [];

    return args.map((arg) => JSON.stringify(arg)).join(', ');
}

export function monacoLanguage(language: ChallengeLanguage): string {
    return language === 'javascript' ? 'javascript' : language;
}

export function isTerminalStatus(status: SubmissionStatus): boolean {
    return status === 'passed' || status === 'approved' || status === 'rejected';
}

const SUCCESSFUL_SUBMISSION_STATUSES: SubmissionStatus[] = ['passed', 'approved', 'needs_review'];

export function findSuccessfulSubmission(submissions: ChallengeSubmission[]): ChallengeSubmission | undefined {
    return submissions.find((submission) => SUCCESSFUL_SUBMISSION_STATUSES.includes(submission.status));
}

export function mapSubmissionToEvaluationResult(submission: ChallengeSubmission): EvaluationResponse {
    return {
        status: submission.status,
        tests_passed: submission.tests_passed,
        tests_total: submission.tests_total,
        runtime_ms: submission.runtime_ms ?? 0,
        results:
            submission.results?.map((result) => ({
                test_case_id: result.test_case?.id ?? result.id,
                label: result.test_case?.label ?? null,
                passed: result.passed,
                expected_output: result.test_case?.expected_output ?? null,
                actual_output: result.actual_output,
                error_message: result.error_message,
                runtime_ms: result.runtime_ms ?? 0,
                is_sample: result.test_case?.is_sample ?? false,
            })) ?? [],
    };
}

export function defaultGitHubForm(challenge: CodingChallenge) {
    return {
        github_owner: '',
        github_repo: '',
        github_ref: 'main',
        github_path: `solution.${challenge.language === 'javascript' ? 'js' : challenge.language}`,
    };
}

export function buildChallengeWorkspaceInitialState(
    challenge: CodingChallenge,
    submissions: ChallengeSubmission[],
) {
    const successful = findSuccessfulSubmission(submissions);
    const githubForm = defaultGitHubForm(challenge);

    if (!successful) {
        return {
            code: challenge.starter_code,
            result: null as EvaluationResponse | null,
            source: 'editor' as const,
            githubForm,
        };
    }

    const fromGitHub = successful.submission_source === 'github';

    return {
        code: successful.code ?? challenge.starter_code,
        result: mapSubmissionToEvaluationResult(successful),
        source: fromGitHub ? ('github' as const) : ('editor' as const),
        githubForm: fromGitHub
            ? {
                  github_owner: successful.github_owner ?? '',
                  github_repo: successful.github_repo ?? '',
                  github_ref: successful.github_ref ?? 'main',
                  github_path: successful.github_path ?? githubForm.github_path,
              }
            : githubForm,
    };
}
