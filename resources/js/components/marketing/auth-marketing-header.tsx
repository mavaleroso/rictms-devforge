import AppLogo from '@/components/app-logo';
import { ThemeToggleButton } from '@/components/marketing/theme-toggle-button';
import { Button } from '@/components/catalyst/button';
import { Link } from '@inertiajs/react';

export type AuthMarketingVariant = 'login' | 'register' | 'default';

interface AuthMarketingHeaderProps {
    variant?: AuthMarketingVariant;
}

export function AuthMarketingHeader({ variant = 'default' }: AuthMarketingHeaderProps) {
    return (
        <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
            <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
                <Link href={route('home')} className="shrink-0">
                    <AppLogo />
                </Link>

                <div className="ml-auto flex items-center gap-2">
                    <ThemeToggleButton />

                    <Button href={route('home')} plain className="!text-sm">
                        Home
                    </Button>

                    {variant === 'login' && (
                        <Button href={route('register')} color="dark/zinc" className="!text-sm">
                            Create account
                        </Button>
                    )}

                    {variant === 'register' && (
                        <Button href={route('login')} color="dark/zinc" className="!text-sm">
                            Sign in
                        </Button>
                    )}
                </div>
            </div>
        </header>
    );
}
