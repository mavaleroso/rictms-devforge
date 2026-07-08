import {
    AcademicCapIcon,
    BeakerIcon,
    ChartBarIcon,
    RocketLaunchIcon,
} from '@heroicons/react/24/outline';
import type { ComponentType, SVGProps } from 'react';

export interface LearningProcessStep {
    id: string;
    step: number;
    title: string;
    summary: string;
    detail: string;
    icon: ComponentType<SVGProps<SVGSVGElement>>;
}

export const LEARNING_PROCESS_STEPS: LearningProcessStep[] = [
    {
        id: 'enroll',
        step: 1,
        title: 'Pick your discipline',
        summary: 'Start with programming, networking, DevOps, or cybersecurity.',
        detail: 'Each path is sequenced from fundamentals to job-ready tasks so interns know exactly what to tackle next.',
        icon: AcademicCapIcon,
    },
    {
        id: 'learn',
        step: 2,
        title: 'Follow structured levels',
        summary: 'Readings, videos, and guided labs build concepts step by step.',
        detail: 'Content unlocks progressively—complete a level to open the next module, quiz, or hands-on exercise.',
        icon: BeakerIcon,
    },
    {
        id: 'practice',
        step: 3,
        title: 'Prove skills in practice',
        summary: 'Quizzes, coding challenges, and capstone milestones validate mastery.',
        detail: 'Automated checks and mentor reviews ensure work reflects real troubleshooting, delivery, and security habits.',
        icon: ChartBarIcon,
    },
    {
        id: 'advance',
        step: 4,
        title: 'Earn recognition',
        summary: 'Track XP, badges, certificates, and mentor feedback as you grow.',
        detail: 'Leaders see completion analytics; interns leave with evidence of skills—not just hours logged.',
        icon: RocketLaunchIcon,
    },
];

export const PRACTICE_MODALITIES = [
    {
        title: 'Guided labs',
        description: 'Configure networks, deploy services, and debug realistic scenarios in a safe environment.',
    },
    {
        title: 'Coding challenges',
        description: 'Write and run code against test cases—same rigor you would see in technical interviews.',
    },
    {
        title: 'Knowledge checks',
        description: 'Short quizzes reinforce terminology, design choices, and operational best practices.',
    },
    {
        title: 'Capstone projects',
        description: 'Multi-week deliverables with milestones, journals, and mentor sign-off before completion.',
    },
] as const;
