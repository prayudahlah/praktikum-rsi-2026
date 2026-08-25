import type { ReactNode } from 'react';
import { DiagramPlaceholder } from './DiagramPlaceholder';

interface ScrollyLayoutProps {
    children: ReactNode;
    defaultSrc?: string;
    placeholder?: boolean;
}

export function ScrollyLayout({ children, defaultSrc, placeholder }: ScrollyLayoutProps) {
    return (
        <>
            <div className="flex flex-col lg:flex-row">
                <div className="lg:w-1/2 order-2 lg:order-1">
                    {children}
                </div>
                <div className="relative h-[40vh] sticky top-14 lg:h-[calc(100vh-3.5rem)] order-1 lg:order-2 shrink-0 lg:w-1/2 z-10">
                    <div
                        id="scrolly-diagram-content"
                        className="relative h-full min-h-0 flex items-center justify-center bg-gray-100/80 dark:bg-gray-700/20 backdrop-blur-sm border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-700 overflow-hidden rounded-lg lg:rounded-none"
                    >
                        {placeholder ? (
                            <DiagramPlaceholder />
                        ) : defaultSrc ? (
                            <div className="w-full h-full min-h-0 min-w-0 p-2 flex items-center justify-center">
                                <img
                                    id="scrolly-diagram"
                                    src={defaultSrc}
                                    alt="Diagram"
                                    className="w-full h-full min-h-0 min-w-0 object-contain opacity-0 transition-opacity duration-300 select-none cursor-pointer hover:opacity-90"
                                    draggable="false"
                                />
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>

            {/* Modal overlay — expand diagram */}
            <div
                id="scrolly-modal"
                className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-[6px] opacity-0 pointer-events-none transition-opacity duration-300 overflow-hidden"
            >
                <button
                    id="scrolly-modal-close"
                    className="absolute top-6 right-6 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white backdrop-blur-sm transition-colors flex items-center justify-center"
                    title="Tutup"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>
                <div
                    id="scrolly-modal-wrapper"
                    className="w-full h-full flex items-center justify-center overflow-hidden"
                >
                    <img
                        id="scrolly-modal-img"
                        alt="Diagram (perbesar)"
                        className="max-w-[85vw] max-h-[85vh] object-contain rounded-lg shadow-2xl select-none"
                        draggable="false"
                        style={{ cursor: 'grab', transition: 'transform 0.2s' }}
                    />
                </div>
                <div
                    id="scrolly-zoom-badge"
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/15 backdrop-blur-md text-white/90 text-xs font-semibold px-4 py-2 rounded-full opacity-0 transition-opacity duration-300 pointer-events-none select-none border border-white/10"
                >
                    100%
                </div>
            </div>
        </>
    );
}
