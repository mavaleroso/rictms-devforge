export type FileTreeNode = {
    name: string;
    path: string;
    type: 'file' | 'folder';
    children?: FileTreeNode[];
    language?: string;
    editable?: boolean;
    isTarget?: boolean;
};

type FileMeta = {
    path: string;
    language: string;
    editable: boolean;
};

export function buildFileTree(files: FileMeta[], targetFiles: string[] = []): FileTreeNode[] {
    const targets = new Set(targetFiles);
    const root: FileTreeNode[] = [];

    for (const file of files) {
        const parts = file.path.split('/').filter(Boolean);
        let cursor = root;

        parts.forEach((part, index) => {
            const isFile = index === parts.length - 1;
            const path = parts.slice(0, index + 1).join('/');
            let node = cursor.find((item) => item.name === part && item.type === (isFile ? 'file' : 'folder'));

            if (!node) {
                node = isFile
                    ? {
                          name: part,
                          path,
                          type: 'file',
                          language: file.language,
                          editable: file.editable,
                          isTarget: targets.has(file.path),
                      }
                    : {
                          name: part,
                          path,
                          type: 'folder',
                          children: [],
                      };
                cursor.push(node);
            }

            if (!isFile) {
                node.children ??= [];
                cursor = node.children;
            }
        });
    }

    const sortNodes = (nodes: FileTreeNode[]) => {
        nodes.sort((a, b) => {
            if (a.type !== b.type) {
                return a.type === 'folder' ? -1 : 1;
            }

            return a.name.localeCompare(b.name);
        });

        nodes.forEach((node) => {
            if (node.children) {
                sortNodes(node.children);
            }
        });
    };

    sortNodes(root);

    return root;
}

export function collectFolderPaths(nodes: FileTreeNode[]): string[] {
    const paths: string[] = [];

    const walk = (items: FileTreeNode[]) => {
        for (const item of items) {
            if (item.type === 'folder') {
                paths.push(item.path);
                if (item.children) {
                    walk(item.children);
                }
            }
        }
    };

    walk(nodes);

    return paths;
}

/** Only root-level folders (collapsed nested by default). */
export function collectTopLevelFolderPaths(nodes: FileTreeNode[]): string[] {
    return nodes.filter((node) => node.type === 'folder').map((node) => node.path);
}
