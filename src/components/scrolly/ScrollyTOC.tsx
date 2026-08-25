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
            <button
                type="button"
                data-toc-toggle
                aria-label="Table of Contents"
                aria-expanded="false"
                className="fixed bottom-6 left-6 z-50 p-3 rounded-full bg-primary text-white shadow-lg hover:bg-primary/90 transition-colors lg:bottom-8 lg:left-8"
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
                    <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
                </svg>
            </button>

            <div data-toc-backdrop className="fixed inset-0 bg-black/40 z-40 lg:hidden hidden" />

            <div
                data-toc-panel
                className="fixed top-0 left-0 h-full w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto -translate-x-full"
            >
                <div className="p-4 pt-20">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-4">
                        Daftar Isi
                    </h3>
                    {sections.map((section, sIdx) => (
                        <div key={sIdx} className={sIdx > 0 ? 'mt-6' : ''}>
                            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                                {section.label}
                            </h4>
                            <ul className="space-y-1">
                                {section.items.map((item) => (
                                    <li key={item.id}>
                                        <button
                                            type="button"
                                            data-toc-item
                                            data-toc-target={item.id}
                                            className="w-full text-left px-3 py-2 rounded-lg text-sm transition-colors text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
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
