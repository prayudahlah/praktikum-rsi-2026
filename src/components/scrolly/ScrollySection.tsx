import type { ReactNode } from 'react';

interface ScrollySectionProps {
    children: ReactNode;
    className?: string;
}

export function ScrollySection({ children, className = '' }: ScrollySectionProps) {
    return (
        <div className={`border-y border-border ${className}`}>
            {children}
        </div>
    );
}
