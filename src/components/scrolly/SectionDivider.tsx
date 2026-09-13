interface SectionDividerProps {
    label: string;
}

export function SectionDivider({ label }: SectionDividerProps) {
    return (
        <div className="mb-6 pb-6 border-b border-border">
            <span className="text-sm font-bold uppercase tracking-wider text-success">
                {label}
            </span>
        </div>
    );
}
