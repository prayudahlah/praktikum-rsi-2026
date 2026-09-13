interface SectionDividerProps {
    label: string;
}

export function SectionDivider({ label }: SectionDividerProps) {
    return (
        <h2 className="mb-6 flex items-center gap-3 font-display text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            <span aria-hidden="true" className="h-6 w-1 shrink-0 rounded-full bg-primary md:h-7" />
            {label}
        </h2>
    );
}
