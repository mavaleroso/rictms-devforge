import { Badge } from '@/components/catalyst/badge';
import {
    AcademicCapIcon,
    ShieldCheckIcon,
    UserGroupIcon,
    type SVGProps,
} from '@heroicons/react/20/solid';
import type { ComponentType } from 'react';

const roleConfig: Record<string, { label: string; color: 'violet' | 'blue' | 'lime' | 'zinc'; description: string; icon: ComponentType<SVGProps<SVGSVGElement>> }> = {
    admin: {
        label: 'Admin',
        color: 'violet',
        description: 'Full platform control — paths, users, enrollments, and settings.',
        icon: ShieldCheckIcon,
    },
    mentor: {
        label: 'Mentor',
        color: 'blue',
        description: 'Monitor assigned interns and review their learning progress.',
        icon: UserGroupIcon,
    },
    intern: {
        label: 'Intern',
        color: 'lime',
        description: 'Access enrolled learning paths, lessons, videos, and quizzes.',
        icon: AcademicCapIcon,
    },
};

interface UserRoleBadgeProps {
    role: string;
    className?: string;
    withIcon?: boolean;
}

export function UserRoleBadge({ role, className, withIcon = false }: UserRoleBadgeProps) {
    const config = roleConfig[role] ?? { label: role, color: 'zinc' as const, icon: UserGroupIcon };
    const Icon = config.icon;

    return (
        <Badge color={config.color} className={className}>
            {withIcon && <Icon className="size-3.5" />}
            {config.label}
        </Badge>
    );
}

export const USER_ROLES = ['admin', 'mentor', 'intern'] as const;
export type UserRole = (typeof USER_ROLES)[number];

export function roleLabel(role: string): string {
    return roleConfig[role]?.label ?? role;
}

export function roleDetails(role: string) {
    return roleConfig[role] ?? { label: role, color: 'zinc' as const, description: '', icon: UserGroupIcon };
}
