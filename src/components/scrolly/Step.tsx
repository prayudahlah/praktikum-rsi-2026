import type { ReactNode } from 'react';

interface StepProps {
    id: string;
    children: ReactNode;
    className?: string;
    diagram?: string;
}

export function Step({ id, children, className = '', diagram }: StepProps) {
    return (
        <div
            id={id}
            data-diagram={diagram}
            className={`min-h-[50vh] flex py-8 border-t border-border first:border-t-0 scroll-mt-16 lg:scroll-mt-20 step-enter ${className}`}
        >
            <div className="p-6 lg:p-8 w-full max-w-[72ch]">
                {children}
            </div>
        </div>
    );
}
