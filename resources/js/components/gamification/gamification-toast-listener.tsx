import { useToast } from '@/components/toast/toast-provider';
import type { GamificationAwardFlash } from '@/types/gamification';
import { usePage } from '@inertiajs/react';
import { useEffect, useRef } from 'react';

export function GamificationToastListener() {
    const { flash } = usePage<{ flash?: { gamification_awards?: GamificationAwardFlash[] } }>().props;
    const { showSuccess } = useToast();
    const shown = useRef('');

    useEffect(() => {
        const awards = flash?.gamification_awards ?? [];

        if (awards.length === 0) {
            shown.current = '';

            return;
        }

        const signature = JSON.stringify(awards);

        if (signature === shown.current) {
            return;
        }

        shown.current = signature;

        awards.forEach((award) => {
            const badgeNames = award.badges.map((badge) => badge.name).join(', ');
            const streakNote =
                award.streak && award.streak > 1 ? ` · ${award.streak}-day streak` : '';

            showSuccess(
                `+${award.xp} XP`,
                [award.reason, badgeNames ? `Badge: ${badgeNames}` : null, streakNote ? streakNote.slice(3) : null]
                    .filter(Boolean)
                    .join(' · '),
            );
        });
    }, [flash?.gamification_awards, showSuccess]);

    return null;
}
