export interface TOCSection {
    label: string;
    items: { id: string; title: string }[];
}

interface ScrollyTOCProps {
    sections: TOCSection[];
}

type TocVariant = 'rail' | 'drawer';

function TocList({ sections, variant }: { sections: TOCSection[]; variant: TocVariant }) {
    const isRail = variant === 'rail';

    const itemClass = isRail
        ? 'text-left text-xs leading-snug text-foreground/70 transition-colors hover:text-foreground'
        : 'w-full text-left px-3 py-2 rounded-lg text-xs transition-colors text-foreground/80 hover:bg-hover';

    const groupClass = isRail ? 'mt-4 border-t border-border/60 pt-3' : 'mt-6';
    const listClass = isRail ? 'space-y-0.5 pl-2' : 'space-y-1';
    const headingClass = isRail
        ? 'block text-sm font-bold uppercase tracking-wider text-muted-foreground mb-1.5 transition-colors hover:text-foreground'
        : 'text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2';

    return (
        <>
            {sections.map((section, sIdx) => {
                const firstId = section.items[0]?.id;
                return (
                    <div key={sIdx} className={sIdx > 0 ? groupClass : ''}>
                        {isRail ? (
                            firstId
                                ? <a href={`#${firstId}`} className={headingClass}>{section.label}</a>
                                : <span className={headingClass}>{section.label}</span>
                        ) : (
                            <h4 className={headingClass}>{section.label}</h4>
                        )}
                        <ul className={listClass}>
                            {section.items.map((item) => (
                                <li key={item.id}>
                                    <button
                                        type="button"
                                        data-toc-item
                                        data-toc-target={item.id}
                                        className={itemClass}
                                    >
                                        {item.title}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            })}
        </>
    );
}

export function ScrollyTOC({ sections }: ScrollyTOCProps) {
    return (
        <>
            {/* Static rail (desktop) */}
            <nav
                id="toc-rail"
                aria-label="Daftar isi"
                className="hidden lg:block fixed left-0 top-14 z-30 h-[calc(100vh-3.5rem)] w-60 overflow-y-auto border-r border-border bg-surface-raised"
            >
                <div className="px-4 py-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground pb-2 mb-3 border-b border-border">
                        Daftar Isi
                    </h3>
                    <TocList sections={sections} variant="rail" />
                </div>
            </nav>

            {/* Drawer (mobile) */}
            <div data-toc-backdrop className="fixed inset-0 bg-black/40 z-40 hidden lg:hidden" />

            <div
                id="toc-panel"
                data-toc-panel
                role="dialog"
                aria-modal="true"
                aria-label="Daftar isi"
                className="fixed top-0 right-0 h-full w-[85vw] max-w-xs bg-surface-raised border-l border-border z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto translate-x-full lg:hidden"
            >
                <div className="p-4 pt-4">
                    <div className="flex items-center justify-between pb-3 mb-4 border-b border-border">
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
                    <TocList sections={sections} variant="drawer" />
                </div>
            </div>
        </>
    );
}
