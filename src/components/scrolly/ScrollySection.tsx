import type { ReactNode } from 'react';

interface ScrollySectionProps {
    children: ReactNode;
}

export function ScrollySection({ children }: ScrollySectionProps) {
    return (
        <div className='border-y border-border'>
            {children}
        </div>
    );
}
