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
            className={`h-screen lg:scroll-mt-0 flex py-12 lg:py-20 step-enter ${className}`}
        >
            <div className="p-6 lg:p-8 w-full">
                {children}
            </div>
        </div>
    );
}
