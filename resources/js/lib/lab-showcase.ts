import type { ComponentType, SVGProps } from 'react';
import {
    BeakerIcon,
    CodeBracketIcon,
    CommandLineIcon,
    CpuChipIcon,
    GlobeAltIcon,
    ShieldCheckIcon,
} from '@heroicons/react/24/outline';

export interface LabShowcaseItem {
    id: string;
    label: string;
    title: string;
    summary: string;
    capabilities: string[];
    icon: ComponentType<SVGProps<SVGSVGElement>>;
}

export const LAB_SHOWCASE_ITEMS: LabShowcaseItem[] = [
    {
        id: 'programming',
        label: 'Programming',
        title: 'In-browser editor, compiler, and test runner',
        summary:
            'Write code in a Monaco editor, compile in a sandbox, and validate output against sample and hidden test cases—just like a technical interview.',
        capabilities: ['Monaco editor', 'Run & submit', 'Test case runner', 'GitHub handoff', 'Docker sandbox'],
        icon: CodeBracketIcon,
    },
    {
        id: 'networking',
        label: 'Networking',
        title: 'Topology labs and packet troubleshooting',
        summary:
            'Configure VLANs, trace routes, inspect DNS, and resolve connectivity issues in guided network scenarios.',
        capabilities: ['CLI simulator', 'Topology builder', 'Packet checks', 'Config validator', 'Scenario hints'],
        icon: GlobeAltIcon,
    },
    {
        id: 'devops',
        label: 'DevOps',
        title: 'Pipelines, containers, and deployment checks',
        summary:
            'Author CI/CD YAML, build images, deploy services, and verify health checks before promoting to production.',
        capabilities: ['Pipeline editor', 'Build logs', 'Container deploy', 'Health probes', 'Rollback drills'],
        icon: CommandLineIcon,
    },
    {
        id: 'security',
        label: 'Cybersecurity',
        title: 'Hardening drills and incident response',
        summary:
            'Audit misconfigurations, triage alerts, and apply defensive controls with mentor-reviewed remediation steps.',
        capabilities: ['Config scanner', 'Alert triage', 'Access review', 'Patch workflow', 'IR playbooks'],
        icon: ShieldCheckIcon,
    },
];

export const PROGRAMMING_TEST_CASES = [
    { name: 'Sample case', input: '[2,7,11,15], 9', output: '[0,1]', ms: 12, passed: true },
    { name: 'Hidden case #1', input: '[3,2,4], 6', output: '[1,2]', ms: 14, passed: true },
    { name: 'Hidden case #2', input: '[3,3], 6', output: '[0,1]', ms: 11, passed: true },
] as const;

export const LAB_TOOLING_HIGHLIGHTS = [
    { label: 'Editor', description: 'Syntax highlighting, line numbers, and starter templates.', icon: CodeBracketIcon },
    { label: 'Compiler', description: 'Language runtimes execute in an isolated sandbox.', icon: CpuChipIcon },
    { label: 'Tester', description: 'Output is compared against expected results automatically.', icon: BeakerIcon },
] as const;
