import Editor from '@monaco-editor/react';
import clsx from 'clsx';
import { useEffect, useState } from 'react';

interface CodeEditorProps {
    value: string;
    onChange: (value: string) => void;
    language?: string;
    invalid?: boolean;
    height?: number;
    readOnly?: boolean;
    placeholder?: string;
}

function resolveTheme(): 'vs-dark' | 'light' {
    if (typeof document === 'undefined') {
        return 'light';
    }

    return document.documentElement.classList.contains('dark') ? 'vs-dark' : 'light';
}

export function CodeEditor({
    value,
    onChange,
    language = 'php',
    invalid = false,
    height = 240,
    readOnly = false,
}: CodeEditorProps) {
    const [theme, setTheme] = useState(resolveTheme);

    useEffect(() => {
        const root = document.documentElement;
        const observer = new MutationObserver(() => setTheme(resolveTheme()));
        observer.observe(root, { attributes: true, attributeFilter: ['class'] });

        return () => observer.disconnect();
    }, []);

    return (
        <div
            data-slot="control"
            data-invalid={invalid ? '' : undefined}
            className={clsx(
                'overflow-hidden rounded-lg border',
                invalid ? 'border-red-500 dark:border-red-500' : 'border-zinc-950/10 dark:border-white/10',
            )}
        >
            <Editor
                height={`${height}px`}
                language={language}
                value={value}
                onChange={(nextValue) => onChange(nextValue ?? '')}
                theme={theme}
                options={{
                    minimap: { enabled: false },
                    fontSize: 13,
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    padding: { top: 12, bottom: 12 },
                    readOnly,
                    wordWrap: 'on',
                    tabSize: 4,
                    insertSpaces: true,
                }}
            />
        </div>
    );
}
