import AuthSplitLayout from '@/layouts/auth/auth-split-layout';
import type { AuthMarketingVariant } from '@/components/marketing/auth-marketing-header';

export default function AuthLayout({
    children,
    title,
    description,
    variant = 'default',
    aside = 'hero',
}: {
    children: React.ReactNode;
    title: string;
    description: string;
    variant?: AuthMarketingVariant;
    aside?: 'hero' | 'tracks';
}) {
    return (
        <AuthSplitLayout title={title} description={description} variant={variant} aside={aside}>
            {children}
        </AuthSplitLayout>
    );
}
