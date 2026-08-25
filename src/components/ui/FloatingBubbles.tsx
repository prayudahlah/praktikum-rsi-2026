import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

const iconModules = import.meta.glob('/src/assets/icons/tech/*.svg', {
    query: '?raw',
    import: 'default',
    eager: true
});

const BUBBLE_CONFIG = {
    maxBubbles: 10,
    sizeMin: 50,
    sizeMax: 100,
    opacityMin: 0.15,
    opacityMax: 0.45,
    durationMin: 20,
    durationMax: 55,
    wobbleAmplitude: 40,
};

interface Bubble {
    id: string;
    icon: string;
    size: number;
    x: number;
    duration: number;
    progress: number;
    opacity: number;
}

function shuffleArray<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

export function FloatingBubbles() {
    const [bubbles, setBubbles] = useState<Bubble[]>([]);
    const [windowHeight, setWindowHeight] = useState(1000);

    useEffect(() => {
        setWindowHeight(window.innerHeight);

        const iconPaths = Object.values(iconModules) as string[];
        if (iconPaths.length === 0) return;

        let shuffledIcons = shuffleArray(iconPaths);
        let iconIndex = 0;

        const generatedBubbles = Array.from({ length: BUBBLE_CONFIG.maxBubbles }).map((_, i) => {
            if (iconIndex >= shuffledIcons.length) {
                shuffledIcons = shuffleArray(iconPaths);
                iconIndex = 0;
            }

            const selectedIcon = shuffledIcons[iconIndex];
            iconIndex++;

            const size = BUBBLE_CONFIG.sizeMin + Math.random() * (BUBBLE_CONFIG.sizeMax - BUBBLE_CONFIG.sizeMin);
            const sizeRatio = (size - BUBBLE_CONFIG.sizeMin) / (BUBBLE_CONFIG.sizeMax - BUBBLE_CONFIG.sizeMin);
            const opacity = BUBBLE_CONFIG.opacityMin + (sizeRatio * (BUBBLE_CONFIG.opacityMax - BUBBLE_CONFIG.opacityMin));
            const duration = BUBBLE_CONFIG.durationMin + Math.random() * (BUBBLE_CONFIG.durationMax - BUBBLE_CONFIG.durationMin);

            return {
                id: `bubble-${i}`,
                icon: selectedIcon,
                size: size,
                x: 5 + Math.random() * 85,
                duration: duration,
                progress: Math.random(),
                opacity: opacity,
            };
        });

        setBubbles(generatedBubbles);
    }, []);

    // Saat diklik, gelembung langsung dihapus dari state bubbles secara permanen (tidak respawn)
    const handlePop = (id: string) => {
        setBubbles((prev) => prev.filter((bubble) => bubble.id !== id));
    };

    if (bubbles.length === 0) return null;

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <AnimatePresence>
                {bubbles.map((bubble, i) => {
                    const startY = 0;
                    const endY = -(windowHeight + 300);
                    const totalDistance = startY - endY;

                    const initialY = startY - (totalDistance * bubble.progress);
                    const timeToTop = 1 - bubble.progress;

                    return (
                        <motion.div
                            key={bubble.id}
                            className="absolute rounded-full border border-gray-300/30 dark:border-gray-600/30 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm flex items-center justify-center shadow-lg pointer-events-auto cursor-pointer"
                            style={{
                                width: bubble.size,
                                height: bubble.size,
                                left: `${bubble.x}%`,
                                bottom: -150,
                                opacity: bubble.opacity,
                            }}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{
                                y: [initialY, endY, startY, initialY],
                                x: [0, Math.sin(i) * BUBBLE_CONFIG.wobbleAmplitude, 0],
                                scale: 1,
                                opacity: bubble.opacity,
                            }}
                            exit={{
                                scale: 1.5,
                                opacity: 0,
                                transition: { duration: 0.2 }
                            }}
                            transition={{
                                y: {
                                    duration: bubble.duration,
                                    repeat: Infinity,
                                    ease: 'linear',
                                    times: [0, timeToTop, timeToTop, 1]
                                },
                                x: {
                                    duration: bubble.duration / 1.5,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                },
                            }}
                            onClick={() => handlePop(bubble.id)}
                        >
                            <div
                                className="w-1/2 h-1/2 flex items-center justify-center opacity-80 text-gray-800 dark:text-gray-200 [&>svg]:w-full [&>svg]:h-full [&>svg]:fill-current [&>svg]:stroke-current"
                                dangerouslySetInnerHTML={{ __html: bubble.icon }}
                            />
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
}
