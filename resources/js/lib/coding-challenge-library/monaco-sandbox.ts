import type { Monaco } from '@monaco-editor/react';

let configured = false;

const REACT_JSX_RUNTIME = `
declare module 'react/jsx-runtime' {
  export namespace JSX {
    interface Element {}
    interface IntrinsicElements {
      [elemName: string]: any;
    }
    interface ElementChildrenAttribute {
      children: {};
    }
  }
  export function jsx(type: any, props: any, key?: any): any;
  export function jsxs(type: any, props: any, key?: any): any;
  export function jsxDEV(type: any, props: any, key?: any): any;
  export const Fragment: any;
}

declare module 'react/jsx-dev-runtime' {
  export * from 'react/jsx-runtime';
}
`;

const REACT_STUB = `
declare module 'react' {
  export type ReactNode = any;
  export type ReactElement = any;
  export type FC<P = {}> = (props: P) => any;
  export type ComponentType<P = {}> = (props: P) => any;
  export type PropsWithChildren<P = {}> = P & { children?: ReactNode };
  export type ComponentProps<'div'> = any;
  export type HTMLAttributes<T> = any;
  export type ButtonHTMLAttributes<T> = any;
  export type CSSProperties = Record<string, any>;
  export function useState<T = any>(initial?: T | (() => T)): [T, (value: T | ((prev: T) => T)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: any[]): void;
  export function useMemo<T>(factory: () => T, deps?: any[]): T;
  export function useCallback<T extends (...args: any[]) => any>(callback: T, deps?: any[]): T;
  export function useRef<T = any>(initial?: T): { current: T };
  export function createElement(type: any, props?: any, ...children: any[]): any;
  export const Fragment: any;
  const React: {
    useState: typeof useState;
    useEffect: typeof useEffect;
    useMemo: typeof useMemo;
    useCallback: typeof useCallback;
    useRef: typeof useRef;
    createElement: typeof createElement;
    Fragment: any;
  };
  export default React;
}

declare module 'react-dom' {
  export function createRoot(container: any): { render(children: any): void };
  export function render(children: any, container: any): void;
}

declare module '@inertiajs/react' {
  export function Head(props: any): any;
  export function Link(props: any): any;
  export function usePage<T = any>(): { props: T; url: string; component: string };
  export function router: any;
  export function useForm<T = any>(data?: T): any;
}

declare module '@/lib/utils' {
  export function cn(...inputs: any[]): string;
}

declare module '@/components/ui/sidebar' {
  export const SidebarInset: any;
  export const SidebarProvider: any;
  export const Sidebar: any;
  export const SidebarHeader: any;
  export const SidebarContent: any;
  export const SidebarFooter: any;
  export const SidebarMenu: any;
  export const SidebarMenuItem: any;
  export const SidebarMenuButton: any;
  export const SidebarTrigger: any;
}

declare module '@/components/*';
declare module '@/layouts/*';
declare module '@/hooks/*';
declare module '@/types';
declare module '@/types/*';
declare module '*.css';
`;

/**
 * Configure Monaco TS/JS for React sandbox files (.tsx/.jsx).
 * Adds lightweight React stubs so JSX does not require real node_modules.
 */
export function configureMonacoSandbox(monaco: Monaco): void {
    const compilerOptions = {
        target: monaco.languages.typescript.ScriptTarget.ES2020,
        allowNonTsExtensions: true,
        moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
        module: monaco.languages.typescript.ModuleKind.ESNext,
        noEmit: true,
        esModuleInterop: true,
        jsx: monaco.languages.typescript.JsxEmit.ReactJSX,
        jsxFactory: 'React.createElement',
        jsxFragmentFactory: 'React.Fragment',
        reactNamespace: 'React',
        allowJs: true,
        checkJs: false,
        strict: false,
        skipLibCheck: true,
        allowSyntheticDefaultImports: true,
        baseUrl: '.',
        paths: {
            '@/*': ['*'],
        },
    };

    monaco.languages.typescript.typescriptDefaults.setCompilerOptions(compilerOptions);
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions(compilerOptions);

    if (!configured) {
        monaco.languages.typescript.typescriptDefaults.addExtraLib(
            REACT_JSX_RUNTIME,
            'file:///node_modules/react/jsx-runtime.d.ts',
        );
        monaco.languages.typescript.typescriptDefaults.addExtraLib(REACT_STUB, 'file:///sandbox-react-stubs.d.ts');
        monaco.languages.typescript.javascriptDefaults.addExtraLib(
            REACT_JSX_RUNTIME,
            'file:///node_modules/react/jsx-runtime-js.d.ts',
        );
        monaco.languages.typescript.javascriptDefaults.addExtraLib(REACT_STUB, 'file:///sandbox-react-stubs-js.d.ts');
        configured = true;
    }

    // Challenge sandbox is not a full typechecked project — keep syntax checks only.
    const diagnostics = {
        noSemanticValidation: true,
        noSyntaxValidation: false,
        diagnosticCodesToIgnore: [2307, 2792, 2875, 7016, 80001, 80005, 17004, 2686, 2693],
    };

    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions(diagnostics);
    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions(diagnostics);
}
