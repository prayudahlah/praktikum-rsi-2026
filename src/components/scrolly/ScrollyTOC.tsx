export interface TOCSection {
    label: string;
    items: { id: string; title: string }[];
}

interface ScrollyTOCProps {
    sections: TOCSection[];
}

export function ScrollyTOC({ sections }: ScrollyTOCProps) {
    return (
        <>
            <div data-toc-backdrop className="fixed inset-0 bg-black/40 z-40 hidden" />

            <div
                id="toc-panel"
                data-toc-panel
                role="dialog"
                aria-modal="true"
                aria-label="Daftar isi"
                className="fixed top-0 right-0 h-full w-72 bg-surface-raised border-l border-border z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto translate-x-full"
            >
                <div className="p-4 pt-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                            Daftar Isi
                        </h3>
                        <button
                            type="button"
                            data-toc-close
                            aria-label="Tutup daftar isi"
                            className="p-1 rounded hover:bg-hover transition-colors"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>
                    {sections.map((section, sIdx) => (
                        <div key={sIdx} className={sIdx > 0 ? 'mt-6' : ''}>
                            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                                {section.label}
                            </h4>
                            <ul className="space-y-1">
                                {section.items.map((item) => (
                                    <li key={item.id}>
                                        <button
                                            type="button"
                                            data-toc-item
                                            data-toc-target={item.id}
                                             className="w-full text-left px-3 py-2 rounded-lg text-sm transition-colors text-foreground/80 hover:bg-hover"
                                        >
                                            {item.title}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
