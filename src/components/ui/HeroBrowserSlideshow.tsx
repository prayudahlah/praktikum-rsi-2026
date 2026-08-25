import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

import mascotNormal from '/src/assets/mascot/orange-cat.webp?url';
import mascotDragging from '/src/assets/mascot/orange-cat-flying.webp?url';

const imageModules = import.meta.glob('/src/assets/diagrams/*.webp', {
    query: '?url',
    import: 'default',
    eager: true
});

export function HeroBrowserSlideshow() {
    const [images, setImages] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showQuote, setShowQuote] = useState(false);
    const [currentQuote, setCurrentQuote] = useState("");

    const [isDragging, setIsDragging] = useState(false);
    const [isCatVisible, setIsCatVisible] = useState(true);
    const [screenHeight, setScreenHeight] = useState(1000);

    const quoteTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const quotes = [
        "Lagi debug apa nih? Semangat ya!",
        "Struktur database-nya sudah rapi belum?",
        "Jangan lupa push ke Git, nanti lupa lho.",
        "Kucing juga tahu kalau RSI itu susah-susah gampang.",
        "Satu baris kode hari ini, satu langkah lebih dekat ke lulus!"
    ];

    useEffect(() => {
        setScreenHeight(window.innerHeight);
        const urls = Object.values(imageModules) as string[];
        setImages(urls);
    }, []);

    useEffect(() => {
        if (images.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 4000);
        return () => clearInterval(timer);
    }, [images.length]);

    useEffect(() => {
        return () => {
            if (quoteTimerRef.current) clearTimeout(quoteTimerRef.current);
        };
    }, []);

    const showQuoteThenHide = (delay: number) => {
        setShowQuote(true);
        if (quoteTimerRef.current) clearTimeout(quoteTimerRef.current);
        quoteTimerRef.current = setTimeout(() => setShowQuote(false), delay);
    };

    const handleCatClick = (e: React.MouseEvent) => {
        if (isDragging) return;
        e.stopPropagation();
        const randomMsg = quotes[Math.floor(Math.random() * quotes.length)];
        setCurrentQuote(randomMsg);
        showQuoteThenHide(3000);
    };

    if (images.length === 0) return null;

    return (
        <div className="w-full max-w-xl mx-auto pt-10">
            <motion.div
                className="relative shadow-2xl shadow-blue-900/10 dark:shadow-blue-900/35 overflow-visible border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md"
                animate={{ y: [-8, 8, -8] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            >
                {/* --- SI KUCING DRAGGABLE --- */}
                <div className="absolute -top-12 right-5 z-50 select-none pointer-events-none overflow-visible">
                    <AnimatePresence>
                        {/* Quote tetap muncul saat drag atau selama durasi extend setelah drop */}
                        {showQuote && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="absolute -top-16 right-0 w-48 bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 text-xs text-gray-700 dark:text-gray-300 text-center font-medium pointer-events-auto z-50 cat-chat-bubble"
                            >
                                {currentQuote}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                        {isCatVisible && (
                            <motion.img
                                src={isDragging ? mascotDragging : mascotNormal}
                                alt="Mascot Kucing"
                                className={`w-25 object-contain cursor-grab active:cursor-grabbing ${isCatVisible ? 'pointer-events-auto' : 'pointer-events-none'}`}
                                drag={isCatVisible}
                                dragElastic={0.2}
                                onDragStart={() => {
                                    setIsDragging(true);
                                    setCurrentQuote("Kyaaa! 🙀");
                                    setShowQuote(true);
                                }}
                                onDragEnd={() => {
                                    setIsDragging(false);
                                    setIsCatVisible(false);
                                    showQuoteThenHide(3000);
                                }}
                                initial={{ y: 0, opacity: 1, rotate: 0 }}
                                exit={{
                                    y: screenHeight + 600,
                                    opacity: [1, 0.2, 0],
                                    rotate: 270,
                                    scale: 0.25,
                                    transition: { duration: 1.2, ease: "easeIn" }
                                }}
                                whileHover={{ scale: 1.1, rotate: 1 }}
                                onClick={handleCatClick}
                            />
                        )}
                    </AnimatePresence>
                </div>

                {/* Browser Top Bar */}
                <div className="flex items-center px-4 py-3 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex space-x-2">
                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                </div>

                {/* Slideshow */}
                <div className="relative aspect-video bg-gray-50 dark:bg-gray-950 overflow-hidden flex items-center justify-center p-4">
                    <AnimatePresence mode="wait">
                        <motion.img
                            key={currentIndex}
                            src={images[currentIndex]}
                            alt={`Diagram ${currentIndex + 1}`}
                            className="absolute inset-0 w-full h-full object-contain p-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.8 }}
                        />
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}
