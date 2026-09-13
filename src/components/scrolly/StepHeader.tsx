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
        ? 'text-2xl md:text-3xl font-bold mb-4 tracking-tight'
        : 'text-xl md:text-2xl font-bold mb-3 tracking-tight';

    return (
        <>
            <span className="inline-block font-mono text-xs md:text-sm tracking-widest text-muted-foreground uppercase mb-2">
                {kicker}
            </span>
            <Heading className={`${headingClass} ${tone ? toneClasses[tone] : ''}`}>
                {title}
            </Heading>
        </>
    );
}
