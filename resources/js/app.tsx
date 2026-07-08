import '../css/app.css';

import { ToastProvider } from '@/components/toast/toast-provider';
import { ValidationToastListener } from '@/components/toast/validation-toast-listener';
import { QueryProvider } from '@/providers/query-provider';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { type ComponentType, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { route as routeFn } from 'ziggy-js';
import { initializeTheme } from './hooks/use-appearance';

declare global {
    const route: typeof routeFn;
}

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

type InertiaAppComponent = ComponentType<{
    children?: (options: { Component: ComponentType; props: object; key: number }) => ReactNode;
}>;

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);
        const InertiaApp = App as InertiaAppComponent;

        root.render(
            <QueryProvider>
                <ToastProvider>
                    <InertiaApp {...props}>
                        {({ Component, props: pageProps, key }) => (
                            <>
                                <ValidationToastListener />
                                <Component key={key} {...pageProps} />
                            </>
                        )}
                    </InertiaApp>
                </ToastProvider>
            </QueryProvider>,
        );
    },
    progress: {
        color: '#4B5563',
    },
});

initializeTheme();
