<?php

namespace App\Library\CodingChallenge;

use Illuminate\Support\Facades\File;
use InvalidArgumentException;
use Symfony\Component\Finder\Finder;

final class ChallengeTemplateRepository
{
    public function basePath(): string
    {
        return resource_path('challenge-templates');
    }

    /**
     * @return array{
     *   key: string,
     *   name: string,
     *   description: string,
     *   layout?: string,
     *   preview_url?: string|null,
     *   preview_path?: string,
     *   stack: list<string>,
     *   entry_page: string,
     *   files?: list<array{path: string, language: string, editable: bool}>,
     *   include?: list<string>,
     *   readonly_prefixes?: list<string>
     * }
     */
    public function manifest(string $templateKey): array
    {
        $path = $this->templateRoot($templateKey).DIRECTORY_SEPARATOR.'manifest.json';

        if (! File::exists($path)) {
            throw new InvalidArgumentException("Challenge template not found: {$templateKey}");
        }

        /** @var array{key: string, name: string, description: string, layout?: string, preview_url?: string|null, preview_path?: string, stack: list<string>, entry_page: string, files?: list<array{path: string, language: string, editable: bool}>, include?: list<string>, readonly_prefixes?: list<string>} $manifest */
        $manifest = json_decode(File::get($path), true, flags: JSON_THROW_ON_ERROR);

        return $manifest;
    }

    public function isProjectLayout(string $templateKey): bool
    {
        $manifest = $this->manifest($templateKey);

        return ($manifest['layout'] ?? 'files') === 'project';
    }

    public function previewUrl(string $templateKey): ?string
    {
        $configured = config('coding-challenges.template_preview_urls.'.$templateKey);

        if (is_string($configured) && $configured !== '') {
            return rtrim($configured, '/');
        }

        $manifest = $this->manifest($templateKey);
        $url = $manifest['preview_url'] ?? null;

        return is_string($url) && $url !== '' ? rtrim($url, '/') : null;
    }

    public function previewPath(string $templateKey): string
    {
        $manifest = $this->manifest($templateKey);
        $path = $manifest['preview_path'] ?? '/';

        return str_starts_with($path, '/') ? $path : '/'.$path;
    }

    /** @return array<string, string> path => content */
    public function files(string $templateKey): array
    {
        $manifest = $this->manifest($templateKey);
        $filesRoot = $this->filesRoot($templateKey);
        $paths = $this->resolvePaths($templateKey, $manifest);
        $contents = [];

        foreach ($paths as $relative) {
            $absolute = $filesRoot.DIRECTORY_SEPARATOR.str_replace('/', DIRECTORY_SEPARATOR, $relative);

            if (! File::exists($absolute)) {
                throw new InvalidArgumentException("Template file missing: {$relative}");
            }

            if ($this->isBinaryPath($relative) || $this->looksBinary($absolute)) {
                continue;
            }

            $contents[$relative] = File::get($absolute);
        }

        return $contents;
    }

    /** @return list<array{path: string, language: string, editable: bool, content: string}> */
    public function workspaceFiles(string $templateKey): array
    {
        $manifest = $this->manifest($templateKey);
        $contents = $this->files($templateKey);
        $readonlyPrefixes = $manifest['readonly_prefixes'] ?? [];

        if (isset($manifest['files']) && is_array($manifest['files']) && $manifest['files'] !== []) {
            return array_map(fn (array $file) => [
                'path' => $file['path'],
                'language' => $file['language'],
                'editable' => (bool) $file['editable'],
                'content' => $contents[$file['path']],
            ], $manifest['files']);
        }

        $workspace = [];

        foreach ($contents as $path => $content) {
            $workspace[] = [
                'path' => $path,
                'language' => $this->languageForPath($path),
                'editable' => ! $this->isReadonlyPath($path, $readonlyPrefixes),
                'content' => $content,
            ];
        }

        usort($workspace, fn (array $a, array $b) => strcmp($a['path'], $b['path']));

        return $workspace;
    }

    /**
     * Write workspace edits back onto the on-disk project template (safe paths only).
     *
     * @param  array<string, string>  $files
     * @return list<string> written relative paths
     */
    public function syncToDisk(string $templateKey, array $files): array
    {
        if (! $this->isProjectLayout($templateKey)) {
            return [];
        }

        $allowed = array_fill_keys(array_keys($this->files($templateKey)), true);
        $root = realpath($this->filesRoot($templateKey));

        if ($root === false) {
            throw new InvalidArgumentException("Template root missing: {$templateKey}");
        }

        $written = [];

        foreach ($files as $path => $content) {
            if (! is_string($path) || ! is_string($content) || ! isset($allowed[$path])) {
                continue;
            }

            if (str_contains($path, '..') || str_starts_with($path, '/') || str_contains($path, '\\')) {
                continue;
            }

            $absolute = $root.DIRECTORY_SEPARATOR.str_replace('/', DIRECTORY_SEPARATOR, $path);
            $realDir = realpath(dirname($absolute));

            if ($realDir === false || ! str_starts_with($realDir, $root)) {
                continue;
            }

            File::put($absolute, $content);
            $written[] = $path;
        }

        return $written;
    }

    /** @return list<array{key: string, name: string, description: string, preview_url?: string|null}> */
    public function all(): array
    {
        $root = $this->basePath();

        if (! File::isDirectory($root)) {
            return [];
        }

        $templates = [];

        foreach (File::directories($root) as $familyDir) {
            $familyManifest = $familyDir.DIRECTORY_SEPARATOR.'manifest.json';

            if (File::exists($familyManifest)) {
                $manifest = json_decode(File::get($familyManifest), true) ?: [];
                $key = basename($familyDir);
                $templates[] = [
                    'key' => $key,
                    'name' => $manifest['name'] ?? $key,
                    'description' => $manifest['description'] ?? '',
                    'preview_url' => $this->safePreviewUrl($key, $manifest),
                ];
            }

            foreach (File::directories($familyDir) as $versionDir) {
                $manifestPath = $versionDir.DIRECTORY_SEPARATOR.'manifest.json';

                if (! File::exists($manifestPath)) {
                    continue;
                }

                $manifest = json_decode(File::get($manifestPath), true) ?: [];
                $key = basename($familyDir).'/'.basename($versionDir);

                $templates[] = [
                    'key' => $key,
                    'name' => $manifest['name'] ?? $key,
                    'description' => $manifest['description'] ?? '',
                    'preview_url' => $this->safePreviewUrl($key, $manifest),
                ];
            }
        }

        return $templates;
    }

    private function safePreviewUrl(string $key, array $manifest): ?string
    {
        try {
            return $this->previewUrl($key);
        } catch (\Throwable) {
            $url = $manifest['preview_url'] ?? null;

            return is_string($url) ? $url : null;
        }
    }

    private function filesRoot(string $templateKey): string
    {
        $root = $this->templateRoot($templateKey);

        if ($this->isProjectLayout($templateKey)) {
            return $root;
        }

        return $root.DIRECTORY_SEPARATOR.'files';
    }

    /**
     * @param  array{files?: list<array{path: string}>, include?: list<string>, exclude_prefixes?: list<string>, exclude_names?: list<string>, max_file_bytes?: int}  $manifest
     * @return list<string>
     */
    private function resolvePaths(string $templateKey, array $manifest): array
    {
        if (isset($manifest['files']) && is_array($manifest['files']) && $manifest['files'] !== []) {
            return array_values(array_map(fn (array $file) => $file['path'], $manifest['files']));
        }

        $includes = $manifest['include'] ?? [];

        if ($includes === []) {
            throw new InvalidArgumentException("Template {$templateKey} has no files or include globs.");
        }

        return $this->collectIncludedPaths(
            $this->filesRoot($templateKey),
            $includes,
            $manifest['exclude_prefixes'] ?? [],
            $manifest['exclude_names'] ?? [],
            (int) ($manifest['max_file_bytes'] ?? 512_000),
        );
    }

    /**
     * @param  list<string>  $includes
     * @param  list<string>  $excludePrefixes
     * @param  list<string>  $excludeNames
     * @return list<string>
     */
    private function collectIncludedPaths(
        string $root,
        array $includes,
        array $excludePrefixes = [],
        array $excludeNames = [],
        int $maxFileBytes = 512_000,
    ): array {
        $realRoot = realpath($root);

        if ($realRoot === false) {
            return [];
        }

        $collected = [];

        foreach ($includes as $include) {
            foreach ($this->expandBraces($include) as $pattern) {
                $pattern = str_replace('\\', '/', $pattern);

                if ($pattern === '**/*' || $pattern === '**') {
                    $finder = Finder::create()
                        ->files()
                        ->in($realRoot)
                        ->ignoreDotFiles(false)
                        ->ignoreVCS(true);

                    foreach ($excludePrefixes as $prefix) {
                        $dir = rtrim($prefix, '/');
                        if ($dir !== '') {
                            $finder->exclude($dir);
                        }
                    }

                    foreach ($finder as $file) {
                        $relative = str_replace('\\', '/', substr($file->getRealPath(), strlen($realRoot) + 1));
                        $collected[$relative] = true;
                    }

                    continue;
                }

                if (! str_contains($pattern, '*')) {
                    $absolute = $realRoot.DIRECTORY_SEPARATOR.str_replace('/', DIRECTORY_SEPARATOR, $pattern);

                    if (is_file($absolute)) {
                        $collected[$pattern] = true;
                    }

                    continue;
                }

                if (str_contains($pattern, '/**/')) {
                    [$base, $name] = explode('/**/', $pattern, 2);
                    $basePath = $realRoot.DIRECTORY_SEPARATOR.str_replace('/', DIRECTORY_SEPARATOR, $base);

                    if (! is_dir($basePath)) {
                        continue;
                    }

                    $finder = Finder::create()->files()->in($basePath)->name($name);

                    foreach ($finder as $file) {
                        $relative = str_replace('\\', '/', substr($file->getRealPath(), strlen($realRoot) + 1));
                        $collected[$relative] = true;
                    }

                    continue;
                }

                $absolutePattern = $realRoot.DIRECTORY_SEPARATOR.str_replace('/', DIRECTORY_SEPARATOR, $pattern);

                foreach (glob($absolutePattern) ?: [] as $file) {
                    if (! is_file($file)) {
                        continue;
                    }

                    $realFile = realpath($file);

                    if ($realFile === false) {
                        continue;
                    }

                    $relative = str_replace('\\', '/', substr($realFile, strlen($realRoot) + 1));
                    $collected[$relative] = true;
                }
            }
        }

        $paths = [];

        foreach (array_keys($collected) as $relative) {
            if ($this->shouldExcludePath($relative, $excludePrefixes, $excludeNames)) {
                continue;
            }

            $absolute = $realRoot.DIRECTORY_SEPARATOR.str_replace('/', DIRECTORY_SEPARATOR, $relative);

            if (! is_file($absolute)) {
                continue;
            }

            if ($maxFileBytes > 0 && filesize($absolute) > $maxFileBytes) {
                continue;
            }

            $paths[] = $relative;
        }

        sort($paths);

        return $paths;
    }

    /**
     * @param  list<string>  $excludePrefixes
     * @param  list<string>  $excludeNames
     */
    private function shouldExcludePath(string $path, array $excludePrefixes, array $excludeNames): bool
    {
        $basename = basename($path);

        if (in_array($basename, $excludeNames, true)) {
            return true;
        }

        foreach ($excludePrefixes as $prefix) {
            $normalized = rtrim(str_replace('\\', '/', $prefix), '/');

            if ($normalized === '') {
                continue;
            }

            if ($path === $normalized || str_starts_with($path, $normalized.'/')) {
                return true;
            }
        }

        return false;
    }

    /** @return list<string> */
    private function expandBraces(string $pattern): array
    {
        if (! preg_match('/\{([^}]+)\}/', $pattern, $match)) {
            return [$pattern];
        }

        $options = explode(',', $match[1]);

        return array_map(
            fn (string $option) => str_replace('{'.$match[1].'}', trim($option), $pattern),
            $options,
        );
    }

    /** @param  list<string>  $readonlyPrefixes */
    private function isReadonlyPath(string $path, array $readonlyPrefixes): bool
    {
        foreach ($readonlyPrefixes as $prefix) {
            if ($path === rtrim($prefix, '/') || str_starts_with($path, $prefix)) {
                return true;
            }
        }

        return false;
    }

    private function languageForPath(string $path): string
    {
        $extension = strtolower(pathinfo($path, PATHINFO_EXTENSION));

        return match ($extension) {
            'php' => 'php',
            'ts', 'tsx' => 'typescript',
            'js', 'jsx' => 'javascript',
            'css' => 'css',
            'md' => 'markdown',
            'json' => 'json',
            'blade.php' => 'php',
            default => str_ends_with($path, '.blade.php') ? 'php' : 'plaintext',
        };
    }

    private function isBinaryPath(string $path): bool
    {
        $extension = strtolower(pathinfo($path, PATHINFO_EXTENSION));

        return in_array($extension, [
            'ico', 'png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'bmp',
            'woff', 'woff2', 'ttf', 'eot', 'otf',
            'zip', 'gz', 'tar', '7z', 'rar',
            'exe', 'dll', 'so', 'dylib',
            'sqlite', 'sqlite3', 'db',
            'pdf', 'mp3', 'mp4', 'webm',
        ], true);
    }

    private function looksBinary(string $absolutePath): bool
    {
        $handle = fopen($absolutePath, 'rb');

        if ($handle === false) {
            return true;
        }

        $chunk = fread($handle, 512);
        fclose($handle);

        if ($chunk === false || $chunk === '') {
            return false;
        }

        return str_contains($chunk, "\0");
    }

    private function templateRoot(string $templateKey): string
    {
        $normalized = str_replace(['..', '\\'], ['', '/'], $templateKey);

        return $this->basePath().DIRECTORY_SEPARATOR.str_replace('/', DIRECTORY_SEPARATOR, $normalized);
    }
}
