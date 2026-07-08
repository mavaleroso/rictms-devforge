export interface LandingSection {
    id: string;
    label: string;
    guestOnly?: boolean;
}

export const LANDING_SECTIONS: LandingSection[] = [
    { id: 'paths', label: 'Paths' },
    { id: 'process', label: 'How it works' },
    { id: 'practice', label: 'Practice' },
    { id: 'labs', label: 'Labs' },
    { id: 'features', label: 'Features' },
    { id: 'audience', label: 'For teams' },
    { id: 'get-started', label: 'Get started', guestOnly: true },
];
