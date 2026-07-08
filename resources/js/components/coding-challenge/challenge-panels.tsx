import { Badge } from '@/components/catalyst/badge';
import { attemptsRemaining, formatRuntime, formatTestInput, SUBMISSION_STATUS_COLOR, SUBMISSION_STATUS_LABEL } from '@/lib/coding-challenge-library';
import type { CodingChallenge, EvaluationResponse, ChallengeSubmission } from '@/lib/coding-challenge-library/types';
import { CheckCircleIcon, ClockIcon, CodeBracketIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';

interface ChallengeProblemPanelProps {
    challenge: CodingChallenge;
    pathName: string;
    levelNumber: number;
}

export function ChallengeProblemPanel({ challenge, pathName, levelNumber }: ChallengeProblemPanelProps) {
    const remaining = attemptsRemaining(challenge);

    return (
        <div className="flex h-full flex-col overflow-hidden bg-white dark:bg-zinc-950">
            <div className="shrink-0 border-b border-zinc-950/8 px-4 py-3 dark:border-white/8">
                <div className="flex flex-wrap items-center gap-2">
                    <Badge color="violet">{challenge.language.toUpperCase()}</Badge>
                    {challenge.passed && (
                        <Badge color="lime" className="gap-1">
                            <CheckCircleIcon className="size-3" />
                            Solved
                        </Badge>
                    )}
                    {challenge.requires_mentor_review && <Badge color="amber">Mentor review</Badge>}
                </div>
                <h1 className="mt-2 text-lg font-semibold tracking-tight text-zinc-950 dark:text-white">{challenge.title}</h1>
                <p className="mt-0.5 text-xs text-zinc-500">
                    {pathName} · Level {levelNumber} · {remaining} attempt{remaining === 1 ? '' : 's'} left
                </p>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
                <div className="prose prose-sm prose-zinc max-w-none dark:prose-invert">
                    <div className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                        {challenge.description}
                    </div>
                </div>

                {challenge.examples.length > 0 && (
                    <section className="mt-5 space-y-3">
                        <h2 className="text-xs font-semibold tracking-wide text-zinc-500 uppercase">Examples</h2>
                        {challenge.examples.map((example, index) => (
                            <div
                                key={index}
                                className="rounded-lg border border-zinc-950/8 bg-zinc-50/80 p-3 text-xs dark:border-white/8 dark:bg-zinc-900/60"
                            >
                                <p className="font-medium text-zinc-950 dark:text-white">Example {index + 1}</p>
                                <pre className="mt-2 overflow-x-auto font-mono text-zinc-700 dark:text-zinc-300">
                                    <span className="text-zinc-500">Input: </span>
                                    {example.input}
                                </pre>
                                <pre className="mt-1 overflow-x-auto font-mono text-zinc-700 dark:text-zinc-300">
                                    <span className="text-zinc-500">Output: </span>
                                    {example.output}
                                </pre>
                                {example.explanation && (
                                    <p className="mt-2 text-zinc-600 dark:text-zinc-400">{example.explanation}</p>
                                )}
                            </div>
                        ))}
                    </section>
                )}

                {challenge.constraints && (
                    <section className="mt-5">
                        <h2 className="text-xs font-semibold tracking-wide text-zinc-500 uppercase">Constraints</h2>
                        <pre className="mt-2 whitespace-pre-wrap font-mono text-xs text-zinc-600 dark:text-zinc-400">
                            {challenge.constraints}
                        </pre>
                    </section>
                )}

                <section className="mt-5 flex flex-wrap gap-3 text-xs text-zinc-500">
                    <span className="inline-flex items-center gap-1">
                        <ClockIcon className="size-3.5" />
                        {challenge.time_limit_ms} ms limit
                    </span>
                    <span className="inline-flex items-center gap-1">
                        <CodeBracketIcon className="size-3.5" />
                        {challenge.entry_point}()
                    </span>
                </section>
            </div>
        </div>
    );
}

interface ChallengeResultsPanelProps {
    result: EvaluationResponse | null;
    loading: boolean;
    activeTab: 'tests' | 'submissions';
    onTabChange: (tab: 'tests' | 'submissions') => void;
    submissions: ChallengeSubmission[];
}

export function ChallengeResultsPanel({ result, loading, activeTab, onTabChange, submissions }: ChallengeResultsPanelProps) {
    return (
        <div className="flex h-full flex-col overflow-hidden border-t border-zinc-950/10 bg-zinc-50 dark:border-white/10 dark:bg-zinc-900">
            <div className="flex shrink-0 items-center gap-1 border-b border-zinc-950/8 px-2 dark:border-white/8">
                {(['tests', 'submissions'] as const).map((tab) => (
                    <button
                        key={tab}
                        type="button"
                        onClick={() => onTabChange(tab)}
                        className={clsx(
                            'px-3 py-2 text-xs font-medium capitalize transition',
                            activeTab === tab
                                ? 'border-b-2 border-violet-500 text-violet-600 dark:text-violet-400'
                                : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300',
                        )}
                    >
                        {tab === 'tests' ? 'Test Results' : 'Submissions'}
                    </button>
                ))}
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-3">
                {activeTab === 'tests' && (
                    <>
                        {loading && <p className="text-xs text-zinc-500">Running tests…</p>}
                        {!loading && !result && (
                            <p className="text-xs text-zinc-500">Run sample tests or submit your solution to see results.</p>
                        )}
                        {!loading && result && (
                            <div className="space-y-3">
                                <div className="flex items-center justify-between gap-2">
                                    <Badge color={SUBMISSION_STATUS_COLOR[result.status]}>
                                        {SUBMISSION_STATUS_LABEL[result.status]}
                                    </Badge>
                                    <span className="text-xs text-zinc-500">
                                        {result.tests_passed}/{result.tests_total} passed · {formatRuntime(result.runtime_ms)}
                                    </span>
                                </div>
                                {result.results.map((test, index) => (
                                    <div
                                        key={test.test_case_id}
                                        className={clsx(
                                            'rounded-lg border px-3 py-2 text-xs',
                                            test.passed
                                                ? 'border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/20'
                                                : 'border-red-500/20 bg-red-50/50 dark:bg-red-950/20',
                                        )}
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="font-medium text-zinc-950 dark:text-white">
                                                {test.label ?? `Case ${index + 1}`}
                                            </span>
                                            <span className={test.passed ? 'text-emerald-600' : 'text-red-600'}>
                                                {test.passed ? 'Passed' : 'Failed'}
                                            </span>
                                        </div>
                                        {test.error_message && (
                                            <pre className="mt-2 overflow-x-auto whitespace-pre-wrap font-mono text-red-700 dark:text-red-300">
                                                {test.error_message}
                                            </pre>
                                        )}
                                        {test.actual_output != null && (
                                            <pre className="mt-1 overflow-x-auto font-mono text-zinc-600 dark:text-zinc-400">
                                                Output: {test.actual_output}
                                            </pre>
                                        )}
                                        {test.expected_output != null && !test.passed && (
                                            <pre className="mt-1 overflow-x-auto font-mono text-zinc-500">
                                                Expected: {test.expected_output}
                                            </pre>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}

                {activeTab === 'submissions' && (
                    <div className="space-y-2">
                        {submissions.length === 0 && (
                            <p className="text-xs text-zinc-500">No submissions yet.</p>
                        )}
                        {submissions.map((submission) => (
                            <div
                                key={submission.id}
                                className="flex items-center justify-between gap-2 rounded-lg border border-zinc-950/8 bg-white px-3 py-2 text-xs dark:border-white/8 dark:bg-zinc-950"
                            >
                                <div>
                                    <Badge color={SUBMISSION_STATUS_COLOR[submission.status]}>
                                        {SUBMISSION_STATUS_LABEL[submission.status]}
                                    </Badge>
                                    <p className="mt-1 text-zinc-500">
                                        Attempt #{submission.attempt_number} · {submission.tests_passed}/{submission.tests_total} tests
                                    </p>
                                </div>
                                <span className="text-zinc-400">{formatRuntime(submission.runtime_ms)}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export { formatTestInput };
