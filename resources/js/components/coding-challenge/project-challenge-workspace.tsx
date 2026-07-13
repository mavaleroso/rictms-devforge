import { ChallengeProblemPanel, ChallengeResultsPanel } from '@/components/coding-challenge/challenge-panels';
import { ProjectBrowserPreview } from '@/components/coding-challenge/project-browser-preview';
import { VscodeExplorer } from '@/components/coding-challenge/vscode-explorer';
import { useToast } from '@/components/toast/toast-provider';
import { fetchJson, FetchJsonError } from '@/lib/fetch-json';
import {
    attemptsRemaining,
    mapSubmissionToEvaluationResult,
} from '@/lib/coding-challenge-library';
import { buildFileTree, collectFolderPaths, collectTopLevelFolderPaths } from '@/lib/coding-challenge-library/file-tree';
import type {
    ChallengeSubmission,
    CodingChallenge,
    EvaluationResponse,
    WorkspaceFile,
} from '@/lib/coding-challenge-library/types';
import Editor, { type Monaco } from '@monaco-editor/react';
import {
    BeakerIcon,
    BookOpenIcon,
    CodeBracketSquareIcon,
    FolderIcon,
    GlobeAltIcon,
    PaperAirplaneIcon,
    PlayIcon,
    ViewColumnsIcon,
    XMarkIcon,
} from '@heroicons/react/20/solid';
import clsx from 'clsx';
import { useCallback, useMemo, useState } from 'react';
import { configureMonacoSandbox } from '@/lib/coding-challenge-library/monaco-sandbox';

interface ProjectChallengeWorkspaceProps {
    challenge: CodingChallenge;
    pathName: string;
    levelNumber: number;
    initialSubmissions: ChallengeSubmission[];
}

type SidePanel = 'task' | 'tests' | null;
type EditorLayout = 'editor' | 'split' | 'browser';

function monacoFor(language: string): string {
    if (language === 'php') return 'php';
    if (language === 'markdown') return 'markdown';
    if (language === 'css') return 'css';
    if (language === 'json') return 'json';
    if (language === 'typescript' || language === 'tsx') return 'typescript';
    if (language === 'javascript' || language === 'jsx') return 'javascript';

    return 'plaintext';
}

function handleMonacoBeforeMount(monaco: Monaco) {
    configureMonacoSandbox(monaco);
}

function fileLabel(path: string): string {
    return path.split('/').pop() ?? path;
}

function initialFiles(challenge: CodingChallenge): Record<string, string> {
    const map: Record<string, string> = {};

    for (const file of challenge.workspace_files ?? []) {
        map[file.path] = file.content;
    }

    return map;
}

export function ProjectChallengeWorkspace({
    challenge,
    pathName,
    levelNumber,
    initialSubmissions,
}: ProjectChallengeWorkspaceProps) {
    const workspaceFiles = challenge.workspace_files ?? [];
    const targetFiles = challenge.target_files ?? [];
    const entry =
        targetFiles[0] ?? workspaceFiles.find((file) => file.editable)?.path ?? workspaceFiles[0]?.path ?? '';

    const tree = useMemo(
        () =>
            buildFileTree(
                workspaceFiles.map((file) => ({
                    path: file.path,
                    language: file.language,
                    editable: file.editable,
                })),
                targetFiles,
            ),
        [targetFiles, workspaceFiles],
    );

    const [files, setFiles] = useState<Record<string, string>>(() => initialFiles(challenge));
    const [activePath, setActivePath] = useState<string | null>(entry || null);
    const [openTabs, setOpenTabs] = useState<string[]>(entry ? [entry] : []);
    const [openFolders, setOpenFolders] = useState<Set<string>>(
        () => new Set(collectTopLevelFolderPaths(tree)),
    );
    const [explorerVisible, setExplorerVisible] = useState(true);
    const [explorerSectionOpen, setExplorerSectionOpen] = useState(true);
    const [sidePanel, setSidePanel] = useState<SidePanel>('task');
    const [editorLayout, setEditorLayout] = useState<EditorLayout>('split');
    const [previewRefreshKey, setPreviewRefreshKey] = useState(0);
    const [result, setResult] = useState<EvaluationResponse | null>(null);
    const [submissions, setSubmissions] = useState(initialSubmissions);
    const [running, setRunning] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [resultsTab, setResultsTab] = useState<'tests' | 'submissions'>('tests');
    const [passed, setPassed] = useState(challenge.passed ?? false);

    const { show, showSuccess } = useToast();
    const remaining = attemptsRemaining({
        ...challenge,
        passed,
        attempts_used: submissions.length || challenge.attempts_used,
    });
    const disabled = passed || remaining <= 0;

    const activeFile: WorkspaceFile | undefined = useMemo(
        () => workspaceFiles.find((file) => file.path === activePath),
        [activePath, workspaceFiles],
    );
    const editable = activeFile?.editable ?? false;

    const openFile = useCallback((path: string) => {
        setActivePath(path);
        setOpenTabs((tabs) => (tabs.includes(path) ? tabs : [...tabs, path]));
    }, []);

    const closeTab = useCallback(
        (path: string) => {
            setOpenTabs((tabs) => {
                const next = tabs.filter((tab) => tab !== path);

                if (activePath === path) {
                    setActivePath(next[next.length - 1] ?? null);
                }

                return next;
            });
        },
        [activePath],
    );

    const toggleFolder = useCallback((path: string) => {
        setOpenFolders((current) => {
            const next = new Set(current);

            if (next.has(path)) {
                next.delete(path);
            } else {
                next.add(path);
            }

            return next;
        });
    }, []);

    const collapseAllFolders = useCallback(() => {
        setOpenFolders(new Set());
    }, []);

    const expandAllFolders = useCallback(() => {
        setOpenFolders(new Set(collectFolderPaths(tree)));
    }, [tree]);

    const explorerProps = {
        nodes: tree,
        activePath,
        openFolders,
        onToggleFolder: toggleFolder,
        onOpenFile: openFile,
        onCollapseAll: collapseAllFolders,
        onExpandAll: expandAllFolders,
        sectionOpen: explorerSectionOpen,
        onToggleSection: () => setExplorerSectionOpen((open) => !open),
    };

    const handleRun = useCallback(async () => {
        setRunning(true);
        setSidePanel('tests');
        setResultsTab('tests');
        setPreviewRefreshKey((key) => key + 1);

        if (editorLayout === 'editor') {
            setEditorLayout('split');
        }

        try {
            const response = await fetchJson<EvaluationResponse>(route('learn.challenges.run', challenge.id), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ files }),
            });
            setResult(response);
        } catch (error) {
            const message = error instanceof FetchJsonError ? error.message : 'Failed to run checks.';
            show({ title: 'Run failed', message, variant: 'error' });
        } finally {
            setRunning(false);
        }
    }, [challenge.id, editorLayout, files, show]);

    const handleSubmit = useCallback(async () => {
        setSubmitting(true);
        setSidePanel('tests');
        setResultsTab('tests');

        try {
            const response = await fetchJson<{ submission: ChallengeSubmission }>(
                route('learn.challenges.submit', challenge.id),
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ source: 'editor', files }),
                },
            );

            setSubmissions((prev) => [response.submission, ...prev.filter((item) => item.id !== response.submission.id)]);
            setResult(mapSubmissionToEvaluationResult(response.submission));

            if (response.submission.status === 'passed' || response.submission.status === 'approved') {
                setPassed(true);
                showSuccess('Accepted', 'Project checks passed. Level progress updated.');
            } else if (response.submission.status === 'needs_review') {
                showSuccess('Submitted for review', 'Waiting for mentor approval.');
            } else {
                show({
                    title: 'Not accepted',
                    message: `${response.submission.tests_passed}/${response.submission.tests_total} checks passed.`,
                    variant: 'info',
                });
            }
        } catch (error) {
            const message = error instanceof FetchJsonError ? error.message : 'Submission failed.';
            show({ title: 'Submit failed', message, variant: 'error' });
        } finally {
            setSubmitting(false);
        }
    }, [challenge.id, files, show, showSuccess]);

    const lineCount = (files[activePath ?? ''] ?? '').split('\n').length;

    return (
        <div className="flex h-[calc(100vh-8rem)] min-h-[36rem] flex-col overflow-hidden rounded-xl border border-[#3c3c3c] bg-[#1e1e1e] shadow-xl">
            {/* Title bar */}
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-[#3c3c3c] bg-[#3c3c3c] px-3 py-1.5">
                <div className="flex min-w-0 items-center gap-2">
                    <CodeBracketSquareIcon className="size-4 text-[#cccccc]" />
                    <p className="truncate text-[12px] text-[#cccccc]">
                        {challenge.title} — {challenge.environment_label ?? 'Laravel + Inertia + React'}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="hidden text-[11px] text-[#9d9d9d] sm:inline">{remaining} attempts left</span>
                    <div className="hidden items-center rounded border border-[#555] sm:flex">
                        <button
                            type="button"
                            title="Editor only"
                            onClick={() => setEditorLayout('editor')}
                            className={clsx(
                                'px-2 py-1 text-[11px]',
                                editorLayout === 'editor' ? 'bg-[#094771] text-white' : 'text-[#cccccc] hover:bg-[#505050]',
                            )}
                        >
                            Code
                        </button>
                        <button
                            type="button"
                            title="Split view"
                            onClick={() => setEditorLayout('split')}
                            className={clsx(
                                'border-l border-[#555] px-2 py-1 text-[11px]',
                                editorLayout === 'split' ? 'bg-[#094771] text-white' : 'text-[#cccccc] hover:bg-[#505050]',
                            )}
                        >
                            Split
                        </button>
                        <button
                            type="button"
                            title="Simple Browser"
                            onClick={() => {
                                setEditorLayout('browser');
                                setPreviewRefreshKey((key) => key + 1);
                            }}
                            className={clsx(
                                'border-l border-[#555] px-2 py-1 text-[11px]',
                                editorLayout === 'browser' ? 'bg-[#094771] text-white' : 'text-[#cccccc] hover:bg-[#505050]',
                            )}
                        >
                            Browser
                        </button>
                    </div>
                    <button
                        type="button"
                        onClick={handleRun}
                        disabled={disabled || running || submitting}
                        className="inline-flex h-7 items-center gap-1 rounded bg-[#0e639c] px-2.5 text-[11px] font-medium text-white hover:bg-[#1177bb] disabled:opacity-50"
                    >
                        <PlayIcon className="size-3.5" />
                        Run
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={disabled || running || submitting}
                        className="inline-flex h-7 items-center gap-1 rounded bg-[#388a34] px-2.5 text-[11px] font-medium text-white hover:bg-[#419c3c] disabled:opacity-50"
                    >
                        <PaperAirplaneIcon className="size-3.5" />
                        Submit
                    </button>
                </div>
            </div>

            <div className="flex min-h-0 flex-1">
                {/* Activity bar */}
                <div className="flex w-12 shrink-0 flex-col items-center gap-1 border-r border-[#3c3c3c] bg-[#333333] py-2">
                    <button
                        type="button"
                        title={explorerVisible ? 'Hide Explorer' : 'Show Explorer'}
                        onClick={() => setExplorerVisible((visible) => !visible)}
                        className={clsx(
                            'flex size-10 items-center justify-center border-l-2',
                            explorerVisible
                                ? 'border-white text-white'
                                : 'border-transparent text-[#858585] hover:text-[#cccccc]',
                        )}
                    >
                        <FolderIcon className="size-5" />
                    </button>
                    <button
                        type="button"
                        title="Editor"
                        onClick={() => setEditorLayout('editor')}
                        className={clsx(
                            'flex size-10 items-center justify-center border-l-2',
                            editorLayout === 'editor'
                                ? 'border-white text-white'
                                : 'border-transparent text-[#858585] hover:text-[#cccccc]',
                        )}
                    >
                        <CodeBracketSquareIcon className="size-5" />
                    </button>
                    <button
                        type="button"
                        title="Split editor & browser"
                        onClick={() => setEditorLayout('split')}
                        className={clsx(
                            'flex size-10 items-center justify-center border-l-2',
                            editorLayout === 'split'
                                ? 'border-white text-white'
                                : 'border-transparent text-[#858585] hover:text-[#cccccc]',
                        )}
                    >
                        <ViewColumnsIcon className="size-5" />
                    </button>
                    <button
                        type="button"
                        title="Simple Browser"
                        onClick={() => {
                            setEditorLayout('browser');
                            setPreviewRefreshKey((key) => key + 1);
                        }}
                        className={clsx(
                            'flex size-10 items-center justify-center border-l-2',
                            editorLayout === 'browser'
                                ? 'border-white text-white'
                                : 'border-transparent text-[#858585] hover:text-[#cccccc]',
                        )}
                    >
                        <GlobeAltIcon className="size-5" />
                    </button>
                    <button
                        type="button"
                        title="Task brief"
                        onClick={() => setSidePanel((panel) => (panel === 'task' ? null : 'task'))}
                        className={clsx(
                            'flex size-10 items-center justify-center border-l-2',
                            sidePanel === 'task' ? 'border-white text-white' : 'border-transparent text-[#858585] hover:text-[#cccccc]',
                        )}
                    >
                        <BookOpenIcon className="size-5" />
                    </button>
                    <button
                        type="button"
                        title="Tests & submissions"
                        onClick={() => setSidePanel((panel) => (panel === 'tests' ? null : 'tests'))}
                        className={clsx(
                            'flex size-10 items-center justify-center border-l-2',
                            sidePanel === 'tests' ? 'border-white text-white' : 'border-transparent text-[#858585] hover:text-[#cccccc]',
                        )}
                    >
                        <BeakerIcon className="size-5" />
                    </button>
                </div>

                {/* Explorer sidebar */}
                {explorerVisible && (
                    <div className="hidden w-60 shrink-0 border-r border-[#3c3c3c] md:block">
                        <VscodeExplorer {...explorerProps} />
                    </div>
                )}

                {/* Editor + browser */}
                <div className="flex min-w-0 flex-1">
                    {editorLayout !== 'browser' && (
                        <div
                            className={clsx(
                                'flex min-w-0 flex-col',
                                editorLayout === 'split' ? 'w-full lg:w-1/2 lg:border-r lg:border-[#3c3c3c]' : 'w-full',
                            )}
                        >
                            {/* Tabs */}
                            <div className="flex shrink-0 overflow-x-auto border-b border-[#3c3c3c] bg-[#252526]">
                                {openTabs.length === 0 ? (
                                    <div className="px-3 py-2 text-[11px] text-[#6e6e6e]">No file open</div>
                                ) : (
                                    openTabs.map((path) => {
                                        const meta = workspaceFiles.find((file) => file.path === path);
                                        const active = path === activePath;

                                        return (
                                            <div
                                                key={path}
                                                className={clsx(
                                                    'group flex max-w-[12rem] items-center gap-1 border-r border-[#3c3c3c] px-2 py-1.5 text-[12px]',
                                                    active ? 'bg-[#1e1e1e] text-white' : 'bg-[#2d2d2d] text-[#969696]',
                                                )}
                                            >
                                                <button type="button" onClick={() => openFile(path)} className="truncate">
                                                    {fileLabel(path)}
                                                    {meta?.editable === false ? ' 🔒' : ''}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => closeTab(path)}
                                                    className="rounded p-0.5 opacity-0 hover:bg-[#3c3c3c] group-hover:opacity-100"
                                                    aria-label={`Close ${path}`}
                                                >
                                                    <XMarkIcon className="size-3.5" />
                                                </button>
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            {/* Breadcrumb */}
                            <div className="shrink-0 border-b border-[#3c3c3c] bg-[#1e1e1e] px-3 py-1 text-[11px] text-[#85929e]">
                                {activePath ? activePath.replaceAll('/', ' › ') : 'Select a file from the Explorer'}
                                {activePath && !editable && <span className="ml-2 text-[#e2c08d]">read-only</span>}
                                {activePath && targetFiles.includes(activePath) && (
                                    <span className="ml-2 rounded bg-[#e2c08d]/15 px-1.5 py-0.5 text-[#e2c08d]">task file</span>
                                )}
                            </div>

                            {/* Mobile explorer */}
                            <div className="max-h-48 shrink-0 overflow-y-auto border-b border-[#3c3c3c] md:hidden">
                                <VscodeExplorer {...explorerProps} />
                            </div>

                            <div className="min-h-0 flex-1 bg-[#1e1e1e]">
                                {activePath ? (
                                    <Editor
                                        height="100%"
                                        theme="vs-dark"
                                        path={activePath}
                                        language={monacoFor(activeFile?.language ?? 'plaintext')}
                                        value={files[activePath] ?? ''}
                                        beforeMount={handleMonacoBeforeMount}
                                        onChange={(value) => {
                                            if (!editable || disabled) {
                                                return;
                                            }

                                            setFiles((prev) => ({ ...prev, [activePath]: value ?? '' }));
                                        }}
                                        options={{
                                            readOnly: !editable || disabled,
                                            minimap: { enabled: editorLayout === 'editor', scale: 1 },
                                            fontSize: 13,
                                            fontFamily: "Menlo, Monaco, 'Courier New', monospace",
                                            lineNumbers: 'on',
                                            renderLineHighlight: 'line',
                                            scrollBeyondLastLine: false,
                                            automaticLayout: true,
                                            tabSize: 4,
                                            wordWrap: 'on',
                                            bracketPairColorization: { enabled: true },
                                            smoothScrolling: true,
                                            cursorBlinking: 'smooth',
                                            padding: { top: 8 },
                                        }}
                                    />
                                ) : (
                                    <div className="flex h-full flex-col items-center justify-center gap-2 text-[#6e6e6e]">
                                        <CodeBracketSquareIcon className="size-10 opacity-40" />
                                        <p className="text-sm">Open a file from the Explorer sidebar</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {editorLayout !== 'editor' && (
                        <div
                            className={clsx(
                                'min-h-0 min-w-0',
                                editorLayout === 'browser' ? 'w-full' : 'hidden w-full lg:block lg:w-1/2',
                            )}
                        >
                            <ProjectBrowserPreview
                                files={files}
                                refreshKey={previewRefreshKey}
                                previewUrl={challenge.preview_url}
                                previewPath={challenge.preview_path}
                                className="h-full"
                            />
                        </div>
                    )}
                </div>

                {/* Right secondary panel */}
                {sidePanel && (
                    <div className="hidden w-[22rem] shrink-0 flex-col border-l border-[#3c3c3c] bg-[#1e1e1e] xl:flex">
                        <div className="flex items-center justify-between border-b border-[#3c3c3c] bg-[#252526] px-3 py-2">
                            <p className="text-[11px] font-semibold tracking-wide text-[#bbbbbb] uppercase">
                                {sidePanel === 'task' ? 'Task' : 'Output'}
                            </p>
                            <button type="button" onClick={() => setSidePanel(null)} className="text-[#cccccc] hover:text-white">
                                <XMarkIcon className="size-4" />
                            </button>
                        </div>
                        <div className="min-h-0 flex-1 overflow-hidden">
                            {sidePanel === 'task' ? (
                                <div className="h-full overflow-y-auto bg-white dark:bg-zinc-950">
                                    <ChallengeProblemPanel
                                        challenge={challenge}
                                        pathName={pathName}
                                        levelNumber={levelNumber}
                                    />
                                </div>
                            ) : (
                                <ChallengeResultsPanel
                                    result={result}
                                    loading={running || submitting}
                                    submissions={submissions}
                                    activeTab={resultsTab}
                                    onTabChange={setResultsTab}
                                />
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Compact panels for smaller screens */}
            <div className="max-h-72 shrink-0 border-t border-[#3c3c3c] xl:hidden">
                <div className="flex border-b border-[#3c3c3c] bg-[#252526]">
                    <button
                        type="button"
                        onClick={() => setSidePanel('task')}
                        className={clsx(
                            'px-3 py-1.5 text-[11px]',
                            sidePanel === 'task' ? 'bg-[#1e1e1e] text-white' : 'text-[#969696]',
                        )}
                    >
                        Task
                    </button>
                    <button
                        type="button"
                        onClick={() => setSidePanel('tests')}
                        className={clsx(
                            'px-3 py-1.5 text-[11px]',
                            sidePanel === 'tests' ? 'bg-[#1e1e1e] text-white' : 'text-[#969696]',
                        )}
                    >
                        Output
                    </button>
                    {editorLayout === 'split' && (
                        <button
                            type="button"
                            onClick={() => setEditorLayout('browser')}
                            className="px-3 py-1.5 text-[11px] text-[#969696]"
                        >
                            Browser
                        </button>
                    )}
                </div>
                <div className="h-52 overflow-hidden bg-white dark:bg-zinc-950">
                    {sidePanel === 'tests' ? (
                        <ChallengeResultsPanel
                            result={result}
                            loading={running || submitting}
                            submissions={submissions}
                            activeTab={resultsTab}
                            onTabChange={setResultsTab}
                        />
                    ) : (
                        <div className="h-full overflow-y-auto">
                            <ChallengeProblemPanel challenge={challenge} pathName={pathName} levelNumber={levelNumber} />
                        </div>
                    )}
                </div>
            </div>

            {/* Status bar */}
            <div className="flex shrink-0 items-center justify-between gap-3 bg-[#007acc] px-3 py-1 text-[11px] text-white">
                <div className="flex min-w-0 items-center gap-3">
                    <span className="truncate">{challenge.environment_label ?? 'Laravel + Inertia + React'}</span>
                    <span className="hidden sm:inline">Project sandbox</span>
                    <span className="hidden sm:inline">
                        {editorLayout === 'browser' ? 'Simple Browser' : editorLayout === 'split' ? 'Split view' : 'Editor'}
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    {activeFile && <span>{monacoFor(activeFile.language).toUpperCase()}</span>}
                    {activePath && <span>Ln {lineCount}</span>}
                    <span>UTF-8</span>
                    <span>{passed ? 'Solved' : `${remaining} left`}</span>
                </div>
            </div>
        </div>
    );
}
