import {
    AcademicCapIcon,
    BeakerIcon,
    BookOpenIcon,
    CodeBracketIcon,
    CommandLineIcon,
    CpuChipIcon,
    GlobeAltIcon,
    RocketLaunchIcon,
    ServerStackIcon,
} from '@heroicons/react/24/outline';
import type { ComponentType, SVGProps } from 'react';

export const PATH_ICON_OPTIONS = [
    { value: 'code-bracket', label: 'Code' },
    { value: 'book-open', label: 'Book' },
    { value: 'rocket-launch', label: 'Rocket' },
    { value: 'academic-cap', label: 'Academic' },
    { value: 'beaker', label: 'Science' },
    { value: 'cpu-chip', label: 'Hardware' },
    { value: 'command-line', label: 'Terminal' },
    { value: 'globe-alt', label: 'Web' },
    { value: 'server-stack', label: 'Server' },
    { value: 'laravel', label: 'Laravel' },
] as const;

const ICON_MAP: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
    'code-bracket': CodeBracketIcon,
    'book-open': BookOpenIcon,
    'rocket-launch': RocketLaunchIcon,
    'academic-cap': AcademicCapIcon,
    beaker: BeakerIcon,
    'cpu-chip': CpuChipIcon,
    'command-line': CommandLineIcon,
    'globe-alt': GlobeAltIcon,
    'server-stack': ServerStackIcon,
    laravel: CodeBracketIcon,
};

export function resolvePathIcon(icon: string | null | undefined): ComponentType<SVGProps<SVGSVGElement>> {
    if (!icon) {
        return BookOpenIcon;
    }

    return ICON_MAP[icon] ?? BookOpenIcon;
}

export function formatDuration(minutes: number): string {
    if (minutes < 60) {
        return `${minutes} min`;
    }

    const hours = Math.floor(minutes / 60);
    const remainder = minutes % 60;

    return remainder > 0 ? `${hours}h ${remainder}m` : `${hours}h`;
}

export function slugifyName(name: string): string {
    return name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}
