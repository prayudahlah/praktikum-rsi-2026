interface DiagramPlaceholderProps {
    label?: string;
}

export function DiagramPlaceholder({ label = 'Diagram Area' }: DiagramPlaceholderProps) {
    return (
        <div className="h-full flex items-center justify-center bg-muted backdrop-blur-sm border-b lg:border-b-0 lg:border-r border-border overflow-hidden rounded-lg lg:rounded-none">
            <div className="text-center">
                <div className="w-full h-64 bg-linear-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-xl flex items-center justify-center border-2 border-dashed border-border">
                    <div className="text-center">
                        <p className="text-muted-foreground mb-2">{label}</p>
                        <p className="text-xs text-muted-foreground">Asset akan ditambahkan nanti</p>
                    </div>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                    Scroll narrative untuk melihat perubahan
                </p>
            </div>
        </div>
    );
}
