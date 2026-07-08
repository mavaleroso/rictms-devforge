import { MatrixRain } from '@/components/marketing/matrix-rain';

export function AnimatedGridBackground() {
    return (
        <div
            aria-hidden
            className="pointer-events-none fixed inset-0 -z-10 w-screen overflow-hidden"
        >
            <div className="absolute inset-0 bg-surface-canvas dark:bg-slate-950" />

            <MatrixRain />

            <div className="landing-grid-layer landing-grid-layer-primary absolute inset-0 opacity-[0.45] dark:opacity-[0.22]" />
            <div className="landing-grid-layer landing-grid-layer-secondary absolute inset-0 opacity-[0.3] dark:opacity-[0.14]" />

            <div className="landing-grid-dots absolute inset-0 opacity-40 dark:opacity-25" />

            <div className="landing-grid-glow landing-grid-glow-brand absolute -top-24 left-[10%] size-[28rem] rounded-full blur-3xl" />
            <div className="landing-grid-glow landing-grid-glow-accent absolute top-1/3 right-[8%] size-80 rounded-full blur-3xl" />
            <div className="landing-grid-glow landing-grid-glow-brand absolute -bottom-20 left-[35%] size-96 rounded-full blur-3xl" />

            <div className="landing-grid-fade absolute inset-0" />
        </div>
    );
}
