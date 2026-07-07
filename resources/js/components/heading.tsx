import { Heading } from '@/components/catalyst/heading';
import { Text } from '@/components/catalyst/text';

export default function HeadingBlock({ title, description }: { title: string; description?: string }) {
    return (
        <div className="mb-8 space-y-1">
            <Heading level={2}>{title}</Heading>
            {description && <Text>{description}</Text>}
        </div>
    );
}
