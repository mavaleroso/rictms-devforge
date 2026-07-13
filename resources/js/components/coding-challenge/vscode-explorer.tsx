import type { FileTreeNode } from '@/lib/coding-challenge-library/file-tree';
import {
    ChevronDownIcon,
    ChevronRightIcon,
    DocumentTextIcon,
    FolderIcon,
    FolderOpenIcon,
    MinusIcon,
    PlusIcon,
} from '@heroicons/react/20/solid';
import clsx from 'clsx';

interface VscodeExplorerProps {
    nodes: FileTreeNode[];
    activePath: string | null;
    openFolders: Set<string>;
    onToggleFolder: (path: string) => void;
    onOpenFile: (path: string) => void;
    onCollapseAll?: () => void;
    onExpandAll?: () => void;
    sectionOpen?: boolean;
    onToggleSection?: () => void;
}

function TreeNode({
    node,
    depth,
    activePath,
    openFolders,
    onToggleFolder,
    onOpenFile,
}: {
    node: FileTreeNode;
    depth: number;
    activePath: string | null;
    openFolders: Set<string>;
    onToggleFolder: (path: string) => void;
    onOpenFile: (path: string) => void;
}) {
    if (node.type === 'folder') {
        const open = openFolders.has(node.path);

        return (
            <li>
                <button
                    type="button"
                    onClick={() => onToggleFolder(node.path)}
                    style={{ paddingLeft: `${8 + depth * 12}px` }}
                    className="flex w-full items-center gap-1 py-[3px] pr-2 text-left text-[12px] text-[#cccccc] hover:bg-[#2a2d2e]"
                    aria-expanded={open}
                >
                    {open ? (
                        <ChevronDownIcon className="size-3 shrink-0 text-[#c5c5c5]" />
                    ) : (
                        <ChevronRightIcon className="size-3 shrink-0 text-[#c5c5c5]" />
                    )}
                    {open ? (
                        <FolderOpenIcon className="size-3.5 shrink-0 text-[#dcb67a]" />
                    ) : (
                        <FolderIcon className="size-3.5 shrink-0 text-[#dcb67a]" />
                    )}
                    <span className="truncate">{node.name}</span>
                </button>
                {open && node.children && (
                    <ul>
                        {node.children.map((child) => (
                            <TreeNode
                                key={`${child.type}:${child.path}`}
                                node={child}
                                depth={depth + 1}
                                activePath={activePath}
                                openFolders={openFolders}
                                onToggleFolder={onToggleFolder}
                                onOpenFile={onOpenFile}
                            />
                        ))}
                    </ul>
                )}
            </li>
        );
    }

    const active = activePath === node.path;

    return (
        <li>
            <button
                type="button"
                onClick={() => onOpenFile(node.path)}
                style={{ paddingLeft: `${20 + depth * 12}px` }}
                className={clsx(
                    'flex w-full items-center gap-1.5 py-[3px] pr-2 text-left text-[12px]',
                    active ? 'bg-[#37373d] text-white' : 'text-[#cccccc] hover:bg-[#2a2d2e]',
                )}
            >
                <DocumentTextIcon
                    className={clsx(
                        'size-3.5 shrink-0',
                        node.language === 'php'
                            ? 'text-[#9B71DC]'
                            : node.language === 'typescript' || node.language === 'tsx'
                              ? 'text-[#519aba]'
                              : node.language === 'markdown'
                                ? 'text-[#519aba]'
                                : 'text-[#c5c5c5]',
                    )}
                />
                <span className="min-w-0 flex-1 truncate">{node.name}</span>
                {node.isTarget && (
                    <span className="rounded bg-[#e2c08d]/20 px-1 text-[9px] font-semibold text-[#e2c08d]">TASK</span>
                )}
                {node.editable === false && <span className="text-[9px] text-[#6e6e6e]">RO</span>}
            </button>
        </li>
    );
}

export function VscodeExplorer({
    nodes,
    activePath,
    openFolders,
    onToggleFolder,
    onOpenFile,
    onCollapseAll,
    onExpandAll,
    sectionOpen = true,
    onToggleSection,
}: VscodeExplorerProps) {
    return (
        <div className="flex h-full min-h-0 flex-col bg-[#252526] text-[#cccccc]">
            <div className="flex items-center gap-1 px-2 py-1.5">
                <button
                    type="button"
                    onClick={onToggleSection}
                    className="flex min-w-0 flex-1 items-center gap-1 rounded px-1 py-0.5 text-left hover:bg-[#2a2d2e]"
                    aria-expanded={sectionOpen}
                    title={sectionOpen ? 'Collapse explorer' : 'Expand explorer'}
                >
                    {sectionOpen ? (
                        <ChevronDownIcon className="size-3 shrink-0 text-[#c5c5c5]" />
                    ) : (
                        <ChevronRightIcon className="size-3 shrink-0 text-[#c5c5c5]" />
                    )}
                    <p className="truncate text-[11px] font-semibold tracking-[0.08em] text-[#bbbbbb] uppercase">
                        Explorer
                    </p>
                </button>

                {sectionOpen && (
                    <div className="flex shrink-0 items-center gap-0.5">
                        {onCollapseAll && (
                            <button
                                type="button"
                                onClick={onCollapseAll}
                                title="Collapse folders"
                                className="rounded p-1 text-[#c5c5c5] hover:bg-[#2a2d2e] hover:text-white"
                            >
                                <MinusIcon className="size-3.5" />
                            </button>
                        )}
                        {onExpandAll && (
                            <button
                                type="button"
                                onClick={onExpandAll}
                                title="Expand folders"
                                className="rounded p-1 text-[#c5c5c5] hover:bg-[#2a2d2e] hover:text-white"
                            >
                                <PlusIcon className="size-3.5" />
                            </button>
                        )}
                    </div>
                )}
            </div>

            {sectionOpen && (
                <>
                    <div className="px-2 pb-1">
                        <p className="px-2 py-1 text-[11px] font-semibold tracking-wide text-[#bbbbbb] uppercase">
                            Sandbox
                        </p>
                    </div>
                    <ul className="min-h-0 flex-1 overflow-y-auto pb-2">
                        {nodes.map((node) => (
                            <TreeNode
                                key={`${node.type}:${node.path}`}
                                node={node}
                                depth={0}
                                activePath={activePath}
                                openFolders={openFolders}
                                onToggleFolder={onToggleFolder}
                                onOpenFile={onOpenFile}
                            />
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
}
