import { Subheading } from '@/components/catalyst/heading';
import { Text } from '@/components/catalyst/text';

export default function HeadingSmall({ title, description }: { title: string; description?: string }) {
    return (
        <header className="space-y-1">
            <Subheading>{title}</Subheading>
            {description && <Text>{description}</Text>}
        </header>
    );
}
