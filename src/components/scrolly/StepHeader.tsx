import type { ReactNode } from 'react';

export type StepTone = 'primary' | 'success' | 'accent' | 'warning' | 'error';

const toneClasses: Record<StepTone, string> = {
    primary: 'text-primary',
    success: 'text-success',
    accent: 'text-accent',
    warning: 'text-warning',
    error: 'text-error',
};

interface StepHeaderProps {
    kicker: string;
    title: ReactNode;
    tone?: StepTone;
    level?: 2 | 3;
}

export function StepHeader({ kicker, title, tone, level = 3 }: StepHeaderProps) {
    const Heading = level === 2 ? 'h2' : 'h3';
    const headingClass = level === 2
        ? 'text-4xl font-bold mb-4'
        : 'text-2xl font-bold mb-3';

    return (
        <>
            <span className="inline-block font-mono text-sm tracking-widest text-gray-400 dark:text-gray-600 uppercase mb-2">
                {kicker}
            </span>
            <Heading className={`${headingClass} ${tone ? toneClasses[tone] : ''}`}>
                {title}
            </Heading>
        </>
    );
}
