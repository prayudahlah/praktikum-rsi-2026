import { useScroll, useSpring, motion } from 'framer-motion';

export function ScrollProgress() {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
    });

    return (
        <motion.div
            className="fixed top-14 left-0 right-0 h-1 bg-primary origin-left z-39"
            style={{ scaleX }}
        />
    );
}

