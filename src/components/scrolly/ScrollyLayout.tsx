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
            <div id="scrolly-split" className="flex flex-col lg:flex-row">
                <div id="scrolly-text-col" className="order-2 lg:order-1 lg:flex-none lg:w-1/2">
                    {children}
                </div>
                <div id="scrolly-diagram-col" className="relative h-[40vh] sticky top-14 lg:h-[calc(100vh-3.5rem)] order-1 lg:order-2 lg:flex-1 lg:min-w-0 z-10">
                    <div
                        id="scrolly-divider"
                        role="separator"
                        aria-label="Atur lebar kolom teks dan diagram"
                        aria-orientation="vertical"
                        aria-valuemin={30}
                        aria-valuemax={70}
                        aria-valuenow={50}
                        className="hidden lg:block absolute left-0 top-0 z-20 h-full w-3 -translate-x-1/2 cursor-col-resize group"
                    >
                        <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gray-300/70 dark:bg-gray-600/70 transition-colors group-hover:bg-primary group-active:bg-primary" />
                        <span className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 scale-75 flex-col items-center gap-[3px] rounded-full bg-gray-200 px-[3px] py-2 opacity-0 transition-all duration-150 group-hover:scale-100 group-hover:bg-primary group-hover:opacity-100 group-active:scale-100 group-active:bg-primary group-active:opacity-100 dark:bg-gray-600">
                            <span className="h-1 w-1 rounded-full bg-gray-500 dark:bg-gray-300 group-hover:bg-white" />
                            <span className="h-1 w-1 rounded-full bg-gray-500 dark:bg-gray-300 group-hover:bg-white" />
                            <span className="h-1 w-1 rounded-full bg-gray-500 dark:bg-gray-300 group-hover:bg-white" />
                        </span>
                    </div>
                    <div
                        id="scrolly-diagram-content"
                        className="relative h-full min-h-0 flex items-center justify-center bg-gray-100/80 dark:bg-gray-700/20 backdrop-blur-sm border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-700 overflow-hidden rounded-lg lg:rounded-none"
                    >
                        <div
                            id="scrolly-placeholder"
                            className={`w-full h-full ${placeholder ? '' : 'hidden'}`}
                        >
                            <DiagramPlaceholder />
                        </div>
                        {defaultSrc ? (
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
