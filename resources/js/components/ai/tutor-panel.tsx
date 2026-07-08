import { Button } from '@/components/catalyst/button';
import { fetchJson, FetchJsonError } from '@/lib/fetch-json';
import type { TutorMessage, TutorSession } from '@/types/integrations';
import { ChatBubbleLeftRightIcon, PaperAirplaneIcon, XMarkIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import { useCallback, useEffect, useRef, useState } from 'react';

interface TutorPanelProps {
    contextType: string;
    contextId?: number | null;
    levelId?: number | null;
    title: string;
}

export function TutorPanel({ contextType, contextId, levelId, title }: TutorPanelProps) {
    const [open, setOpen] = useState(false);
    const [session, setSession] = useState<TutorSession | null>(null);
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    const send = useCallback(async () => {
        const text = message.trim();

        if (!text || sending) {
            return;
        }

        setSending(true);
        setError(null);

        try {
            const data = await fetchJson<TutorSession>(route('learn.tutor.messages.store'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    context_type: contextType,
                    context_id: contextId,
                    level_id: levelId,
                    title,
                    message: text,
                }),
            });

            setSession(data);
            setMessage('');
        } catch (e) {
            setError(e instanceof FetchJsonError ? e.message : 'Failed to send message.');
        } finally {
            setSending(false);
        }
    }, [contextId, contextType, levelId, message, sending, title]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [session?.messages]);

    const messages: TutorMessage[] = session?.messages ?? [];

    return (
        <>
            <Button
                type="button"
                outline
                className="!fixed !right-5 !bottom-5 z-40 !rounded-full !px-4 !py-2.5 shadow-lg"
                onClick={() => setOpen(true)}
            >
                <ChatBubbleLeftRightIcon data-slot="icon" />
                AI Tutor
            </Button>

            {open && (
                <div className="fixed inset-0 z-50 flex justify-end bg-zinc-950/20 p-0 sm:p-4">
                    <div className="flex h-full w-full max-w-md flex-col border-l border-zinc-950/10 bg-white shadow-2xl dark:border-white/10 dark:bg-zinc-900 sm:rounded-2xl sm:border">
                        <div className="flex items-center justify-between border-b border-zinc-950/5 px-4 py-3 dark:border-white/5">
                            <div>
                                <p className="text-sm font-semibold text-zinc-950 dark:text-white">AI Tutor</p>
                                <p className="text-[11px] text-zinc-500">Hints, not full solutions</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                            >
                                <XMarkIcon className="size-5" />
                            </button>
                        </div>

                        <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
                            {messages.length === 0 ? (
                                <div className="rounded-xl border border-dashed border-zinc-300 px-4 py-8 text-center dark:border-zinc-600">
                                    <p className="text-xs text-zinc-500">
                                        Ask about <span className="font-medium text-zinc-700 dark:text-zinc-300">{title}</span>.
                                        I&apos;ll guide you with questions and hints.
                                    </p>
                                </div>
                            ) : (
                                messages.map((m) => (
                                    <div
                                        key={m.id}
                                        className={clsx(
                                            'max-w-[90%] rounded-xl px-3 py-2 text-xs leading-relaxed',
                                            m.role === 'user'
                                                ? 'ml-auto bg-blue-600 text-white'
                                                : 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200',
                                        )}
                                    >
                                        {m.content}
                                    </div>
                                ))
                            )}
                            <div ref={bottomRef} />
                        </div>

                        <div className="border-t border-zinc-950/5 p-3 dark:border-white/5">
                            {error && <p className="mb-2 text-[11px] text-red-600">{error}</p>}
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), send())}
                                    placeholder="Ask for a hint..."
                                    className="min-w-0 flex-1 rounded-lg border border-zinc-950/10 bg-white px-3 py-2 text-xs dark:border-white/10 dark:bg-zinc-950"
                                />
                                <Button type="button" onClick={send} disabled={sending || !message.trim()} className="!px-3">
                                    <PaperAirplaneIcon data-slot="icon" className="!size-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
