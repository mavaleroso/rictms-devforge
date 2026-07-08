import {
    CodeBracketIcon,
    CommandLineIcon,
    GlobeAltIcon,
    ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import type { ComponentType, SVGProps } from 'react';

export interface LearningTrack {
    id: string;
    label: string;
    summary: string;
    highlights: string[];
    icon: ComponentType<SVGProps<SVGSVGElement>>;
    accent: string;
}

export const LEARNING_TRACKS: LearningTrack[] = [
    {
        id: 'programming',
        label: 'Programming',
        summary: 'Full-stack foundations, clean code, and real project delivery.',
        highlights: ['Languages & frameworks', 'APIs & databases', 'Capstone apps'],
        icon: CodeBracketIcon,
        accent: 'from-brand-600/20 to-brand-400/5 text-brand-700 ring-brand-500/20 dark:text-brand-300',
    },
    {
        id: 'networking',
        label: 'Networking',
        summary: 'Routing, switching, and infrastructure you can troubleshoot.',
        highlights: ['TCP/IP & DNS', 'VLANs & firewalls', 'Lab simulations'],
        icon: GlobeAltIcon,
        accent: 'from-sky-600/20 to-sky-400/5 text-sky-700 ring-sky-500/20 dark:text-sky-300',
    },
    {
        id: 'devops',
        label: 'DevOps',
        summary: 'Pipelines, containers, and reliable deployment workflows.',
        highlights: ['CI/CD pipelines', 'Docker & Linux', 'Monitoring basics'],
        icon: CommandLineIcon,
        accent: 'from-accent-600/20 to-accent-400/5 text-accent-700 ring-accent-500/20 dark:text-accent-300',
    },
    {
        id: 'cybersecurity',
        label: 'Cybersecurity',
        summary: 'Defensive skills, threat awareness, and secure operations.',
        highlights: ['Hardening & access', 'Incident response', 'Security reviews'],
        icon: ShieldCheckIcon,
        accent: 'from-violet-600/20 to-violet-400/5 text-violet-700 ring-violet-500/20 dark:text-violet-300',
    },
];

export const PLATFORM_HIGHLIGHTS = [
    {
        title: 'Structured learning paths',
        description: 'Progress level by level with readings, labs, quizzes, and challenges.',
    },
    {
        title: 'Hands-on assessment',
        description: 'Prove skills through coding tasks, practical checks, and capstone work.',
    },
    {
        title: 'Mentor-guided growth',
        description: 'Get feedback, reviews, and accountability as you advance.',
    },
] as const;
