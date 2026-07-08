import { useEffect, useRef } from 'react';

const CHARSET = '01ABCDEFabcdef{}[]<>/\\|&^%$#@~';
const FONT_SIZE = 14;
const FRAME_INTERVAL_MS = 45;

function prefersReducedMotion(): boolean {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function isDarkMode(): boolean {
    return document.documentElement.classList.contains('dark');
}

export function MatrixRain() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) {
            return;
        }

        const context = canvas.getContext('2d');
        if (!context) {
            return;
        }

        if (prefersReducedMotion()) {
            return;
        }

        let animationFrame = 0;
        let lastFrameAt = 0;
        let drops: number[] = [];
        let columnCount = 0;

        const resize = () => {
            const { innerWidth, innerHeight } = window;
            const dpr = Math.min(window.devicePixelRatio || 1, 2);

            canvas.width = Math.floor(innerWidth * dpr);
            canvas.height = Math.floor(innerHeight * dpr);
            canvas.style.width = `${innerWidth}px`;
            canvas.style.height = `${innerHeight}px`;

            context.setTransform(dpr, 0, 0, dpr, 0, 0);

            columnCount = Math.ceil(innerWidth / FONT_SIZE);
            drops = Array.from({ length: columnCount }, () => Math.random() * -40);
        };

        const draw = (timestamp: number) => {
            animationFrame = window.requestAnimationFrame(draw);

            if (timestamp - lastFrameAt < FRAME_INTERVAL_MS) {
                return;
            }

            lastFrameAt = timestamp;

            const width = canvas.clientWidth;
            const height = canvas.clientHeight;
            const dark = isDarkMode();

            context.fillStyle = dark ? 'rgba(2, 6, 23, 0.08)' : 'rgba(244, 246, 249, 0.12)';
            context.fillRect(0, 0, width, height);

            context.font = `${FONT_SIZE}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;
            context.textBaseline = 'top';

            for (let column = 0; column < columnCount; column += 1) {
                const char = CHARSET[Math.floor(Math.random() * CHARSET.length)];
                const x = column * FONT_SIZE;
                const y = drops[column] * FONT_SIZE;

                const headAlpha = dark ? 0.55 : 0.35;
                const trailAlpha = dark ? 0.2 : 0.14;

                context.fillStyle = dark
                    ? `rgba(45, 212, 191, ${headAlpha})`
                    : `rgba(53, 104, 154, ${headAlpha})`;
                context.fillText(char, x, y);

                if (y > FONT_SIZE * 2) {
                    const trailChar = CHARSET[Math.floor(Math.random() * CHARSET.length)];
                    context.fillStyle = dark
                        ? `rgba(74, 130, 176, ${trailAlpha})`
                        : `rgba(20, 184, 166, ${trailAlpha})`;
                    context.fillText(trailChar, x, y - FONT_SIZE * 1.6);
                }

                if (y > height && Math.random() > 0.975) {
                    drops[column] = 0;
                }

                drops[column] += 0.45 + Math.random() * 0.35;
            }
        };

        resize();
        animationFrame = window.requestAnimationFrame(draw);

        window.addEventListener('resize', resize);

        return () => {
            window.cancelAnimationFrame(animationFrame);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            aria-hidden
            className="absolute inset-0 size-full opacity-35 dark:opacity-45"
        />
    );
}
