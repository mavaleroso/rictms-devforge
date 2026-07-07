import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import {
    defineConfig
} from 'vite';
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.jsx',
            refresh: true,
        }),
        react(),
        tailwindcss(),
    ],
    optimizeDeps: {
        include: [
            '@heroicons/react/16/solid',
            '@heroicons/react/20/solid',
            'motion/react',
        ],
    },
    esbuild: {
        jsx: 'automatic',
    },
});