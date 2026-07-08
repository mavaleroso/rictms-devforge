import { Badge } from '@/components/catalyst/badge';
import {
    LAB_SHOWCASE_ITEMS,
    LAB_TOOLING_HIGHLIGHTS,
    PROGRAMMING_DEMO_CODE,
    PROGRAMMING_TEST_CASES,
    type LabShowcaseItem,
} from '@/lib/lab-showcase';
import { accent, surfaces } from '@/lib/theme';
import {
    CheckCircleIcon,
    PlayIcon,
    PaperAirplaneIcon,
} from '@heroicons/react/20/solid';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';

type RunState = 'idle' | 'compiling' | 'running' | 'passed';

function ProgrammingLabMock() {
    const [runState, setRunState] = useState<RunState>('idle');
    const [visibleTests, setVisibleTests] = useState(0);

    const runTests = () => {
        if (runState === 'compiling' || runState === 'running') {
            return;
        }

        setRunState('compiling');
        setVisibleTests(0);

        window.setTimeout(() => setRunState('running'), 700);

        PROGRAMMING_TEST_CASES.forEach((_, index) => {
            window.setTimeout(() => setVisibleTests(index + 1), 1200 + index * 550);
        });

        window.setTimeout(() => setRunState('passed'), 1200 + PROGRAMMING_TEST_CASES.length * 550 + 300);
    };

    useEffect(() => {
        const timer = window.setTimeout(runTests, 1200);

        return () => window.clearTimeout(timer);
    }, []);

    return (
        <div className={clsx('overflow-hidden', surfaces.card)}>
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 px-3 py-2 dark:border-slate-800">
                <div className="flex flex-wrap items-center gap-2">
                    <div className="flex rounded-lg border border-slate-200/80 p-0.5 dark:border-slate-700">
                        <span className="rounded-md bg-slate-900 px-2.5 py-1 text-[11px] font-medium text-white dark:bg-white dark:text-slate-900">
                            Editor
                        </span>
                        <span className="rounded-md px-2.5 py-1 text-[11px] font-medium text-slate-500">GitHub</span>
                    </div>
                    <span className="rounded bg-brand-50 px-2 py-0.5 font-mono text-[11px] text-brand-700 dark:bg-brand-950/50 dark:text-brand-300">
                        javascript
                    </span>
                    <Badge color="zinc" className="!text-[10px]">
                        Docker CI
                    </Badge>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={runTests}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200/80 px-2.5 py-1 text-[11px] font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                        <PlayIcon className="size-3.5" />
                        Run
                    </button>
                    <button
                        type="button"
                        className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-2.5 py-1 text-[11px] font-medium text-white dark:bg-white dark:text-slate-900"
                    >
                        <PaperAirplaneIcon className="size-3.5" />
                        Submit
                    </button>
                </div>
            </div>

            <div className="grid lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
                <div className="border-b border-slate-200/80 p-4 lg:border-r lg:border-b-0 dark:border-slate-800">
                    <div className="flex flex-wrap items-center gap-2">
                        <Badge color="zinc" className="!text-[10px]">
                            JAVASCRIPT
                        </Badge>
                        <Badge color="lime" className="gap-1 !text-[10px]">
                            <CheckCircleIcon className="size-3" />
                            Solved
                        </Badge>
                    </div>
                    <h3 className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">Two Sum</h3>
                    <p className="mt-1 text-[11px] text-slate-500">Programming · Level 3 · 2 attempts left</p>
                    <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                        Return indices of two numbers that add up to the target. Assume exactly one solution exists.
                    </p>
                    <div className="mt-3 rounded-lg border border-slate-200/80 bg-slate-50/80 p-3 text-[11px] dark:border-slate-800 dark:bg-slate-900/60">
                        <p className="font-medium text-slate-900 dark:text-white">Example</p>
                        <p className="mt-1 font-mono text-slate-600 dark:text-slate-300">Input: nums = [2,7,11,15], target = 9</p>
                        <p className="font-mono text-slate-600 dark:text-slate-300">Output: [0,1]</p>
                    </div>
                </div>

                <div className="flex flex-col">
                    <div className="border-b border-slate-200/80 bg-slate-950 px-3 py-2 dark:border-slate-800">
                        <div className="flex items-center gap-1.5">
                            <span className="size-2.5 rounded-full bg-red-400/80" />
                            <span className="size-2.5 rounded-full bg-amber-400/80" />
                            <span className="size-2.5 rounded-full bg-emerald-400/80" />
                            <span className="ml-2 font-mono text-[10px] text-slate-400">solution.js</span>
                        </div>
                    </div>
                    <pre className="max-h-52 overflow-auto bg-slate-950 p-3 font-mono text-[11px] leading-5 text-slate-100">
                        <code>
                            <span className="text-violet-300">function </span>
                            <span className="text-sky-300">twoSum</span>
                            <span className="text-slate-300">(nums, target) {'{'}</span>
                            {'\n'}
                            <span className="text-violet-300">  const </span>
                            <span className="text-slate-300">seen = </span>
                            <span className="text-amber-300">new </span>
                            <span className="text-sky-300">Map</span>
                            <span className="text-slate-300">();</span>
                            {'\n\n'}
                            <span className="text-violet-300">  for </span>
                            <span className="text-slate-300">(</span>
                            <span className="text-violet-300">let </span>
                            <span className="text-slate-300">i = </span>
                            <span className="text-amber-300">0</span>
                            <span className="text-slate-300">; i &lt; nums.length; i++) {'{'}</span>
                            {'\n'}
                            <span className="text-slate-300">    </span>
                            <span className="text-violet-300">const </span>
                            <span className="text-slate-300">need = target - nums[i];</span>
                            {'\n'}
                            <span className="text-violet-300">    if </span>
                            <span className="text-slate-300">(seen.has(need)) {'{'}</span>
                            {'\n'}
                            <span className="text-violet-300">      return </span>
                            <span className="text-slate-300">[seen.get(need), i];</span>
                            {'\n'}
                            <span className="text-slate-300">    {'}'}</span>
                            {'\n'}
                            <span className="text-slate-300">    seen.set(nums[i], i);</span>
                            {'\n'}
                            <span className="text-slate-300">  {'}'}</span>
                            {'\n\n'}
                            <span className="text-violet-300">  return </span>
                            <span className="text-slate-300">[];</span>
                            {'\n'}
                            <span className="text-slate-300">{'}'}</span>
                        </code>
                    </pre>

                    <div className="border-t border-slate-200/80 p-3 dark:border-slate-800">
                        <div className="flex items-center justify-between gap-2">
                            <p className="text-[11px] font-semibold tracking-wide text-slate-500 uppercase">Test results</p>
                            <AnimatePresence mode="wait">
                                {runState === 'passed' && (
                                    <motion.span
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400"
                                    >
                                        3/3 passed · 37ms
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="mt-2 rounded-lg border border-slate-200/80 bg-slate-50/70 p-2.5 font-mono text-[10px] dark:border-slate-800 dark:bg-slate-900/50">
                            {runState === 'idle' && <p className="text-slate-500">Click Run to compile and execute test cases.</p>}
                            {runState === 'compiling' && (
                                <motion.p animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.2 }} className="text-brand-600 dark:text-brand-400">
                                    {'>'} Compiling javascript…
                                </motion.p>
                            )}
                            {runState === 'running' && (
                                <motion.p animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.2 }} className="text-brand-600 dark:text-brand-400">
                                    {'>'} Running {PROGRAMMING_TEST_CASES.length} test cases in sandbox…
                                </motion.p>
                            )}
                            {runState === 'passed' && (
                                <p className="text-emerald-600 dark:text-emerald-400">{'>'} All tests passed. Ready to submit.</p>
                            )}
                        </div>

                        <ul className="mt-2 space-y-1.5">
                            {PROGRAMMING_TEST_CASES.map((testCase, index) => (
                                <AnimatePresence key={testCase.name}>
                                    {visibleTests > index && (
                                        <motion.li
                                            initial={{ opacity: 0, x: -8 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="flex items-start justify-between gap-2 rounded-md border border-emerald-200/80 bg-emerald-50/70 px-2.5 py-1.5 text-[11px] dark:border-emerald-900/50 dark:bg-emerald-950/20"
                                        >
                                            <div className="min-w-0">
                                                <p className="font-medium text-emerald-800 dark:text-emerald-300">{testCase.name}</p>
                                                <p className="mt-0.5 truncate font-mono text-[10px] text-emerald-700/80 dark:text-emerald-400/80">
                                                    {testCase.input} → {testCase.output}
                                                </p>
                                            </div>
                                            <span className="shrink-0 text-[10px] text-emerald-700 dark:text-emerald-400">{testCase.ms}ms</span>
                                        </motion.li>
                                    )}
                                </AnimatePresence>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

function NetworkingLabMock() {
    const lines = [
        { prompt: 'R1# configure terminal', output: 'Enter configuration commands, one per line. End with CNTL/Z.' },
        { prompt: 'R1(config)# vlan 20', output: '' },
        { prompt: 'R1(config-vlan)# name INTERN-DEV', output: '' },
        { prompt: 'R1(config)# int gi0/2', output: '' },
        { prompt: 'R1(config-if)# switchport mode access', output: '' },
        { prompt: 'R1(config-if)# switchport access vlan 20', output: '' },
        { prompt: 'R1# show vlan brief', output: '20   INTERN-DEV    active    Gi0/2' },
        { prompt: 'R1# ping 10.20.0.1', output: 'Success rate is 100 percent (5/5)' },
    ];

    return (
        <TerminalMock title="network-lab.session" lines={lines} status="VLAN assignment validated · connectivity check passed" />
    );
}

function DevopsLabMock() {
    const lines = [
        { prompt: '$ pipeline validate deploy.yml', output: 'schema: ok · stages: build, test, deploy' },
        { prompt: '$ docker build -t api:lab-42 .', output: 'Step 8/8 : exporting layers — done' },
        { prompt: '$ docker run --rm api:lab-42 npm test', output: 'Test Suites: 12 passed, 12 total' },
        { prompt: '$ kubectl apply -f k8s/service.yaml', output: 'service/api created' },
        { prompt: '$ kubectl rollout status deploy/api', output: 'deployment "api" successfully rolled out' },
        { prompt: '$ curl -fsS https://lab.local/health', output: '{"status":"ok","version":"lab-42"}' },
    ];

    return (
        <TerminalMock title="devops-pipeline.log" lines={lines} status="Build, test, and deploy checks completed" />
    );
}

function SecurityLabMock() {
    const lines = [
        { prompt: '$ scan config --target web-01', output: 'Finding: SSH password auth enabled (high)' },
        { prompt: '$ scan config --target web-01', output: 'Finding: TLS 1.0 enabled on :443 (medium)' },
        { prompt: '$ harden sshd_config', output: 'Applied: PasswordAuthentication no' },
        { prompt: '$ harden nginx/ssl', output: 'Applied: ssl_protocols TLSv1.2 TLSv1.3' },
        { prompt: '$ scan config --target web-01', output: '0 high · 0 medium · 2 informational' },
        { prompt: '$ incident triage ALERT-1842', output: 'Classified: brute-force attempt · blocked at WAF' },
    ];

    return (
        <TerminalMock title="security-remediation.session" lines={lines} status="Misconfigurations remediated · alert triaged" />
    );
}

function TerminalMock({
    title,
    lines,
    status,
}: {
    title: string;
    lines: { prompt: string; output: string }[];
    status: string;
}) {
    return (
        <div className={clsx('overflow-hidden', surfaces.card)}>
            <div className="border-b border-slate-200/80 bg-slate-950 px-3 py-2 dark:border-slate-800">
                <div className="flex items-center gap-1.5">
                    <span className="size-2.5 rounded-full bg-red-400/80" />
                    <span className="size-2.5 rounded-full bg-amber-400/80" />
                    <span className="size-2.5 rounded-full bg-emerald-400/80" />
                    <span className="ml-2 font-mono text-[10px] text-slate-400">{title}</span>
                </div>
            </div>
            <div className="space-y-1.5 bg-slate-950 p-4 font-mono text-[11px] leading-5">
                {lines.map((line) => (
                    <div key={line.prompt}>
                        <p className="text-emerald-400">{line.prompt}</p>
                        {line.output && <p className="text-slate-400">{line.output}</p>}
                    </div>
                ))}
            </div>
            <div className="border-t border-slate-200/80 bg-emerald-50/70 px-4 py-2.5 text-[11px] font-medium text-emerald-700 dark:border-slate-800 dark:bg-emerald-950/20 dark:text-emerald-400">
                {status}
            </div>
        </div>
    );
}

function LabMock({ item }: { item: LabShowcaseItem }) {
    switch (item.id) {
        case 'programming':
            return <ProgrammingLabMock />;
        case 'networking':
            return <NetworkingLabMock />;
        case 'devops':
            return <DevopsLabMock />;
        case 'security':
            return <SecurityLabMock />;
        default:
            return null;
    }
}

export function LabShowcase() {
    const [activeId, setActiveId] = useState(LAB_SHOWCASE_ITEMS[0].id);
    const activeItem = LAB_SHOWCASE_ITEMS.find((item) => item.id === activeId) ?? LAB_SHOWCASE_ITEMS[0];

    return (
        <div className="space-y-6">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {LAB_TOOLING_HIGHLIGHTS.map((tool) => {
                    const Icon = tool.icon;

                    return (
                        <div key={tool.label} className={clsx('p-4', surfaces.cardMuted)}>
                            <span className={clsx('inline-flex size-8 items-center justify-center rounded-lg', accent.bgSoft)}>
                                <Icon className={clsx('size-4', accent.textSoft)} />
                            </span>
                            <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">{tool.label}</p>
                            <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">{tool.description}</p>
                        </div>
                    );
                })}
            </div>

            <div className="flex flex-wrap gap-2">
                {LAB_SHOWCASE_ITEMS.map((item) => {
                    const Icon = item.icon;

                    return (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => setActiveId(item.id)}
                            className={clsx(
                                'inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition sm:text-sm',
                                activeId === item.id
                                    ? clsx(accent.bgActive, 'border-brand-200/80 dark:border-brand-800/60')
                                    : clsx(surfaces.cardMuted, 'hover:border-slate-300 dark:hover:border-slate-700'),
                            )}
                        >
                            <Icon className="size-4" />
                            {item.label}
                        </button>
                    );
                })}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeItem.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-4"
                >
                    <div className="max-w-3xl">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{activeItem.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{activeItem.summary}</p>
                        <ul className="mt-3 flex flex-wrap gap-2">
                            {activeItem.capabilities.map((capability) => (
                                <li
                                    key={capability}
                                    className="rounded-full border border-slate-200/80 bg-white px-2.5 py-1 text-[11px] text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                                >
                                    {capability}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <LabMock item={activeItem} />
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
