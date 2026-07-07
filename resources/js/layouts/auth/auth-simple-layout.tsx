import { AuthLayout } from '@/components/catalyst/auth-layout';
import AppLogoIcon from '@/components/app-logo-icon';
import { Heading } from '@/components/catalyst/heading';
import { Link } from '@/components/catalyst/link';
import { Text } from '@/components/catalyst/text';

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    description: string;
}

export default function AuthSimpleLayout({ children, title, description }: AuthLayoutProps) {
    return (
        <AuthLayout>
            <div className="grid w-full max-w-sm grid-cols-1 gap-8">
                <Link href={route('home')} className="flex items-center gap-2 self-center">
                    <AppLogoIcon className="h-8 fill-zinc-950 dark:fill-white" />
                </Link>

                <div className="space-y-2 text-center">
                    <Heading>{title}</Heading>
                    <Text>{description}</Text>
                </div>

                {children}
            </div>
        </AuthLayout>
    );
}
