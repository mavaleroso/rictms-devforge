import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <span className="flex min-w-0 items-center gap-3">
            <span className="flex size-8 items-center justify-center rounded-lg bg-zinc-950 dark:bg-white">
                <AppLogoIcon className="size-5 fill-white dark:fill-zinc-950" />
            </span>
            <span className="truncate text-sm font-semibold text-zinc-950 dark:text-white">DevForge</span>
        </span>
    );
}
