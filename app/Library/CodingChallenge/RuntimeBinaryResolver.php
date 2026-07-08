<?php

namespace App\Library\CodingChallenge;

use App\Enums\ChallengeLanguage;
use Symfony\Component\Process\Process;

final class RuntimeBinaryResolver
{
    public static function resolve(ChallengeLanguage $language): string
    {
        return match ($language) {
            ChallengeLanguage::Php => self::resolvePhp(),
            ChallengeLanguage::Javascript => self::resolveConfiguredOrDefault('javascript', 'node'),
            ChallengeLanguage::Python => self::resolveConfiguredOrDefault('python', 'python'),
        };
    }

    public static function resolvePhp(): string
    {
        $configured = config('coding-challenges.binaries.php');

        if (is_string($configured) && $configured !== '' && self::isPhpExecutable($configured)) {
            return $configured;
        }

        if (self::isPhpExecutable(PHP_BINARY)) {
            return PHP_BINARY;
        }

        $fromExtensionDir = self::phpFromExtensionDir();

        if ($fromExtensionDir !== null) {
            return $fromExtensionDir;
        }

        foreach (['php', 'php.exe'] as $candidate) {
            if (self::canRunPhpProbe($candidate)) {
                return $candidate;
            }
        }

        return 'php';
    }

    private static function resolveConfiguredOrDefault(string $key, string $fallback): string
    {
        $configured = config("coding-challenges.binaries.{$key}");

        return is_string($configured) && $configured !== '' ? $configured : $fallback;
    }

    private static function phpFromExtensionDir(): ?string
    {
        $extensionDir = ini_get('extension_dir');

        if (! is_string($extensionDir) || $extensionDir === '') {
            return null;
        }

        $binary = rtrim($extensionDir, '/\\').(PHP_OS_FAMILY === 'Windows' ? '\\php.exe' : '/php');

        return self::isPhpExecutable($binary) ? $binary : null;
    }

    private static function isPhpExecutable(string $path): bool
    {
        $basename = strtolower(basename($path));

        if (str_contains($basename, 'httpd') || str_contains($basename, 'apache')) {
            return false;
        }

        if (! str_contains($basename, 'php')) {
            return false;
        }

        return is_file($path);
    }

    private static function canRunPhpProbe(string $binary): bool
    {
        $process = new Process([$binary, '-r', 'echo "ok";']);
        $process->setTimeout(5);

        try {
            $process->run();
        } catch (\Throwable) {
            return false;
        }

        return $process->isSuccessful() && trim($process->getOutput()) === 'ok';
    }
}
