import { Switch } from '@/components/catalyst/switch';
import { useToast } from '@/components/toast/toast-provider';
import { FetchJsonError, fetchJson } from '@/lib/fetch-json';
import { queryClient } from '@/lib/query-client';
import { useMutation } from '@tanstack/react-query';
import clsx from 'clsx';

interface UserActiveToggleProps {
    userId: number;
    userName: string;
    isActive: boolean;
    disabled?: boolean;
    disabledReason?: string;
}

interface UserResourceResponse {
    data: {
        id: number;
        is_active: boolean;
    };
}

export function UserActiveToggle({
    userId,
    userName,
    isActive,
    disabled = false,
    disabledReason,
}: UserActiveToggleProps) {
    const { showSuccess, show } = useToast();

    const mutation = useMutation({
        mutationFn: (nextActive: boolean) =>
            fetchJson<UserResourceResponse>(route('admin.users.update-active', userId), {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_active: nextActive }),
            }),
        onSuccess: (_, nextActive) => {
            queryClient.invalidateQueries({ queryKey: ['admin.users.table'] });

            showSuccess(
                nextActive ? 'User activated' : 'User deactivated',
                nextActive ? `${userName} can sign in again.` : `${userName} can no longer sign in.`,
            );
        },
        onError: (error) => {
            show({
                variant: 'error',
                title: 'Status update failed',
                message: error instanceof FetchJsonError ? error.message : 'Unable to update user status.',
            });
        },
    });

    const isDisabled = disabled || mutation.isPending;

    return (
        <div className="flex items-center gap-2.5">
            <Switch
                color={isActive ? 'green' : 'zinc'}
                checked={isActive}
                disabled={isDisabled}
                onChange={(checked) => mutation.mutate(checked)}
                aria-label={`Set ${userName} as ${isActive ? 'active' : 'inactive'}`}
            />
            <div className="min-w-0">
                <p
                    className={clsx(
                        'text-xs font-medium',
                        isActive ? 'text-emerald-700 dark:text-emerald-400' : 'text-zinc-500 dark:text-zinc-400',
                    )}
                >
                    {isActive ? 'Active' : 'Inactive'}
                </p>
                {disabled && disabledReason && (
                    <p className="text-[10px] text-zinc-400 dark:text-zinc-500">{disabledReason}</p>
                )}
            </div>
        </div>
    );
}
