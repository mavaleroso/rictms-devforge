import { Button } from '@/components/catalyst/button';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
    BoldIcon,
    CodeBracketIcon,
    ItalicIcon,
    LinkIcon,
    ListBulletIcon,
    NumberedListIcon,
    StrikethroughIcon,
    UnderlineIcon,
} from '@heroicons/react/20/solid';
import clsx from 'clsx';
import { useEffect, type ReactNode } from 'react';

interface RichTextEditorProps {
    value: string;
    onChange: (html: string) => void;
    invalid?: boolean;
    placeholder?: string;
}

function ToolbarButton({
    active,
    onClick,
    label,
    children,
}: {
    active?: boolean;
    onClick: () => void;
    label: string;
    children: ReactNode;
}) {
    return (
        <Button
            type="button"
            plain
            onClick={onClick}
            aria-label={label}
            aria-pressed={active}
            className={clsx(active && 'bg-zinc-200 dark:bg-zinc-700')}
        >
            {children}
        </Button>
    );
}

export function RichTextEditor({ value, onChange, invalid = false, placeholder = 'Write your lesson here…' }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [2, 3] },
            }),
            Underline,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: { class: 'text-brand-600 underline dark:text-brand-400' },
            }),
            Placeholder.configure({ placeholder }),
        ],
        content: value,
        editorProps: {
            attributes: {
                class: 'prose prose-sm prose-zinc max-w-none min-h-48 px-3 py-2 focus:outline-none dark:prose-invert',
            },
        },
        onUpdate: ({ editor: currentEditor }) => {
            onChange(currentEditor.getHTML());
        },
    });

    useEffect(() => {
        if (!editor) {
            return;
        }

        const currentHtml = editor.getHTML();
        const normalizedValue = value || '<p></p>';

        if (currentHtml !== normalizedValue && value !== currentHtml) {
            editor.commands.setContent(value || '', false);
        }
    }, [editor, value]);

    const setLink = () => {
        if (!editor) {
            return;
        }

        const previousUrl = editor.getAttributes('link').href as string | undefined;
        const url = window.prompt('Enter link URL', previousUrl ?? 'https://');

        if (url === null) {
            return;
        }

        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();

            return;
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    if (!editor) {
        return null;
    }

    return (
        <div
            data-slot="control"
            data-invalid={invalid ? '' : undefined}
            className={clsx(
                'overflow-hidden rounded-lg border bg-white shadow-sm dark:bg-zinc-900',
                invalid ? 'border-red-500 dark:border-red-500' : 'border-zinc-950/10 dark:border-white/10',
            )}
        >
            <div className="flex flex-wrap gap-0.5 border-b border-zinc-950/10 bg-zinc-50 p-1 dark:border-white/10 dark:bg-zinc-800/60">
                <ToolbarButton active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()} label="Bold">
                    <BoldIcon className="size-4" />
                </ToolbarButton>
                <ToolbarButton active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()} label="Italic">
                    <ItalicIcon className="size-4" />
                </ToolbarButton>
                <ToolbarButton active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()} label="Underline">
                    <UnderlineIcon className="size-4" />
                </ToolbarButton>
                <ToolbarButton active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()} label="Strikethrough">
                    <StrikethroughIcon className="size-4" />
                </ToolbarButton>
                <span className="mx-1 w-px self-stretch bg-zinc-200 dark:bg-zinc-700" aria-hidden />
                <ToolbarButton active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} label="Heading 2">
                    <span className="text-xs font-semibold">H2</span>
                </ToolbarButton>
                <ToolbarButton active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} label="Heading 3">
                    <span className="text-xs font-semibold">H3</span>
                </ToolbarButton>
                <span className="mx-1 w-px self-stretch bg-zinc-200 dark:bg-zinc-700" aria-hidden />
                <ToolbarButton active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()} label="Bullet list">
                    <ListBulletIcon className="size-4" />
                </ToolbarButton>
                <ToolbarButton active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()} label="Numbered list">
                    <NumberedListIcon className="size-4" />
                </ToolbarButton>
                <ToolbarButton active={editor.isActive('codeBlock')} onClick={() => editor.chain().focus().toggleCodeBlock().run()} label="Code block">
                    <CodeBracketIcon className="size-4" />
                </ToolbarButton>
                <ToolbarButton active={editor.isActive('link')} onClick={setLink} label="Link">
                    <LinkIcon className="size-4" />
                </ToolbarButton>
            </div>
            <EditorContent editor={editor} />
        </div>
    );
}
