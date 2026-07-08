import { Button } from '@/components/catalyst/button';
import { Input } from '@/components/catalyst/input';
import { fetchJson, FetchJsonError } from '@/lib/fetch-json';
import {
    attemptsRemaining,
    buildChallengeWorkspaceInitialState,
    mapSubmissionToEvaluationResult,
    monacoLanguage,
} from '@/lib/coding-challenge-library';
import type {
    ChallengeSubmission,
    CodingChallenge,
    EvaluationResponse,
} from '@/lib/coding-challenge-library/types';
import Editor from '@monaco-editor/react';
import { CodeBracketSquareIcon, PlayIcon, PaperAirplaneIcon } from '@heroicons/react/20/solid';
import { useCallback, useEffect, useState } from 'react';
import { ChallengeProblemPanel, ChallengeResultsPanel } from '@/components/coding-challenge/challenge-panels';
import { useToast } from '@/components/toast/toast-provider';
import clsx from 'clsx';

interface ChallengeWorkspaceProps {
    challenge: CodingChallenge;
    pathName: string;
    levelNumber: number;
    initialSubmissions: ChallengeSubmission[];
    githubConnected?: boolean;
    evaluationDriver?: string;
}

export function ChallengeWorkspace({
    challenge,
    pathName,
    levelNumber,
    initialSubmissions,
    githubConnected = false,
    evaluationDriver = 'local',
}: ChallengeWorkspaceProps) {
    const initialState = buildChallengeWorkspaceInitialState(challenge, initialSubmissions);
    const [source, setSource] = useState<'editor' | 'github'>(initialState.source);
    const [code, setCode] = useState(initialState.code);
    const [githubForm, setGithubForm] = useState(initialState.githubForm);
    const [result, setResult] = useState<EvaluationResponse | null>(initialState.result);
    const [submissions, setSubmissions] = useState(initialSubmissions);
    const [running, setRunning] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [pollingId, setPollingId] = useState<number | null>(null);
    const [activeTab, setActiveTab] = useState<'tests' | 'submissions'>('tests');
    const [passed, setPassed] = useState(challenge.passed ?? false);

    const { show, showSuccess } = useToast();
    const remaining = attemptsRemaining({ ...challenge, passed, attempts_used: submissions.length || challenge.attempts_used });
    const disabled = passed || remaining <= 0;

    const handleSubmissionResult = useCallback(
        (submission: ChallengeSubmission) => {
            setSubmissions((prev) => [submission, ...prev.filter((s) => s.id !== submission.id)]);
            setResult(mapSubmissionToEvaluationResult(submission));

            if (submission.status === 'passed' || submission.status === 'approved') {
                setPassed(true);
                showSuccess('Accepted', 'All test cases passed. Next level requirements updated.');
            } else if (submission.status === 'needs_review') {
                showSuccess('Submitted for review', 'All tests passed. Waiting for mentor approval.');
            } else if (submission.status === 'failed') {
                show({ title: 'Not accepted', message: `${submission.tests_passed}/${submission.tests_total} tests passed.`, variant: 'info' });
            }
        },
        [show, showSuccess],
    );

    useEffect(() => {
        if (!pollingId) {
            return;
        }

        const interval = setInterval(async () => {
            try {
                const data = await fetchJson<{ submission: ChallengeSubmission }>(
                    route('learn.challenges.submissions.show', pollingId),
                );

                if (data.submission.status !== 'running' && data.submission.status !== 'pending') {
                    setPollingId(null);
                    setSubmitting(false);
                    handleSubmissionResult(data.submission);
                }
            } catch {
                setPollingId(null);
                setSubmitting(false);
            }
        }, 1500);

        return () => clearInterval(interval);
    }, [pollingId, handleSubmissionResult]);

    const handleRun = useCallback(async () => {
        if (source !== 'editor') {
            return;
        }

        setRunning(true);
        setActiveTab('tests');

        try {
            const response = await fetchJson<EvaluationResponse>(route('learn.challenges.run', challenge.id), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code }),
            });

            setResult(response);
        } catch (error) {
            const message = error instanceof FetchJsonError ? error.message : 'Failed to run tests.';

            show({ title: 'Run failed', message, variant: 'error' });
        } finally {
            setRunning(false);
        }
    }, [challenge.id, code, show, source]);

    const handleSubmit = useCallback(async () => {
        setSubmitting(true);
        setActiveTab('tests');

        const body =
            source === 'github'
                ? { source: 'github', ...githubForm }
                : { source: 'editor', code };

        try {
            const response = await fetchJson<{ submission: ChallengeSubmission }>(
                route('learn.challenges.submit', challenge.id),
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body),
                },
            );

            if (response.submission.status === 'running') {
                setPollingId(response.submission.id);
                setSubmitting(true);
                show({ title: 'Evaluating', message: 'Running tests in CI sandbox…', variant: 'info' });
                return;
            }

            handleSubmissionResult(response.submission);
            setSubmitting(false);
        } catch (error) {
            const message = error instanceof FetchJsonError ? error.message : 'Submission failed.';

            show({ title: 'Submit failed', message, variant: 'error' });
            setSubmitting(false);
        }
    }, [challenge.id, githubForm, handleSubmissionResult, show, source]);

    return (
        <div className="flex h-[calc(100vh-8rem)] min-h-[32rem] flex-col overflow-hidden rounded-xl border border-zinc-950/10 bg-zinc-100 dark:border-white/10 dark:bg-zinc-900">
            <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-zinc-950/10 bg-white px-3 py-2 dark:border-white/10 dark:bg-zinc-950">
                <div className="flex flex-wrap items-center gap-2">
                    <div className="flex rounded-lg border border-zinc-950/10 p-0.5 dark:border-white/10">
                        <button
                            type="button"
                            onClick={() => setSource('editor')}
                            className={clsx(
                                'rounded-md px-2.5 py-1 text-[11px] font-medium',
                                source === 'editor' ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900' : 'text-zinc-500',
                            )}
                        >
                            Editor
                        </button>
                        <button
                            type="button"
                            onClick={() => setSource('github')}
                            disabled={!githubConnected}
                            className={clsx(
                                'rounded-md px-2.5 py-1 text-[11px] font-medium',
                                source === 'github' ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900' : 'text-zinc-500',
                                !githubConnected && 'opacity-40',
                            )}
                        >
                            GitHub
                        </button>
                    </div>
                    <span className="rounded bg-zinc-100 px-2 py-0.5 font-mono text-[11px] text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                        {challenge.language}
                    </span>
                    {evaluationDriver === 'docker' && (
                        <span className="rounded bg-violet-500/10 px-2 py-0.5 text-[10px] font-medium text-violet-600">Docker CI</span>
                    )}
                    <span className="text-[11px] text-zinc-500">{remaining} attempts left</span>
                </div>
                <div className="flex items-center gap-2">
                    {source === 'editor' && (
                        <Button type="button" outline className="!px-3 !py-1.5 !text-xs" onClick={handleRun} disabled={disabled || running || submitting}>
                            <PlayIcon data-slot="icon" className="!size-3.5" />
                            Run
                        </Button>
                    )}
                    <Button type="button" color="dark/zinc" className="!px-3 !py-1.5 !text-xs" onClick={handleSubmit} disabled={disabled || running || submitting}>
                        <PaperAirplaneIcon data-slot="icon" className="!size-3.5" />
                        {submitting && pollingId ? 'Evaluating…' : 'Submit'}
                    </Button>
                </div>
            </div>

            <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
                <ChallengeProblemPanel challenge={challenge} pathName={pathName} levelNumber={levelNumber} />

                <div className="flex min-h-0 flex-col border-t border-zinc-950/10 lg:border-t-0 lg:border-l dark:border-white/10">
                    {source === 'editor' ? (
                        <div className="min-h-0 flex-[3]">
                            <Editor
                                height="100%"
                                language={monacoLanguage(challenge.language)}
                                value={code}
                                onChange={(value) => setCode(value ?? '')}
                                theme="vs-dark"
                                options={{
                                    minimap: { enabled: false },
                                    fontSize: 13,
                                    lineNumbers: 'on',
                                    scrollBeyondLastLine: false,
                                    automaticLayout: true,
                                    padding: { top: 12, bottom: 12 },
                                    readOnly: disabled,
                                }}
                            />
                        </div>
                    ) : (
                        <div className="min-h-0 flex-[3] overflow-y-auto bg-zinc-950 p-4">
                            {!githubConnected ? (
                                <p className="text-xs text-zinc-400">
                                    Connect GitHub in{' '}
                                    <a href={route('integrations.edit')} className="text-blue-400 underline">
                                        Settings → Integrations
                                    </a>
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    <p className="flex items-center gap-2 text-xs text-zinc-400">
                                        <CodeBracketSquareIcon className="size-4" />
                                        Submit code from a repository file
                                    </p>
                                    {(['github_owner', 'github_repo', 'github_ref', 'github_path'] as const).map((field) => (
                                        <div key={field}>
                                            <label className="mb-1 block text-[10px] font-medium tracking-wide text-zinc-500 uppercase">
                                                {field.replace('github_', '')}
                                            </label>
                                            <Input
                                                value={githubForm[field]}
                                                onChange={(e) => setGithubForm((f) => ({ ...f, [field]: e.target.value }))}
                                                className="!text-xs"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                    <div className="min-h-0 flex-[2]">
                        <ChallengeResultsPanel
                            result={result}
                            loading={running || submitting}
                            activeTab={activeTab}
                            onTabChange={setActiveTab}
                            submissions={submissions}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
