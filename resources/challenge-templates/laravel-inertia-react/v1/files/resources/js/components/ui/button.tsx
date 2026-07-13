import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

type ButtonProps = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>> & {
    variant?: 'primary' | 'secondary';
};

export function Button({ children, variant = 'primary', className = '', ...props }: ButtonProps) {
    const styles =
        variant === 'primary'
            ? 'bg-zinc-900 text-white hover:bg-zinc-800'
            : 'border border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-50';

    return (
        <button
            type="button"
            className={`inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium ${styles} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
